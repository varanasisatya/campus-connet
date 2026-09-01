export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: 'student' | 'admin' | 'faculty';
  department?: string;
  graduationYear?: number;
  interests?: string[];
  createdAt: Date;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: Date;
  location: string;
  imageUrl?: string;
  category: 'academic' | 'social' | 'sports' | 'career' | 'other';
  organizerId: string;
  organizerName: string;
  attendees: string[];
  capacity?: number;
  tags: string[];
  createdAt: Date;
  aiScore?: number; // For recommendation engine
}

export interface LostItem {
  id: string;
  title: string;
  description: string;
  category: 'electronics' | 'clothing' | 'accessories' | 'documents' | 'other';
  status: 'lost' | 'found' | 'resolved';
  location: string;
  dateReported: Date;
  imageUrl?: string;
  reporterId: string;
  aiMatchId?: string; // ID of potential match
  aiConfidenceScore?: number; // 0-100 score
}

export interface Post {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
  imageUrl?: string;
  likes: string[];
  comments: Comment[];
  category: 'general' | 'announcement' | 'question';
  createdAt: Date;
  aiTrendingScore?: number;
}

export interface Comment {
  id: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: Date;
}
