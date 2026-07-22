
export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: Date;
}

export interface AssessmentResult {
  score: number;
  sentiment: string;
  recommendations: string[];
  plan: string;
}

export type ViewState = 'home' | 'chat' | 'assessment' | 'resources' | 'login' | 'activities' | 'professionalCare' | 'reviews' | 'crisis' | 'stories' | 'games' | 'profile' | 'safety' | 'privacy' | 'support' | 'videoLounge';

export interface Resource {
  id: number;
  title: string;
  category: 'Anxiety' | 'Stress' | 'Burnout' | 'Focus';
  description: string;
  icon: string;
}

export interface ZenActivity {
  id: string;
  title: string;
  type: 'Yoga' | 'Extracurricular' | 'Hobby';
  problemTarget: string;
  description: string;
  steps?: string[];
  imageUrl: string;
}

export interface MedicalPlace {
  title: string;
  uri: string;
  address?: string;
  experience?: string;
  specialty?: string;
  phone?: string;
  rating?: number;
}

export interface SupportGroup {
  id: string;
  title: string;
  description: string;
  members: number;
  nextSession: string;
  category: string;
  icon: string;
}

export interface UserReview {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  tag: string;
}

export interface WellnessVideo {
  id: string;
  title: string;
  category: 'Motivation' | 'Stress Relief' | 'Mindfulness' | 'Academic Prep';
  duration: string;
  thumbnail: string;
  videoUrl: string;
}

export interface StoryReply {
  id: string;
  content: string;
  author: string;
  date: string;
}

export interface StudentStory {
  id: string;
  name: string;
  title: string;
  content: string;
  tags: string[];
  date: string;
  likes: number;
  replies?: StoryReply[];
}

export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  bio: string;
  joinedDate: string;
  goal: string;
}

// Fix: Added missing TimelineEvent interface to resolve import errors in services/eventData.ts and components/Calendar.tsx
export interface TimelineEvent {
  id: string;
  year: number;
  month: number;
  day: number;
  date: string;
  title: string;
  description: string;
  category: string;
  fullNarrative: string;
  images: string[];
}
