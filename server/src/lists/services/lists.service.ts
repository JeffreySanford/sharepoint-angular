import { Injectable, Logger } from '@nestjs/common';
import { BehaviorSubject, Observable, interval } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { 
  List, 
  ListItem, 
  ListsData, 
  RecentActivity, 
  ListMetrics, 
  ListType, 
  Priority, 
  ActivityType,
  TopPerformer
} from '../interfaces/list.interface';

@Injectable()
export class ListsService {
  private readonly logger = new Logger(ListsService.name);
  
  // In-memory data store (in production, this would be MongoDB)
  private lists: List[] = [];
  private recentActivities: RecentActivity[] = [];
  
  // Observable subjects for real-time updates
  private listsSubject = new BehaviorSubject<List[]>([]);
  private recentActivitiesSubject = new BehaviorSubject<RecentActivity[]>([]);
  private metricsSubject = new BehaviorSubject<ListMetrics>(this.calculateMetrics());

  constructor() {
    this.seedData();
    this.startRealTimeUpdates();
  }

  // Observable streams for Angular components
  getLists(): Observable<List[]> {
    return this.listsSubject.asObservable();
  }

  getRecentActivities(): Observable<RecentActivity[]> {
    return this.recentActivitiesSubject.asObservable();
  }

  getMetrics(): Observable<ListMetrics> {
    return this.metricsSubject.asObservable();
  }

  // Combined data stream
  getListsData(): Observable<ListsData> {
    return interval(2000).pipe(
      startWith(0),
      map(() => {
        const lists = this.listsSubject.value;
        const recentActivity = this.recentActivitiesSubject.value;
        const metrics = this.calculateMetrics();
        
        return {
          lists,
          recentActivity,
          metrics,
          lastUpdated: new Date()
        };
      })
    );
  }

  // CRUD Operations
  createList(listData: Partial<List>): List {
    const newList: List = {
      id: this.generateId(),
      title: listData.title || 'New List',
      description: listData.description,
      color: listData.color || '#2196f3',
      icon: listData.icon || 'list',
      items: [],
      owner: listData.owner || 'current-user',
      members: listData.members || [],
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,
      type: listData.type || ListType.TASK,
      priority: listData.priority || Priority.MEDIUM,
      tags: listData.tags || [],
      metadata: {
        itemCount: 0,
        completedCount: 0,
        completionPercentage: 0,
        lastActivityAt: new Date()
      }
    };

    this.lists.push(newList);
    this.addActivity(ActivityType.LIST_CREATED, `Created list "${newList.title}"`, newList.owner, newList.id);
    this.updateObservables();
    
    this.logger.log(`List created: ${newList.title} (${newList.id})`);
    return newList;
  }

  updateList(listId: string, updateData: Partial<List>): List | null {
    const listIndex = this.lists.findIndex(list => list.id === listId);
    if (listIndex === -1) {
      this.logger.warn(`List not found: ${listId}`);
      return null;
    }

    const list = this.lists[listIndex];
    const updatedList = { 
      ...list, 
      ...updateData, 
      updatedAt: new Date(),
      metadata: {
        ...list.metadata,
        lastActivityAt: new Date()
      }
    };
    
    this.lists[listIndex] = updatedList;
    this.addActivity(ActivityType.LIST_UPDATED, `Updated list "${updatedList.title}"`, updatedList.owner, listId);
    this.updateObservables();
    
    this.logger.log(`List updated: ${updatedList.title} (${listId})`);
    return updatedList;
  }

  deleteList(listId: string): boolean {
    const listIndex = this.lists.findIndex(list => list.id === listId);
    if (listIndex === -1) {
      this.logger.warn(`List not found: ${listId}`);
      return false;
    }

    const list = this.lists[listIndex];
    this.lists.splice(listIndex, 1);
    this.addActivity(ActivityType.LIST_DELETED, `Deleted list "${list.title}"`, list.owner, listId);
    this.updateObservables();
    
    this.logger.log(`List deleted: ${list.title} (${listId})`);
    return true;
  }

  addListItem(listId: string, itemData: Partial<ListItem>): ListItem | null {
    const list = this.lists.find(l => l.id === listId);
    if (!list) {
      this.logger.warn(`List not found: ${listId}`);
      return null;
    }

    const newItem: ListItem = {
      id: this.generateId(),
      title: itemData.title || 'New Item',
      description: itemData.description,
      isCompleted: false,
      priority: itemData.priority || Priority.MEDIUM,
      assignee: itemData.assignee,
      dueDate: itemData.dueDate,
      createdAt: new Date(),
      updatedAt: new Date(),
      estimatedHours: itemData.estimatedHours,
      actualHours: 0,
      tags: itemData.tags || [],
      dependencies: itemData.dependencies || [],
      attachments: [],
      comments: [],
      subtasks: []
    };

    list.items.push(newItem);
    this.updateListMetadata(list);
    this.addActivity(ActivityType.ITEM_ADDED, `Added item "${newItem.title}" to "${list.title}"`, list.owner, listId, newItem.id);
    this.updateObservables();
    
    this.logger.log(`Item added to list ${listId}: ${newItem.title} (${newItem.id})`);
    return newItem;
  }

  updateListItem(listId: string, itemId: string, updateData: Partial<ListItem>): ListItem | null {
    const list = this.lists.find(l => l.id === listId);
    if (!list) {
      this.logger.warn(`List not found: ${listId}`);
      return null;
    }

    const itemIndex = list.items.findIndex(item => item.id === itemId);
    if (itemIndex === -1) {
      this.logger.warn(`Item not found: ${itemId} in list ${listId}`);
      return null;
    }

    const item = list.items[itemIndex];
    const wasCompleted = item.isCompleted;
    const updatedItem = { 
      ...item, 
      ...updateData, 
      updatedAt: new Date() 
    };
    
    list.items[itemIndex] = updatedItem;
    this.updateListMetadata(list);

    // Log specific activities
    if (!wasCompleted && updatedItem.isCompleted) {
      this.addActivity(ActivityType.ITEM_COMPLETED, `Completed item "${updatedItem.title}"`, updatedItem.assignee || list.owner, listId, itemId);
    } else {
      this.addActivity(ActivityType.ITEM_UPDATED, `Updated item "${updatedItem.title}"`, updatedItem.assignee || list.owner, listId, itemId);
    }
    
    this.updateObservables();
    
    this.logger.log(`Item updated in list ${listId}: ${updatedItem.title} (${itemId})`);
    return updatedItem;
  }

  deleteListItem(listId: string, itemId: string): boolean {
    const list = this.lists.find(l => l.id === listId);
    if (!list) {
      this.logger.warn(`List not found: ${listId}`);
      return false;
    }

    const itemIndex = list.items.findIndex(item => item.id === itemId);
    if (itemIndex === -1) {
      this.logger.warn(`Item not found: ${itemId} in list ${listId}`);
      return false;
    }

    const item = list.items[itemIndex];
    list.items.splice(itemIndex, 1);
    this.updateListMetadata(list);
    this.addActivity(ActivityType.ITEM_DELETED, `Deleted item "${item.title}"`, list.owner, listId, itemId);
    this.updateObservables();
    
    this.logger.log(`Item deleted from list ${listId}: ${item.title} (${itemId})`);
    return true;
  }

  // Helper methods
  private generateId(): string {
    return 'id_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now().toString(36);
  }

  private updateListMetadata(list: List): void {
    list.metadata.itemCount = list.items.length;
    list.metadata.completedCount = list.items.filter(item => item.isCompleted).length;
    list.metadata.completionPercentage = list.metadata.itemCount > 0 
      ? Math.round((list.metadata.completedCount / list.metadata.itemCount) * 100) 
      : 0;
    list.metadata.lastActivityAt = new Date();
    list.metadata.estimatedHours = list.items.reduce((sum, item) => sum + (item.estimatedHours || 0), 0);
    list.metadata.actualHours = list.items.reduce((sum, item) => sum + (item.actualHours || 0), 0);
    list.updatedAt = new Date();
  }

  private addActivity(type: ActivityType, description: string, user: string, listId: string, itemId?: string): void {
    const activity: RecentActivity = {
      id: this.generateId(),
      type,
      description,
      user,
      timestamp: new Date(),
      listId,
      itemId,
      metadata: {}
    };

    this.recentActivities.unshift(activity);
    
    // Keep only last 100 activities
    if (this.recentActivities.length > 100) {
      this.recentActivities = this.recentActivities.slice(0, 100);
    }
  }

  private calculateMetrics(): ListMetrics {
    const totalLists = this.lists.length;
    const totalItems = this.lists.reduce((sum, list) => sum + list.items.length, 0);
    const completedItems = this.lists.reduce((sum, list) => 
      sum + list.items.filter(item => item.isCompleted).length, 0);
    const completionRate = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
    
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    const overdueTasks = this.lists.reduce((sum, list) => 
      sum + list.items.filter(item => 
        !item.isCompleted && item.dueDate && new Date(item.dueDate) < now
      ).length, 0);
    
    const tasksCompletedToday = this.lists.reduce((sum, list) => 
      sum + list.items.filter(item => 
        item.isCompleted && item.updatedAt >= todayStart
      ).length, 0);

    // Calculate list type distribution
    const listsByType: Record<ListType, number> = {} as Record<ListType, number>;
    Object.values(ListType).forEach(type => {
      listsByType[type] = this.lists.filter(list => list.type === type).length;
    });

    // Calculate priority distribution
    const priorityDistribution: Record<Priority, number> = {} as Record<Priority, number>;
    Object.values(Priority).forEach(priority => {
      priorityDistribution[priority] = this.lists.reduce((sum, list) => 
        sum + list.items.filter(item => item.priority === priority).length, 0);
    });

    // Calculate top performers
    const userStats: { [user: string]: { completed: number, totalHours: number, completionTimes: number[] } } = {};
    this.lists.forEach(list => {
      list.items.forEach(item => {
        if (item.assignee && item.isCompleted) {
          if (!userStats[item.assignee]) {
            userStats[item.assignee] = { completed: 0, totalHours: 0, completionTimes: [] };
          }
          userStats[item.assignee].completed++;
          userStats[item.assignee].totalHours += item.actualHours || 0;
          
          const completionTime = (item.updatedAt.getTime() - item.createdAt.getTime()) / (1000 * 60 * 60); // hours
          userStats[item.assignee].completionTimes.push(completionTime);
        }
      });
    });

    const topPerformers: TopPerformer[] = Object.entries(userStats)
      .map(([user, stats]) => ({
        user,
        completedTasks: stats.completed,
        totalHours: stats.totalHours,
        avgCompletionTime: stats.completionTimes.length > 0 
          ? stats.completionTimes.reduce((sum, time) => sum + time, 0) / stats.completionTimes.length 
          : 0
      }))
      .sort((a, b) => b.completedTasks - a.completedTasks)
      .slice(0, 5);

    return {
      totalLists,
      totalItems,
      completedItems,
      completionRate,
      overdueTasks,
      tasksCompletedToday,
      averageCompletionTime: topPerformers.length > 0 
        ? topPerformers.reduce((sum, p) => sum + p.avgCompletionTime, 0) / topPerformers.length 
        : 0,
      topPerformers,
      listsByType,
      priorityDistribution
    };
  }

  private updateObservables(): void {
    this.listsSubject.next([...this.lists]);
    this.recentActivitiesSubject.next([...this.recentActivities]);
    this.metricsSubject.next(this.calculateMetrics());
  }

  private startRealTimeUpdates(): void {
    // Simulate real-time updates every 30 seconds
    interval(30000).subscribe(() => {
      this.updateObservables();
    });
  }

  private seedData(): void {
    // Seed with sample data
    const sampleLists: Partial<List>[] = [
      {
        title: 'Sprint 15 Backlog',
        description: 'User stories and tasks for current sprint',
        color: '#1976d2',
        icon: 'sprint',
        type: ListType.SPRINT,
        priority: Priority.HIGH,
        owner: 'john.smith@company.com',
        members: ['sarah.johnson@company.com', 'mike.davis@company.com'],
        tags: ['sprint', 'development', 'priority']
      },
      {
        title: 'Epic: Authentication System',
        description: 'Complete overhaul of user authentication and authorization',
        color: '#9c27b0',
        icon: 'security',
        type: ListType.EPIC,
        priority: Priority.CRITICAL,
        owner: 'sarah.johnson@company.com',
        members: ['john.smith@company.com', 'alex.wilson@company.com'],
        tags: ['epic', 'security', 'auth']
      },
      {
        title: 'Bug Reports - P1',
        description: 'Critical production issues requiring immediate attention',
        color: '#f44336',
        icon: 'bug_report',
        type: ListType.BUG,
        priority: Priority.CRITICAL,
        owner: 'mike.davis@company.com',
        members: ['john.smith@company.com', 'sarah.johnson@company.com'],
        tags: ['bugs', 'production', 'critical']
      },
      {
        title: 'Team Planning Tasks',
        description: 'Administrative and planning tasks for the development team',
        color: '#4caf50',
        icon: 'group',
        type: ListType.TEAM,
        priority: Priority.MEDIUM,
        owner: 'alex.wilson@company.com',
        members: ['john.smith@company.com', 'sarah.johnson@company.com', 'mike.davis@company.com'],
        tags: ['planning', 'team', 'admin']
      }
    ];

    sampleLists.forEach(listData => {
      const list = this.createList(listData);
      
      // Add sample items to each list
      const sampleItems = this.getSampleItemsForList(list.type);
      sampleItems.forEach(itemData => {
        this.addListItem(list.id, itemData);
      });
    });
  }

  private getSampleItemsForList(listType: ListType): Partial<ListItem>[] {
    switch (listType) {
      case ListType.SPRINT:
        return [
          { title: 'Implement user login API', priority: Priority.HIGH, assignee: 'john.smith@company.com', estimatedHours: 8, tags: ['api', 'auth'] },
          { title: 'Create login UI components', priority: Priority.MEDIUM, assignee: 'sarah.johnson@company.com', estimatedHours: 12, tags: ['ui', 'frontend'] },
          { title: 'Write unit tests for auth service', priority: Priority.MEDIUM, assignee: 'mike.davis@company.com', estimatedHours: 6, tags: ['testing'] },
          { title: 'Update API documentation', priority: Priority.LOW, assignee: 'alex.wilson@company.com', estimatedHours: 4, tags: ['docs'] }
        ];
      
      case ListType.EPIC:
        return [
          { title: 'Design authentication architecture', priority: Priority.HIGH, assignee: 'sarah.johnson@company.com', estimatedHours: 16, tags: ['design', 'architecture'] },
          { title: 'Implement OAuth 2.0 integration', priority: Priority.HIGH, assignee: 'john.smith@company.com', estimatedHours: 24, tags: ['oauth', 'integration'] },
          { title: 'Add multi-factor authentication', priority: Priority.MEDIUM, assignee: 'mike.davis@company.com', estimatedHours: 20, tags: ['mfa', 'security'] },
          { title: 'Performance testing', priority: Priority.MEDIUM, assignee: 'alex.wilson@company.com', estimatedHours: 12, tags: ['testing', 'performance'] }
        ];
      
      case ListType.BUG:
        return [
          { title: 'Fix memory leak in user session handling', priority: Priority.CRITICAL, assignee: 'john.smith@company.com', estimatedHours: 6, tags: ['memory', 'session'] },
          { title: 'Resolve timeout issues in API calls', priority: Priority.HIGH, assignee: 'sarah.johnson@company.com', estimatedHours: 4, tags: ['api', 'timeout'] },
          { title: 'Fix UI rendering on mobile devices', priority: Priority.MEDIUM, assignee: 'mike.davis@company.com', estimatedHours: 8, tags: ['mobile', 'ui'] }
        ];
      
      case ListType.TEAM:
        return [
          { title: 'Sprint planning meeting preparation', priority: Priority.HIGH, assignee: 'alex.wilson@company.com', estimatedHours: 3, tags: ['planning', 'meeting'] },
          { title: 'Code review process documentation', priority: Priority.MEDIUM, assignee: 'sarah.johnson@company.com', estimatedHours: 4, tags: ['process', 'docs'] },
          { title: 'Team retrospective action items', priority: Priority.MEDIUM, assignee: 'mike.davis@company.com', estimatedHours: 2, tags: ['retrospective', 'action'] },
          { title: 'New developer onboarding checklist', priority: Priority.LOW, assignee: 'john.smith@company.com', estimatedHours: 6, tags: ['onboarding', 'checklist'] }
        ];
      
      default:
        return [
          { title: 'Sample task', priority: Priority.MEDIUM, estimatedHours: 4, tags: ['sample'] }
        ];
    }
  }

  getCurrentListsData(): ListsData {
    return {
      lists: [...this.lists],
      recentActivity: [...this.recentActivities],
      metrics: this.calculateMetrics(),
      lastUpdated: new Date()
    };
  }
}
