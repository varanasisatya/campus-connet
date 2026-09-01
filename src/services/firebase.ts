import { db } from '@/firebase/config';
import { collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, query, orderBy, limit, where } from 'firebase/firestore';
import { Event, Post, LostItem } from '@/types';

// Events API
export const eventsAPI = {
  async getAllEvents(): Promise<Event[]> {
    const q = query(collection(db, 'events'), orderBy('date', 'asc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Event));
  },
  
  async createEvent(event: Omit<Event, 'id'>) {
    return await addDoc(collection(db, 'events'), event);
  }
};

// Posts API
export const postsAPI = {
  async getRecentPosts(): Promise<Post[]> {
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'), limit(20));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post));
  },

  async createPost(post: Omit<Post, 'id'>) {
    return await addDoc(collection(db, 'posts'), post);
  }
};

// Lost & Found API
export const lostFoundAPI = {
  async getAllItems(): Promise<LostItem[]> {
    const q = query(collection(db, 'lostItems'), orderBy('dateReported', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as LostItem));
  },

  async reportItem(item: Omit<LostItem, 'id'>) {
    return await addDoc(collection(db, 'lostItems'), item);
  }
};
