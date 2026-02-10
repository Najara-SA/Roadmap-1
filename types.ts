
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

export interface Product {
  id: string;
  name: string;
  description: string;
  color: string;
}

export interface Milestone {
  id: string;
  productId: string;
  title: string;
  month: number; // 0-11
  description: string;
}

export interface Team {
  id: string;
  name: string;
  color: string;
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
  teamId: string;
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
}

export type ViewType = 'board' | 'timeline' | 'portfolio' | 'analytics' | 'integrations';

export interface Integration {
  id: 'jira' | 'trello';
  name: string;
  isConnected: boolean;
  lastSync?: number;
}
