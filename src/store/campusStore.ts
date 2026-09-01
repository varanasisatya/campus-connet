'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  canUseCampusCloud,
  readAllNotifications,
  resolveModerationItem,
  saveClaim,
  saveEvent,
  saveLostCase,
  savePost,
  saveReport,
  saveRsvp,
} from '@/services/campusBackend';

export type CampusRole = 'student' | 'faculty' | 'moderator' | 'admin';
export type CampusEvent = { id: string; name: string; title: string; date: string; time: string; location: string; attendees: number; capacity: number; match: number; tags: string[]; image: string; verified: boolean; approval: 'approved' | 'pending' | 'rejected'; rsvped?: boolean; waitlisted?: boolean };
export type CampusCase = { id: string; item: string; status: 'Lost' | 'Found' | 'Resolved'; location: string; time: string; match: number; image: string; description?: string; claimRequested?: boolean };
export type CampusPost = { id: string; author: string; role: string; avatar: string; time: string; content: string; summary: string; likes: number; comments: number; image: string | null; accent: 'lime' | 'pink' | 'cyan'; verified?: boolean };
export type CampusConfession = { id: string; number: string; text: string; mood: string; reactions: number; color: 'bg-fuchsia-300' | 'bg-lime-300' | 'bg-cyan-300'; status: 'approved' | 'pending' | 'flagged' };
export type CampusNotification = { id: string; title: string; detail: string; time: string; read: boolean; type: 'event' | 'case' | 'safety' | 'community' };
export type ModerationItem = { id: string; kind: 'confession' | 'post' | 'event'; label: string; reason: string; status: 'pending' | 'approved' | 'rejected'; targetCollection?: string; targetId?: string };
export type BackendStatus = 'demo' | 'connecting' | 'live' | 'error';

type CampusState = {
  role: CampusRole;
  events: CampusEvent[];
  cases: CampusCase[];
  posts: CampusPost[];
  confessions: CampusConfession[];
  notifications: CampusNotification[];
  moderation: ModerationItem[];
  backendStatus: BackendStatus;
  backendError: string | null;
  setRole: (role: CampusRole) => void;
  setBackendState: (status: BackendStatus, error?: string | null) => void;
  mergeEvents: (items: CampusEvent[]) => void;
  mergeCases: (items: CampusCase[]) => void;
  mergePosts: (items: CampusPost[]) => void;
  mergeConfessions: (items: CampusConfession[]) => void;
  mergeNotifications: (items: CampusNotification[]) => void;
  replaceModeration: (items: ModerationItem[]) => void;
  applyRsvps: (items: Record<string, 'rsvp' | 'waitlist'>) => void;
  toggleRsvp: (id: string) => Promise<'rsvp' | 'waitlist' | 'removed'>;
  createEvent: (event: Omit<CampusEvent, 'id' | 'attendees' | 'verified' | 'approval'>, file?: File) => Promise<void>;
  createCase: (item: Omit<CampusCase, 'id' | 'time' | 'match' | 'claimRequested'>, file?: File) => Promise<void>;
  requestClaim: (id: string) => Promise<void>;
  createPost: (content: string, anonymous: boolean, file?: File) => Promise<void>;
  reportContent: (kind: ModerationItem['kind'], id: string, label: string) => Promise<void>;
  resolveModeration: (id: string, status: 'approved' | 'rejected') => Promise<void>;
  markAllRead: () => Promise<void>;
};

const eventSeed: CampusEvent[] = [
  { id: 'ai-hackathon', name: 'AI Hackathon 2026', title: 'Build what campus needs next.', date: 'JUN 20', time: '09:00 AM', location: 'Innovation Hall', attendees: 342, capacity: 400, match: 98, tags: ['AI', 'Code', 'Build'], image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1400&q=85', verified: true, approval: 'approved' },
  { id: 'startup-summit', name: 'Startup Summit', title: 'Big ideas deserve a bigger room.', date: 'JUL 10', time: '10:00 AM', location: 'Main Auditorium', attendees: 512, capacity: 512, match: 85, tags: ['Ideas', 'Pitch', 'People'], image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1400&q=85', verified: true, approval: 'approved' },
  { id: 'robotics-workshop', name: 'Robotics Workshop', title: 'Make machines feel less impossible.', date: 'AUG 05', time: '02:00 PM', location: 'Engineering Lab 3', attendees: 89, capacity: 120, match: 72, tags: ['Robots', 'Hardware', 'Play'], image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1400&q=85', verified: true, approval: 'approved' },
];
const caseSeed: CampusCase[] = [
  { id: 'CASE-0248', item: 'Black NorthFace Backpack', status: 'Lost', location: 'Library · 2nd floor', time: '2h ago', match: 93, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1000&q=85' },
  { id: 'CASE-0246', item: 'Apple AirPods Pro', status: 'Found', location: 'Central Cafeteria', time: '5h ago', match: 88, image: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?auto=format&fit=crop&w=1000&q=85' },
  { id: 'CASE-0239', item: 'HydroFlask Bottle', status: 'Lost', location: 'West Gymnasium', time: 'Yesterday', match: 45, image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=1000&q=85' },
];
const postSeed: CampusPost[] = [
  { id: 'post-1', author: 'Sarah Jenkins', role: 'Student Council', avatar: 'SJ', time: '2h ago', content: 'The new AI Innovation Lab opens next week. The first night is student-only: music, demos, food, and absolutely no boring speeches.', summary: 'New lab opening · student preview · next week', likes: 124, comments: 18, image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1400&q=85', accent: 'lime', verified: true },
  { id: 'post-2', author: 'Maya & the Film Society', role: 'Campus Creators', avatar: 'MF', time: '4h ago', content: 'We turned the east wall into an open-air cinema last night. Campus, you understood the assignment.', summary: 'Film Society recap · 600 students showed up', likes: 608, comments: 73, image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1400&q=85', accent: 'pink' },
  { id: 'post-3', author: 'Prof. Alan Turing', role: 'Computer Science', avatar: 'AT', time: '5h ago', content: 'CS301 project deadline extended by 48 hours. Use the time well—and yes, sleep counts as using it well.', summary: 'CS301 · deadline moved by 48 hours', likes: 342, comments: 45, image: null, accent: 'cyan', verified: true },
];
const confessionSeed: CampusConfession[] = [
  { id: 'conf-847', number: 'NO. 847', text: 'To the person who leaves tiny poems inside library books—you made exam week feel a little less lonely.', mood: 'soft hours', reactions: 284, color: 'bg-fuchsia-300', status: 'approved' },
  { id: 'conf-846', number: 'NO. 846', text: 'I joined the robotics club for the résumé. I stayed because they became the first people here who felt like home.', mood: 'plot twist', reactions: 419, color: 'bg-lime-300', status: 'approved' },
  { id: 'conf-845', number: 'NO. 845', text: 'The campus cat has attended more of my 8 AM lectures than half the class. Give him the degree.', mood: 'no lies detected', reactions: 672, color: 'bg-cyan-300', status: 'approved' },
];

const notify = (title: string, detail: string, type: CampusNotification['type']): CampusNotification => ({ id: crypto.randomUUID(), title, detail, type, time: 'Now', read: false });
const merge = <T extends { id: string }>(local: T[], cloud: T[]) => [...cloud, ...local.filter(item => !cloud.some(remote => remote.id === item.id))];

async function cloud(set: (state: Partial<CampusState>) => void, operation: () => Promise<unknown>) {
  if (!canUseCampusCloud()) return;
  set({ backendStatus: 'connecting', backendError: null });
  try {
    await operation();
    set({ backendStatus: 'live', backendError: null });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Cloud sync failed.';
    set({ backendStatus: 'error', backendError: message });
    throw error;
  }
}

export const useCampusStore = create<CampusState>()(persist((set, get) => ({
  role: 'student',
  events: eventSeed,
  cases: caseSeed,
  posts: postSeed,
  confessions: confessionSeed,
  notifications: [
    { id: 'n1', title: 'Verified event reminder', detail: 'AI Hackathon check-in opens at 8:30 AM.', time: '12m', read: false, type: 'event' },
    { id: 'n2', title: 'New lost-item signal', detail: 'A backpack report reached 93% confidence.', time: '1h', read: false, type: 'case' },
  ],
  moderation: [{ id: 'mod-1', kind: 'confession', label: 'Anonymous confession #849', reason: 'Automated safety review requested', status: 'pending' }],
  backendStatus: 'demo',
  backendError: null,
  setRole: role => set({ role }),
  setBackendState: (backendStatus, backendError = null) => set({ backendStatus, backendError }),
  mergeEvents: items => set(state => ({ events: merge(state.events, items) })),
  mergeCases: items => set(state => ({ cases: merge(state.cases, items) })),
  mergePosts: items => set(state => ({ posts: merge(state.posts, items) })),
  mergeConfessions: items => set(state => ({ confessions: merge(state.confessions, items) })),
  mergeNotifications: items => set(state => ({ notifications: merge(state.notifications, items) })),
  replaceModeration: items => set({ moderation: items }),
  applyRsvps: items => set(state => ({ events: state.events.map(event => ({ ...event, rsvped: items[event.id] === 'rsvp', waitlisted: items[event.id] === 'waitlist' })) })),
  toggleRsvp: async id => {
    const event = get().events.find(candidate => candidate.id === id);
    if (!event) return 'removed';
    const removed = Boolean(event.rsvped || event.waitlisted);
    const waitlisted = !removed && event.attendees >= event.capacity;
    const result = removed ? 'removed' : waitlisted ? 'waitlist' : 'rsvp';
    set(state => ({
      events: state.events.map(candidate => candidate.id === id ? { ...candidate, attendees: removed && candidate.rsvped ? Math.max(0, candidate.attendees - 1) : !removed && !waitlisted ? candidate.attendees + 1 : candidate.attendees, rsvped: result === 'rsvp', waitlisted: result === 'waitlist' } : candidate),
      notifications: removed ? state.notifications : [notify(waitlisted ? 'Added to waitlist' : 'RSVP confirmed', `${event.name} · ${event.date} at ${event.time}`, 'event'), ...state.notifications],
    }));
    await cloud(set, () => saveRsvp(id, result === 'removed' ? null : result));
    return result;
  },
  createEvent: async (event, file) => {
    const created: CampusEvent = { ...event, id: crypto.randomUUID(), attendees: 0, verified: false, approval: 'pending' };
    const review: ModerationItem = { id: `event-${created.id}`, kind: 'event', label: created.name, reason: 'New event requires university approval', status: 'pending', targetCollection: 'events', targetId: created.id };
    set(state => ({ events: [created, ...state.events], moderation: [review, ...state.moderation] }));
    await cloud(set, () => saveEvent(created, file));
  },
  createCase: async (item, file) => {
    const created: CampusCase = { ...item, id: `CASE-${Math.floor(1000 + Math.random() * 8999)}`, time: 'Now', match: 0 };
    set(state => ({ cases: [created, ...state.cases], notifications: [notify('Case opened securely', `${item.item} is now being matched without exposing ownership details.`, 'case'), ...state.notifications] }));
    await cloud(set, () => saveLostCase(created, file));
  },
  requestClaim: async id => {
    set(state => ({ cases: state.cases.map(item => item.id === id ? { ...item, claimRequested: true } : item), notifications: [notify('Verification started', 'Answer the private ownership questions at the campus help desk.', 'case'), ...state.notifications] }));
    await cloud(set, () => saveClaim(id));
  },
  createPost: async (content, anonymous, file) => {
    if (anonymous) {
      const confession: CampusConfession = { id: crypto.randomUUID(), number: `NO. ${850 + get().confessions.length}`, text: content, mood: 'awaiting review', reactions: 0, color: 'bg-fuchsia-300', status: 'pending' };
      const review: ModerationItem = { id: `confession-${confession.id}`, kind: 'confession', label: confession.number, reason: 'Anonymous post safety review', status: 'pending', targetCollection: 'confessions', targetId: confession.id };
      set(state => ({ confessions: [confession, ...state.confessions], moderation: [review, ...state.moderation] }));
      await cloud(set, () => savePost(confession, true));
      return;
    }
    const post: CampusPost = { id: crypto.randomUUID(), author: 'You', role: 'Student', avatar: 'YO', time: 'Now', content, summary: 'Student update · AI category pending', likes: 0, comments: 0, image: null, accent: 'lime' };
    set(state => ({ posts: [post, ...state.posts] }));
    await cloud(set, () => savePost(post, false, file));
  },
  reportContent: async (kind, id, label) => {
    if (get().moderation.some(item => item.label === label && item.status === 'pending')) return;
    const item: ModerationItem = { id: crypto.randomUUID(), kind, label, reason: 'Community report requires review', status: 'pending', targetCollection: kind === 'confession' ? 'confessions' : kind === 'post' ? 'posts' : 'events', targetId: id };
    set(state => ({ moderation: [item, ...state.moderation], notifications: [notify('Report received', 'A moderator will review it without exposing your identity.', 'community'), ...state.notifications] }));
    await cloud(set, () => saveReport(item));
  },
  resolveModeration: async (id, status) => {
    const item = get().moderation.find(candidate => candidate.id === id);
    if (!item) return;
    set(state => ({ moderation: state.moderation.map(candidate => candidate.id === id ? { ...candidate, status } : candidate), confessions: state.confessions.map(confession => confession.id === item.targetId ? { ...confession, status: status === 'approved' ? 'approved' : 'flagged' } : confession) }));
    await cloud(set, () => resolveModerationItem(item, status));
  },
  markAllRead: async () => {
    set(state => ({ notifications: state.notifications.map(item => ({ ...item, read: true })) }));
    await cloud(set, readAllNotifications);
  },
}), {
  name: 'campus-connect-operations-v2',
  skipHydration: true,
  partialize: state => ({ role: state.role, events: state.events, cases: state.cases, posts: state.posts, confessions: state.confessions, notifications: state.notifications }),
}));
