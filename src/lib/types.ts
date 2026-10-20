export interface Work {
  id: string;
  title: string;
  summary: string;
  coverUrl?: string;
  category: 'Original' | 'Fanfiction';
  fandoms: string[];
  rating: 'General Audiences' | 'Teen And Up Audiences' | 'Mature' | 'Explicit' | 'Not Rated';
  archiveWarnings: string[];
  relationships: string[];
  characters: string[];
  tags: string[];
  status: 'In Progress' | 'Complete' | 'On Hold';
  wordCount: number;
  kudosCount: number;
  bookmarkCount: number;
  commentCount: number;
  language: string;
  authorName: string;
  authorAvatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Chapter {
  id: string;
  workId: string;
  chapterNumber: number;
  title: string;
  content: string;
  summary?: string;
  startNotes?: string;
  endNotes?: string;
  wordCount: number;
  publishedAt: string;
}

export interface CardField {
  id: string;
  label: string;
  value: string;
}

export interface CardConnection {
  targetCardId: string;
  targetCardName: string;
  relation: string;
}

export interface CreativeCard {
  id: string;
  workId?: string; // Optional if global lore
  type: 'character' | 'location' | 'faction' | 'magic' | 'item' | 'lore';
  name: string;
  subtitle?: string;
  avatarUrl?: string;
  summary: string;
  tags: string[];
  fields: CardField[];
  connections: CardConnection[];
  createdAt: string;
  updatedAt: string;
}

export interface PlanningCard {
  id: string;
  workId: string;
  boardType: 'snowflake' | 'grid' | 'timeline';
  act?: string; // e.g., "Act 1: Setup", "Act 2: Confrontation"
  chapterId?: string;
  title: string;
  content: string;
  status: 'idea' | 'drafting' | 'revised' | 'done';
  position: number;
  color?: string;
}

export interface Comment {
  id: string;
  workId: string;
  chapterId?: string;
  username: string;
  userAvatar?: string;
  content: string;
  createdAt: string;
}
