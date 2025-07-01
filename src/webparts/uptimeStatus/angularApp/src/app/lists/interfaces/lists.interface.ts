export interface List {
  id: string;
  title: string;
  name: string; // Alias for title for backward compatibility
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
  status?: ListStatus;
  dueDate?: Date;
  itemCount?: number;
  metadata: {
    itemCount: number;
    completedCount: number;
    completionPercentage: number;
    lastActivityAt?: Date;
    estimatedHours?: number;
    actualHours?: number;
    color?: string;
    icon?: string;
    isTemplate?: boolean;
    templateCategory?: string;
    sprintNumber?: number;
    epicId?: string;
    projectId?: string;
    teamId?: string;
  };
}

export interface ListItem {
  id: string;
  title: string;
  description?: string;
  isCompleted: boolean;
  status: ListItemStatus;
  priority: Priority;
  assignee?: string;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  estimatedHours?: number;
  actualHours?: number;
  storyPoints?: number;
  acceptanceCriteria?: string;
  tags: string[];
  dependencies: string[];
  attachments: Attachment[];
  comments: Comment[];
  subtasks: SubTask[];
  metadata?: {
    epic?: string;
    sprint?: string;
    component?: string;
    labels?: string[];
    businessValue?: number;
    riskLevel?: string;
    dependsOn?: string[];
    blockedBy?: string[];
  };
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
  BACKLOG = 'backlog',
  PROJECT = 'project',
  PORTFOLIO = 'portfolio',
  // Additional types needed by components
  TASK_LIST = 'task_list',
  BUG_TRACKER = 'bug_tracker',
  BUG_TRACKING = 'bug_tracking',
  FEATURE_REQUEST = 'feature_request',
  PROJECT_BOARD = 'project_board',
  TEAM_TASKS = 'team_tasks',
  CUSTOM = 'custom'
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

export interface CreateListRequest {
  title: string;
  description?: string;
  color: string;
  icon: string;
  type: ListType;
  priority?: Priority;
  status?: ListStatus;
  dueDate?: Date;
  members?: string[];
  tags?: string[];
  metadata?: any;
}

export interface UpdateListRequest {
  title?: string;
  description?: string;
  color?: string;
  icon?: string;
  priority?: Priority;
  members?: string[];
  tags?: string[];
  isActive?: boolean;
}

export interface CreateListItemRequest {
  title: string;
  description?: string;
  status?: ListItemStatus;
  priority?: Priority;
  assignee?: string;
  dueDate?: Date;
  estimatedHours?: number;
  actualHours?: number;
  storyPoints?: number;
  acceptanceCriteria?: string;
  tags?: string[];
  dependencies?: string[];
  metadata?: {
    epic?: string;
    sprint?: string;
    component?: string;
    labels?: string[];
    businessValue?: number;
    riskLevel?: string;
    dependsOn?: string[];
    blockedBy?: string[];
  };
}

export interface UpdateListItemRequest {
  title?: string;
  description?: string;
  isCompleted?: boolean;
  priority?: Priority;
  assignee?: string;
  dueDate?: Date;
  actualHours?: number;
  tags?: string[];
}

// UI-specific interfaces
export interface ListCardView {
  id: string;
  title: string;
  color: string;
  icon: string;
  type: ListType;
  priority: Priority;
  completionPercentage: number;
  itemCount: number;
  completedCount: number;
  lastActivity?: Date;
  isExpanded?: boolean;
}

export interface ListItemView extends ListItem {
  isEditing?: boolean;
  isSelected?: boolean;
}

export interface ListsState {
  lists: List[];
  selectedList: List | null;
  selectedItems: ListItem[];
  loading: boolean;
  error: string | null;
  viewMode: 'grid' | 'table';
  searchQuery: string;
  filterBy: {
    type: ListType | null;
    status: string | null;
    priority: Priority | null;
    assignee: string | null;
  };
  sortBy: {
    field: string;
    direction: 'asc' | 'desc';
  };
  metrics: ListMetrics;
}

export enum ListStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  ON_HOLD = 'on_hold',
  INACTIVE = 'inactive',
  ARCHIVED = 'archived',
  DELETED = 'deleted'
}

export enum ListItemStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  IN_REVIEW = 'in_review',
  DONE = 'done'
}

// Legacy interface aliases for backward compatibility
export type IList = List;
export type IListItem = ListItem;
export type ICreateListDto = CreateListRequest;
