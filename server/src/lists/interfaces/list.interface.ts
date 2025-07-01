export interface List {
  id: string;
  title: string;
  description?: string;
  color: string;
  icon: string;
  items: ListItem[];
  owner: string;
  members: string[];
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  type: ListType;
  priority: Priority;
  tags: string[];
  metadata: {
    itemCount: number;
    completedCount: number;
    completionPercentage: number;
    lastActivityAt?: Date;
    estimatedHours?: number;
    actualHours?: number;
  };
}

export interface ListItem {
  id: string;
  title: string;
  description?: string;
  isCompleted: boolean;
  priority: Priority;
  assignee?: string;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  estimatedHours?: number;
  actualHours?: number;
  tags: string[];
  dependencies: string[];
  attachments: Attachment[];
  comments: Comment[];
  subtasks: SubTask[];
}

export interface SubTask {
  id: string;
  title: string;
  isCompleted: boolean;
  assignee?: string;
  createdAt: Date;
}

export interface Attachment {
  id: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  url: string;
  uploadedBy: string;
  uploadedAt: Date;
}

export interface Comment {
  id: string;
  text: string;
  author: string;
  createdAt: Date;
  isEdited: boolean;
  editedAt?: Date;
}

export enum ListType {
  EPIC = 'epic',
  FEATURE = 'feature',
  USER_STORY = 'user_story',
  TASK = 'task',
  BUG = 'bug',
  PERSONAL = 'personal',
  TEAM = 'team',
  SPRINT = 'sprint',
  BACKLOG = 'backlog'
}

export enum Priority {
  CRITICAL = 'critical',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low'
}

export interface ListsData {
  lists: List[];
  recentActivity: RecentActivity[];
  metrics: ListMetrics;
  lastUpdated: Date;
}

export interface RecentActivity {
  id: string;
  type: ActivityType;
  description: string;
  user: string;
  timestamp: Date;
  listId: string;
  itemId?: string;
  metadata?: any;
}

export enum ActivityType {
  LIST_CREATED = 'list_created',
  LIST_UPDATED = 'list_updated',
  LIST_DELETED = 'list_deleted',
  ITEM_ADDED = 'item_added',
  ITEM_COMPLETED = 'item_completed',
  ITEM_UPDATED = 'item_updated',
  ITEM_DELETED = 'item_deleted',
  COMMENT_ADDED = 'comment_added',
  ASSIGNMENT_CHANGED = 'assignment_changed'
}

export interface ListMetrics {
  totalLists: number;
  totalItems: number;
  completedItems: number;
  completionRate: number;
  overdueTasks: number;
  tasksCompletedToday: number;
  averageCompletionTime: number;
  topPerformers: TopPerformer[];
  listsByType: Record<ListType, number>;
  priorityDistribution: Record<Priority, number>;
}

export interface TopPerformer {
  user: string;
  completedTasks: number;
  totalHours: number;
  avgCompletionTime: number;
}
