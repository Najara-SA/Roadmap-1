
export enum RoadmapStatus {
  BACKLOG = 'Backlog',
  PLANNING = 'Planning',
  IN_DEVELOPMENT = 'In Development',
  COMPLETED = 'Completed'
}

export enum Priority {
  HIGH = 'High',
  MEDIUM = 'Medium',
  LOW = 'Low'
}

// Product is now SubProduct/Module
export interface Product {
  id: string;
  familyId: string; // Link to ProductFamily (Vertical)
  name: string;
  description: string;
  color: string;
  _synced?: boolean;
}

export interface PersistenceState {
  items: RoadmapItem[];
  products: Product[];
  milestones: Milestone[];
  verticals?: Vertical[];
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  _synced?: boolean;
}

export interface Vertical {
  id: string;
  name: string;
  color: string;
  _synced?: boolean;
}

export interface Dependency {
  itemId: string;
  type: 'blocks' | 'requires';
}

export interface SubFeature {
  id: string;
  title: string;
  isCompleted: boolean;
}

export interface RoadmapItem {
  id: string;
  verticalId: string;
  productId: string;
  milestoneId?: string;
  title: string;
  description: string;
  status: RoadmapStatus;
  priority: Priority;
  startMonth: number; // 0-11 (Jan-Dec)
  spanMonths: number; // Duration in months
  effort: number; // 1-5
  value: number; // 1-5
  tags: string[];
  dependencies: Dependency[];
  subFeatures: SubFeature[]; // O detalhamento em cascata
  createdAt: number;
  externalId?: string;
  integrationSource?: 'jira' | 'trello';
  quarter: string;
  _synced?: boolean;
}

export type ViewType = 'board' | 'timeline' | 'portfolio' | 'analytics';
