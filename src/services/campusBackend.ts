'use client';

import { auth, db, firebaseConfigured, storage } from '@/firebase/config';
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  where,
  writeBatch,
  type DocumentData,
  type QueryDocumentSnapshot,
  type Unsubscribe,
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import type {
  CampusCase,
  CampusConfession,
  CampusEvent,
  CampusNotification,
  CampusPost,
  ModerationItem,
} from '@/store/campusStore';

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

function userOrThrow() {
  const user = auth.currentUser;
  if (!firebaseConfigured || !user) throw new Error('Sign in to sync this action with CampusAI Cloud.');
  return user;
}

export function canUseCampusCloud() {
  return firebaseConfigured && Boolean(auth.currentUser);
}

function clean<T extends object>(value: T) {
  return Object.fromEntries(Object.entries(value).filter(([, item]) => item !== undefined));
}

function elapsed(data: DocumentData) {
  const value = data.createdAt?.toMillis?.();
  if (!value) return data.time || 'Now';
  const minutes = Math.max(0, Math.floor((Date.now() - value) / 60000));
  if (minutes < 60) return `${minutes || 1}m ago`;
  if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`;
  return `${Math.floor(minutes / 1440)}d ago`;
}

function newestFirst(a: QueryDocumentSnapshot, b: QueryDocumentSnapshot) {
  return (b.data().createdAt?.toMillis?.() || 0) - (a.data().createdAt?.toMillis?.() || 0);
}

export async function uploadCampusImage(file: File, area: 'events' | 'feed' | 'lost-found') {
  const user = userOrThrow();
  if (!file.type.startsWith('image/')) throw new Error('Choose an image file.');
  if (file.size > MAX_IMAGE_BYTES) throw new Error('Images must be 5 MB or smaller.');
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-');
  const imageRef = ref(storage, `uploads/${user.uid}/${area}/${crypto.randomUUID()}-${safeName}`);
  await uploadBytes(imageRef, file, { contentType: file.type });
  return getDownloadURL(imageRef);
}

export type CampusSyncHandlers = {
  events: (items: CampusEvent[]) => void;
  cases: (items: CampusCase[]) => void;
  posts: (items: CampusPost[]) => void;
  confessions: (items: CampusConfession[]) => void;
  notifications: (items: CampusNotification[]) => void;
  moderation: (items: ModerationItem[]) => void;
  rsvps: (items: Record<string, 'rsvp' | 'waitlist'>) => void;
  live: () => void;
  error: (message: string) => void;
};

export function subscribeCampusCloud(role: string | undefined, handlers: CampusSyncHandlers) {
  const user = auth.currentUser;
  if (!firebaseConfigured || !user) return () => undefined;
  const staff = role === 'faculty' || role === 'moderator' || role === 'admin';
  const moderator = role === 'moderator' || role === 'admin';
  const unsubscribers: Unsubscribe[] = [];
  const fail = (error: Error) => handlers.error(error.message);
  let firstSnapshot = false;
  const ready = () => { if (!firstSnapshot) { firstSnapshot = true; handlers.live(); } };

  const eventQuery = staff ? collection(db, 'events') : query(collection(db, 'events'), where('approval', '==', 'approved'));
  unsubscribers.push(onSnapshot(eventQuery, snapshot => {
    handlers.events(snapshot.docs.sort(newestFirst).map(item => ({ id: item.id, ...item.data() } as CampusEvent)));
    ready();
  }, fail));

  unsubscribers.push(onSnapshot(query(collection(db, 'posts'), where('moderationStatus', '==', 'approved')), snapshot => {
    handlers.posts(snapshot.docs.sort(newestFirst).map(item => {
      const data = item.data();
      return { id: item.id, ...data, time: elapsed(data) } as CampusPost;
    }));
  }, fail));

  unsubscribers.push(onSnapshot(query(collection(db, 'confessions'), where('moderationStatus', '==', 'approved')), snapshot => {
    handlers.confessions(snapshot.docs.sort(newestFirst).map(item => ({ id: item.id, ...item.data(), status: 'approved' } as CampusConfession)));
  }, fail));

  unsubscribers.push(onSnapshot(collection(db, 'lostItems'), snapshot => {
    handlers.cases(snapshot.docs.sort(newestFirst).map(item => {
      const data = item.data();
      return { id: item.id, ...data, time: elapsed(data) } as CampusCase;
    }));
  }, fail));

  unsubscribers.push(onSnapshot(collection(db, 'users', user.uid, 'notifications'), snapshot => {
    handlers.notifications(snapshot.docs.sort(newestFirst).map(item => ({ id: item.id, ...item.data(), time: elapsed(item.data()) } as CampusNotification)));
  }, fail));

  unsubscribers.push(onSnapshot(query(collection(db, 'eventRsvps'), where('userId', '==', user.uid)), snapshot => {
    const values: Record<string, 'rsvp' | 'waitlist'> = {};
    snapshot.docs.forEach(item => { values[item.data().eventId] = item.data().status; });
    handlers.rsvps(values);
  }, fail));

  if (moderator) {
    unsubscribers.push(onSnapshot(collection(db, 'moderation'), snapshot => {
      handlers.moderation(snapshot.docs.sort(newestFirst).map(item => ({ id: item.id, ...item.data() } as ModerationItem)));
    }, fail));
  }

  return () => unsubscribers.forEach(unsubscribe => unsubscribe());
}

export async function saveEvent(event: CampusEvent, file?: File) {
  const user = userOrThrow();
  const image = file ? await uploadCampusImage(file, 'events') : event.image;
  const moderationId = `event-${event.id}`;
  const batch = writeBatch(db);
  batch.set(doc(db, 'events', event.id), clean({ ...event, image, organizerId: user.uid, organizerName: user.displayName || user.email || 'Campus member', approval: 'pending', createdAt: serverTimestamp() }));
  batch.set(doc(db, 'moderation', moderationId), { kind: 'event', label: event.name, reason: 'New event requires university approval', status: 'pending', targetCollection: 'events', targetId: event.id, submittedBy: user.uid, createdAt: serverTimestamp() });
  await batch.commit();
}

export async function saveRsvp(eventId: string, status: 'rsvp' | 'waitlist' | null) {
  const user = userOrThrow();
  const target = doc(db, 'eventRsvps', `${eventId}_${user.uid}`);
  if (!status) return deleteDoc(target);
  return setDoc(target, { eventId, userId: user.uid, status, updatedAt: serverTimestamp() });
}

export async function saveLostCase(item: CampusCase, file?: File) {
  const user = userOrThrow();
  const image = file ? await uploadCampusImage(file, 'lost-found') : item.image;
  const evidence = item.description || '';
  const batch = writeBatch(db);
  batch.set(doc(db, 'lostItems', item.id), clean({ id: item.id, item: item.item, status: item.status, location: item.location, match: item.match, image, createdAt: serverTimestamp() }));
  batch.set(doc(db, 'lostItems', item.id, 'private', 'evidence'), { reporterId: user.uid, description: evidence, createdAt: serverTimestamp() });
  await batch.commit();
}

export async function saveClaim(itemId: string) {
  const user = userOrThrow();
  const id = crypto.randomUUID();
  await setDoc(doc(db, 'claims', id), { itemId, claimantId: user.uid, status: 'pending', createdAt: serverTimestamp() });
}

export async function savePost(post: CampusPost | CampusConfession, anonymous: boolean, file?: File) {
  const user = userOrThrow();
  if (anonymous) {
    const confession = post as CampusConfession;
    const moderationId = `confession-${confession.id}`;
    const batch = writeBatch(db);
    batch.set(doc(db, 'confessions', confession.id), clean({ ...confession, status: 'pending', moderationStatus: 'pending', createdAt: serverTimestamp() }));
    batch.set(doc(db, 'moderation', moderationId), { kind: 'confession', label: confession.number, reason: 'Anonymous post safety review', status: 'pending', targetCollection: 'confessions', targetId: confession.id, submittedBy: user.uid, createdAt: serverTimestamp() });
    await batch.commit();
    return;
  }
  const namedPost = post as CampusPost;
  const image = file ? await uploadCampusImage(file, 'feed') : namedPost.image;
  await setDoc(doc(db, 'posts', namedPost.id), clean({ ...namedPost, image, authorId: user.uid, author: user.displayName || namedPost.author, moderationStatus: 'approved', createdAt: serverTimestamp() }));
}

export async function saveReport(item: ModerationItem) {
  const user = userOrThrow();
  await setDoc(doc(db, 'moderation', item.id), clean({ ...item, submittedBy: user.uid, createdAt: serverTimestamp() }));
}

export async function resolveModerationItem(item: ModerationItem, status: 'approved' | 'rejected') {
  const user = userOrThrow();
  const batch = writeBatch(db);
  batch.update(doc(db, 'moderation', item.id), { status, reviewedBy: user.uid, reviewedAt: serverTimestamp() });
  if (item.targetCollection && item.targetId) {
    batch.update(doc(db, item.targetCollection, item.targetId), item.kind === 'event' ? { approval: status } : { moderationStatus: status, status: status === 'approved' ? 'approved' : 'flagged' });
  }
  batch.set(doc(db, 'auditLogs', crypto.randomUUID()), { action: 'moderation.resolve', moderationId: item.id, targetId: item.targetId || null, status, actorId: user.uid, createdAt: serverTimestamp() });
  await batch.commit();
}

export async function readAllNotifications() {
  const user = userOrThrow();
  const snapshot = await getDocs(collection(db, 'users', user.uid, 'notifications'));
  const unread = snapshot.docs.filter(item => !item.data().read);
  if (!unread.length) return;
  const batch = writeBatch(db);
  unread.forEach(item => batch.update(item.ref, { read: true }));
  await batch.commit();
}
