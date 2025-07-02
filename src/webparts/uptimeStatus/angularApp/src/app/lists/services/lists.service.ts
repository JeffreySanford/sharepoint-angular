import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, interval, of } from 'rxjs';
import { 
  List, 
  ListItem, 
  CreateListRequest, 
  UpdateListRequest, 
  CreateListItemRequest, 
  UpdateListItemRequest,
  ListType,
  Priority,
  ListItemStatus,
  ListsData,
  RecentActivity,
  ListMetrics,
  ActivityType
} from '../interfaces/lists.interface';
import { map, catchError, startWith, switchMap, shareReplay, tap } from 'rxjs/operators';



@Injectable({
  providedIn: 'root'
})
export class ListsService {
  private baseUrl = '/api/lists'; // Base URL for the lists API
  // BehaviorSubjects for reactive data streams
  private listsSubject = new BehaviorSubject<List[]>([]);
  private selectedListSubject = new BehaviorSubject<List | null>(null);
  private metricsSubject = new BehaviorSubject<ListMetrics | null>(null);
  private recentActivitySubject = new BehaviorSubject<RecentActivity[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new BehaviorSubject<string | null>(null);

  // Observable streams
  public lists$ = this.listsSubject.asObservable();
  public selectedList$ = this.selectedListSubject.asObservable();
  public metrics$ = this.metricsSubject.asObservable();
  public recentActivity$ = this.recentActivitySubject.asObservable();
  public loading$ = this.loadingSubject.asObservable();
  public error$ = this.errorSubject.asObservable();

  // Combined lists data stream (like reports service)
  public listsData$: Observable<ListsData>;

  constructor(private http: HttpClient) {
    // Initialize the combined data stream using the /data endpoint
    this.listsData$ = interval(5000).pipe(
      startWith(0),
      switchMap(() => this.getListsDataFromServer()),
      shareReplay(1)
    );

    // Initialize data
    this.loadInitialData();
  }

  // Method to fetch complete lists data from /api/lists/data endpoint
  private getListsDataFromServer(): Observable<ListsData> {
    return this.http.get<ListsData>(`${this.baseUrl}/data`).pipe(
      tap(data => {
        // Update individual subjects with the received data
        this.listsSubject.next(data.lists || []);
        this.recentActivitySubject.next(data.recentActivity || []);
        this.metricsSubject.next(data.metrics || this.getDefaultMetrics());
        this.loadingSubject.next(false);
        this.errorSubject.next(null);
      }),
      catchError(error => {
        console.warn('Failed to fetch lists data from server, using fallback data:', error);
        const mockLists = this.getMockLists();
        const fallbackData: ListsData = {
          lists: mockLists,
          recentActivity: [],
          metrics: this.getDefaultMetrics(),
          lastUpdated: new Date()
        };
        this.listsSubject.next(mockLists);
        this.metricsSubject.next(fallbackData.metrics);
        this.recentActivitySubject.next([]);
        this.errorSubject.next('Failed to connect to server');
        this.loadingSubject.next(false);
        return of(fallbackData);
      })
    );
  }

  // Private methods for reactive data management
  private refreshAllData(): Observable<void> {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    return this.http.get<List[]>(this.baseUrl).pipe(
      tap(lists => {
        this.listsSubject.next(lists || []);
        this.updateMetrics(lists || []);
        this.updateRecentActivity(lists || []);
        this.loadingSubject.next(false);
      }),
      catchError(error => {
        console.warn('Failed to fetch lists from server, using fallback data:', error);
        const mockLists = this.getMockLists();
        this.listsSubject.next(mockLists);
        this.updateMetrics(mockLists);
        this.updateRecentActivity(mockLists);
        this.errorSubject.next('Failed to connect to server');
        this.loadingSubject.next(false);
        return of(void 0);
      }),
      map(() => void 0)
    );
  }

  private getDefaultMetrics(): ListMetrics {
    return {
      totalLists: 0,
      totalItems: 0,
      completedItems: 0,
      completionRate: 0,
      overdueTasks: 0,
      tasksCompletedToday: 0,
      averageCompletionTime: 0,
      topPerformers: [],
      listsByType: {} as Record<ListType, number>,
      priorityDistribution: {} as Record<Priority, number>
    };
  }

  private loadInitialData(): void {
    this.getListsDataFromServer().subscribe();
  }

  private updateMetrics(lists: List[]): void {
    const totalLists = lists.length;
    const totalItems = lists.reduce((sum, list) => sum + (list.itemCount || 0), 0);
    const completedItems = lists.reduce((sum, list) => 
      sum + (list.metadata?.completedCount || 0), 0);
    
    // Calculate lists by type
    const listsByType = {} as Record<ListType, number>;
    Object.values(ListType).forEach(type => {
      listsByType[type] = lists.filter(list => list.type === type).length;
    });

    // Calculate priority distribution
    const priorityDistribution = {} as Record<Priority, number>;
    Object.values(Priority).forEach(priority => {
      priorityDistribution[priority] = lists.filter(list => list.priority === priority).length;
    });
    
    const metrics: ListMetrics = {
      totalLists,
      totalItems,
      completedItems,
      completionRate: totalItems > 0 ? (completedItems / totalItems) * 100 : 0,
      overdueTasks: 0, // Would need item-level analysis
      tasksCompletedToday: 0, // Would need to track completion timestamps
      averageCompletionTime: 0, // Would need completion time tracking
      topPerformers: [], // Would need user activity tracking
      listsByType,
      priorityDistribution
    };

    this.metricsSubject.next(metrics);
  }

  private updateRecentActivity(lists: List[]): void {
    const activities: RecentActivity[] = [];
    const now = new Date();
    const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    lists.forEach(list => {
      if (list.createdAt > dayAgo) {
        activities.push({
          id: `create-${list.id}`,
          type: ActivityType.LIST_CREATED,
          description: `List "${list.title}" was created`,
          user: list.owner,
          timestamp: list.createdAt,
          listId: list.id
        });
      }
      if (list.updatedAt > dayAgo && list.updatedAt.getTime() !== list.createdAt.getTime()) {
        activities.push({
          id: `update-${list.id}`,
          type: ActivityType.LIST_UPDATED,
          description: `List "${list.title}" was updated`,
          user: list.owner,
          timestamp: list.updatedAt,
          listId: list.id
        });
      }
    });

    // Sort by timestamp, most recent first
    activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    this.recentActivitySubject.next(activities.slice(0, 10)); // Keep only last 10
  }

  private findMostActiveList(lists: List[]): string | null {
    if (lists.length === 0) return null;
    
    let mostActive = lists[0];
    let maxActivity = mostActive.itemCount || 0;
    
    lists.forEach(list => {
      const activity = (list.itemCount || 0);
      if (activity > maxActivity) {
        maxActivity = activity;
        mostActive = list;
      }
    });
    
    return mostActive.title;
  }

  private countRecentlyCreated(lists: List[]): number {
    const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return lists.filter(list => list.createdAt > dayAgo).length;
  }

  private countRecentlyUpdated(lists: List[]): number {
    const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return lists.filter(list => 
      list.updatedAt > dayAgo && 
      list.updatedAt.getTime() !== list.createdAt.getTime()
    ).length;
  }

  // List operations - now reactive
  getLists(): Observable<List[]> {
    return this.lists$;
  }

  getList(id: string): Observable<List | null> {
    return this.http.get<List>(`${this.baseUrl}/${id}`).pipe(
      catchError(error => {
        console.error('Failed to fetch list:', error);
        this.errorSubject.next('Failed to fetch list');
        return of(null);
      })
    );
  }

  createList(request: CreateListRequest): Observable<List> {
    this.loadingSubject.next(true);
    return this.http.post<List>(this.baseUrl, request).pipe(
      tap(newList => {
        if (newList) {
          const currentLists = this.listsSubject.value;
          this.listsSubject.next([...currentLists, newList]);
          this.updateMetrics([...currentLists, newList]);
          this.updateRecentActivity([...currentLists, newList]);
        }
        this.loadingSubject.next(false);
      }),
      catchError(error => {
        console.error('Failed to create list:', error);
        this.errorSubject.next('Failed to create list');
        this.loadingSubject.next(false);
        throw error;
      })
    );
  }

  updateList(id: string, request: UpdateListRequest): Observable<List> {
    this.loadingSubject.next(true);
    return this.http.put<List>(`${this.baseUrl}/${id}`, request).pipe(
      tap(updatedList => {
        if (updatedList) {
          const currentLists = this.listsSubject.value;
          const updatedLists = currentLists.map(list => 
            list.id === id ? updatedList : list
          );
          this.listsSubject.next(updatedLists);
          this.updateMetrics(updatedLists);
          this.updateRecentActivity(updatedLists);
          
          // Update selected list if it's the one being updated
          if (this.selectedListSubject.value?.id === id) {
            this.selectedListSubject.next(updatedList);
          }
        }
        this.loadingSubject.next(false);
      }),
      catchError(error => {
        console.error('Failed to update list:', error);
        this.errorSubject.next('Failed to update list');
        this.loadingSubject.next(false);
        throw error;
      })
    );
  }

  deleteList(id: string): Observable<void> {
    this.loadingSubject.next(true);
    return this.http.delete<void>(`${this.baseUrl}/${id}`).pipe(
      tap(() => {
        const currentLists = this.listsSubject.value;
        const updatedLists = currentLists.filter(list => list.id !== id);
        this.listsSubject.next(updatedLists);
        this.updateMetrics(updatedLists);
        this.updateRecentActivity(updatedLists);
        
        // Clear selected list if it's the one being deleted
        if (this.selectedListSubject.value?.id === id) {
          this.selectedListSubject.next(null);
        }
        this.loadingSubject.next(false);
      }),
      catchError(error => {
        console.error('Failed to delete list:', error);
        this.errorSubject.next('Failed to delete list');
        this.loadingSubject.next(false);
        throw error;
      })
    );
  }

  // List selection
  selectList(list: List | null): void {
    this.selectedListSubject.next(list);
  }

  // List item operations - now reactive
  getListItems(listId: string): Observable<ListItem[]> {
    return this.http.get<ListItem[]>(`${this.baseUrl}/${listId}/items`).pipe(
      catchError(error => {
        console.warn('Failed to fetch list items from server, using mock data:', error);
        return of(this.getMockListItems());
      })
    );
  }

  getListItem(listId: string, itemId: string): Observable<ListItem | null> {
    return this.http.get<ListItem>(`${this.baseUrl}/${listId}/items/${itemId}`).pipe(
      catchError(error => {
        console.error('Failed to fetch list item:', error);
        return of(null);
      })
    );
  }

  createListItem(listId: string, request: CreateListItemRequest): Observable<ListItem> {
    return this.http.post<ListItem>(`${this.baseUrl}/${listId}/items`, request).pipe(
      tap(newItem => {
        if (newItem) {
          // Update the list's item count and metadata
          this.updateListItemCounts(listId);
          
          // Add activity
          const activities = this.recentActivitySubject.value;
          const newActivity: RecentActivity = {
            id: `item-create-${newItem.id}`,
            type: ActivityType.ITEM_ADDED,
            description: `Item "${newItem.title}" was added`,
            user: newItem.assignee || 'current-user',
            timestamp: newItem.createdAt,
            listId: listId,
            itemId: newItem.id
          };
          this.recentActivitySubject.next([newActivity, ...activities.slice(0, 9)]);
        }
      }),
      catchError(error => {
        console.error('Failed to create list item:', error);
        this.errorSubject.next('Failed to create list item');
        throw error;
      })
    );
  }

  updateListItem(listId: string, itemId: string, request: UpdateListItemRequest): Observable<ListItem> {
    return this.http.put<ListItem>(`${this.baseUrl}/${listId}/items/${itemId}`, request).pipe(
      tap(updatedItem => {
        if (updatedItem) {
          // Update the list's item count and metadata
          this.updateListItemCounts(listId);
          
          // Add activity
          const activities = this.recentActivitySubject.value;
          const activityType = request.isCompleted ? ActivityType.ITEM_COMPLETED : ActivityType.ITEM_UPDATED;
          const newActivity: RecentActivity = {
            id: `item-update-${updatedItem.id}`,
            type: activityType,
            description: `Item "${updatedItem.title}" was ${request.isCompleted ? 'completed' : 'updated'}`,
            user: updatedItem.assignee || 'current-user',
            timestamp: updatedItem.updatedAt,
            listId: listId,
            itemId: updatedItem.id
          };
          this.recentActivitySubject.next([newActivity, ...activities.slice(0, 9)]);
        }
      }),
      catchError(error => {
        console.error('Failed to update list item:', error);
        this.errorSubject.next('Failed to update list item');
        throw error;
      })
    );
  }

  deleteListItem(listId: string, itemId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${listId}/items/${itemId}`).pipe(
      tap(() => {
        // Update the list's item count and metadata
        this.updateListItemCounts(listId);
        
        // Add activity
        const activities = this.recentActivitySubject.value;
        const newActivity: RecentActivity = {
          id: `item-delete-${itemId}`,
          type: ActivityType.ITEM_DELETED,
          description: `Item was deleted`,
          user: 'current-user',
          timestamp: new Date(),
          listId: listId,
          itemId: itemId
        };
        this.recentActivitySubject.next([newActivity, ...activities.slice(0, 9)]);
      }),
      catchError(error => {
        console.error('Failed to delete list item:', error);
        this.errorSubject.next('Failed to delete list item');
        throw error;
      })
    );
  }

  // Helper method to update list item counts after item operations
  private updateListItemCounts(listId: string): void {
    this.getListItems(listId).subscribe(items => {
      const currentLists = this.listsSubject.value;
      const updatedLists = currentLists.map(list => {
        if (list.id === listId) {
          const completedCount = items.filter(item => item.isCompleted).length;
          return {
            ...list,
            itemCount: items.length,
            items: items,
            metadata: {
              ...list.metadata,
              itemCount: items.length,
              completedCount: completedCount,
              completionPercentage: items.length > 0 ? (completedCount / items.length) * 100 : 0,
              lastActivityAt: new Date()
            }
          };
        }
        return list;
      });
      this.listsSubject.next(updatedLists);
      this.updateMetrics(updatedLists);
    });
  }

  // Bulk operations
  bulkUpdateItems(listId: string, updates: { itemId: string; updates: UpdateListItemRequest }[]): Observable<ListItem[]> {
    return this.http.put<ListItem[]>(`${this.baseUrl}/${listId}/items/bulk`, { updates }).pipe(
      tap(updatedItems => {
        if (updatedItems) {
          // Update the list's item count and metadata
          this.updateListItemCounts(listId);
          
          // Add activity for bulk update
          const activities = this.recentActivitySubject.value;
          const newActivity: RecentActivity = {
            id: `bulk-update-${Date.now()}`,
            type: ActivityType.ITEM_UPDATED,
            description: `${updates.length} items were updated`,
            user: 'current-user',
            timestamp: new Date(),
            listId: listId
          };
          this.recentActivitySubject.next([newActivity, ...activities.slice(0, 9)]);
        }
      }),
      catchError(error => {
        console.error('Failed to bulk update items:', error);
        this.errorSubject.next('Failed to bulk update items');
        throw error;
      })
    );
  }

  // Search and filter - now reactive
  searchLists(query: string): Observable<List[]> {
    const params = new HttpParams().set('search', query);
    return this.http.get<List[]>(this.baseUrl, { params }).pipe(
      catchError(error => {
        console.error('Failed to search lists:', error);
        // Fallback to local filtering
        return this.lists$.pipe(
          map(lists => lists.filter(list => 
            list.title.toLowerCase().includes(query.toLowerCase()) ||
            list.description?.toLowerCase().includes(query.toLowerCase())
          ))
        );
      })
    );
  }

  filterListsByType(type: ListType): Observable<List[]> {
    const params = new HttpParams().set('type', type);
    return this.http.get<List[]>(this.baseUrl, { params }).pipe(
      catchError(error => {
        console.error('Failed to filter lists by type:', error);
        // Fallback to local filtering
        return this.lists$.pipe(
          map(lists => lists.filter(list => list.type === type))
        );
      })
    );
  }

  // Statistics
  getListStatistics(listId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${listId}/statistics`).pipe(
      catchError(error => {
        console.error('Failed to get list statistics:', error);
        // Fallback to calculating basic stats locally
        return this.lists$.pipe(
          map(lists => {
            const list = lists.find(l => l.id === listId);
            if (!list) return null;
            
            return {
              totalItems: list.itemCount || 0,
              completedItems: list.metadata?.completedCount || 0,
              completionRate: list.metadata?.completionPercentage || 0,
              lastUpdated: list.updatedAt
            };
          })
        );
      })
    );
  }

  // Mock data for testing when backend is not available
  private getMockLists(): List[] {
    return [
      {
        id: '1',
        title: 'My Tasks',
        name: 'My Tasks',
        description: 'Personal task management',
        color: '#007cba',
        icon: 'fas fa-tasks',
        type: ListType.TASK,
        priority: Priority.HIGH,
        owner: 'current-user',
        members: ['user1', 'user2'],
        tags: ['personal', 'important'],
        items: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
        itemCount: 0,
        metadata: {
          itemCount: 0,
          completedCount: 0,
          completionPercentage: 0
        }
      }
    ];
  }

  private getMockListItems(): ListItem[] {
    return [
      {
        id: '1',
        title: 'Sample Task',
        description: 'This is a sample task',
        isCompleted: false,
        status: ListItemStatus.TODO,
        priority: Priority.MEDIUM,
        assignee: 'current-user',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        createdAt: new Date(),
        updatedAt: new Date(),
        estimatedHours: 4,
        tags: ['sample'],
        dependencies: [],
        attachments: [],
        comments: [],
        subtasks: []
      }
    ];
  }

  // Observable-based convenience methods
  getListsAsObservable(): Observable<List[]> {
    return this.lists$;
  }

  getListItemsAsObservable(listId: string): Observable<ListItem[]> {
    return this.getListItems(listId);
  }
}
