import { Component, OnDestroy, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject, takeUntil, combineLatest, BehaviorSubject } from 'rxjs';
import { map, switchMap, tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { ListsService } from '../services/lists.service';
import { List, ListItem, ListItemStatus, Priority, CreateListItemRequest, ListStatus, ListType } from '../interfaces/lists.interface';
import { ListDialogComponent } from './list-dialog.component';
import { ListItemDialogComponent } from './list-item-dialog.component';

@Component({
  selector: 'app-list-detail',
  templateUrl: './list-detail.component.html',
  styleUrls: ['./list-detail.component.scss']
})
export class ListDetailComponent implements OnDestroy {
  private destroy$ = new Subject<void>();
  private listIdSubject = new BehaviorSubject<string | null>(null);

  // Make enums available in template
  public readonly ListStatus = ListStatus;
  public readonly ListItemStatus = ListItemStatus;
  public readonly Priority = Priority;
  public readonly ListType = ListType;

  @Input() set listId(value: string | null) {
    this.listIdSubject.next(value);
  }

  get listId(): string | null {
    return this.listIdSubject.value;
  }

  public list: List | null = null;
  public filteredItems: ListItem[] = [];
  public isLoading = true;
  public error: string | null = null;

  // Filter and view options as BehaviorSubjects for reactive updates
  private viewModeSubject = new BehaviorSubject<'cards' | 'table' | 'kanban'>('cards');
  private filterStatusSubject = new BehaviorSubject<ListItemStatus | 'all'>('all');
  private filterPrioritySubject = new BehaviorSubject<Priority | 'all'>('all');
  private filterAssigneeSubject = new BehaviorSubject<string | 'all'>('all');
  private searchTermSubject = new BehaviorSubject<string>('');
  private sortBySubject = new BehaviorSubject<'priority' | 'dueDate' | 'status' | 'title'>('priority');
  private sortOrderSubject = new BehaviorSubject<'asc' | 'desc'>('desc');

  // Expose as observables for template
  public viewMode$ = this.viewModeSubject.asObservable();
  public filterStatus$ = this.filterStatusSubject.asObservable();
  public filterPriority$ = this.filterPrioritySubject.asObservable();
  public filterAssignee$ = this.filterAssigneeSubject.asObservable();
  public searchTerm$ = this.searchTermSubject.asObservable();
  public sortBy$ = this.sortBySubject.asObservable();
  public sortOrder$ = this.sortOrderSubject.asObservable();

  // Getters for current values (for template compatibility)
  get viewMode() { return this.viewModeSubject.value; }
  set viewMode(value: 'cards' | 'table' | 'kanban') { this.viewModeSubject.next(value); }
  
  get filterStatus() { return this.filterStatusSubject.value; }
  set filterStatus(value: ListItemStatus | 'all') { this.filterStatusSubject.next(value); }
  
  get filterPriority() { return this.filterPrioritySubject.value; }
  set filterPriority(value: Priority | 'all') { this.filterPrioritySubject.next(value); }
  
  get filterAssignee() { return this.filterAssigneeSubject.value; }
  set filterAssignee(value: string | 'all') { this.filterAssigneeSubject.next(value); }
  
  get searchTerm() { return this.searchTermSubject.value; }
  set searchTerm(value: string) { this.searchTermSubject.next(value); }
  
  get sortBy() { return this.sortBySubject.value; }
  set sortBy(value: 'priority' | 'dueDate' | 'status' | 'title') { this.sortBySubject.next(value); }
  
  get sortOrder() { return this.sortOrderSubject.value; }
  set sortOrder(value: 'asc' | 'desc') { this.sortOrderSubject.next(value); }

  // Kanban columns
  public kanbanColumns = [
    { status: ListItemStatus.TODO, title: 'To Do', color: '#f5f5f5' },
    { status: ListItemStatus.IN_PROGRESS, title: 'In Progress', color: '#e3f2fd' },
    { status: ListItemStatus.IN_REVIEW, title: 'In Review', color: '#fff3e0' },
    { status: ListItemStatus.DONE, title: 'Done', color: '#e8f5e8' }
  ];

  constructor(
    private listsService: ListsService,
    private dialog: MatDialog
  ) {
    // Set up reactive data stream
    this.listIdSubject.pipe(
      takeUntil(this.destroy$),
      switchMap(listId => {
        if (!listId) {
          this.list = null;
          this.filteredItems = [];
          this.isLoading = false;
          return of(null);
        }
        
        this.isLoading = true;
        this.error = null;
        
        return this.listsService.getList(listId).pipe(
          catchError(error => {
            this.error = 'Failed to load list';
            this.isLoading = false;
            console.error('Error loading list:', error);
            return of(null);
          })
        );
      })
    ).subscribe(list => {
      if (list) {
        this.list = list;
        this.updateFilteredItems();
        this.isLoading = false;
      }
    });

    // Set up reactive filtering
    combineLatest([
      this.filterStatusSubject,
      this.filterPrioritySubject,
      this.filterAssigneeSubject,
      this.searchTermSubject,
      this.sortBySubject,
      this.sortOrderSubject
    ]).pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.updateFilteredItems();
    });
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadList(listId: string): void {
    this.isLoading = true;
    this.error = null;
    
    this.listsService.getList(listId).pipe(
      takeUntil(this.destroy$),
      catchError(error => {
        this.error = 'Failed to load list';
        this.isLoading = false;
        console.error('Error loading list:', error);
        return of(null);
      })
    ).subscribe(list => {
      if (list) {
        this.list = list;
        this.updateFilteredItems();
      }
      this.isLoading = false;
    });
  }

  private updateFilteredItems(): void {
    if (!this.list) {
      this.filteredItems = [];
      return;
    }

    let items = [...this.list.items];

    // Apply filters
    items = items.filter(item => {
      const matchesStatus = this.filterStatus === 'all' || item.status === this.filterStatus;
      const matchesPriority = this.filterPriority === 'all' || item.priority === this.filterPriority;
      const matchesAssignee = this.filterAssignee === 'all' || 
        (item.assignee && item.assignee.toLowerCase().includes(this.filterAssignee.toLowerCase()));
      const matchesSearch = !this.searchTerm || 
        item.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(this.searchTerm.toLowerCase()));
      
      return matchesStatus && matchesPriority && matchesAssignee && matchesSearch;
    });

    // Apply sorting
    items.sort((a, b) => {
      let comparison = 0;
      
      switch (this.sortBy) {
        case 'priority':
          const priorityOrder: { [key: string]: number } = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1, NONE: 0 };
          comparison = (priorityOrder[a.priority as string] || 0) - (priorityOrder[b.priority as string] || 0);
          break;
        case 'dueDate':
          const aDate = a.dueDate ? new Date(a.dueDate).getTime() : 0;
          const bDate = b.dueDate ? new Date(b.dueDate).getTime() : 0;
          comparison = aDate - bDate;
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
      }
      
      return this.sortOrder === 'desc' ? -comparison : comparison;
    });

    this.filteredItems = items;
  }

  openCreateItemDialog(): void {
    if (!this.list) return;

    const dialogRef = this.dialog.open(ListItemDialogComponent, {
      width: '700px',
      data: { mode: 'create', listId: this.list.id }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && this.list) {
        this.listsService.createListItem(this.list.id, result).pipe(
          takeUntil(this.destroy$),
          catchError(error => {
            this.error = 'Failed to create item';
            console.error('Error creating item:', error);
            return of(null);
          })
        ).subscribe(newItem => {
          if (newItem && this.list) {
            // Reload the list to show the new item
            this.loadList(this.list.id);
          }
        });
      }
    });
  }

  openEditItemDialog(item: ListItem): void {
    if (!this.list) return;

    const dialogRef = this.dialog.open(ListItemDialogComponent, {
      width: '700px',
      data: { mode: 'edit', listId: this.list.id, item }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && this.list) {
        this.listsService.updateListItem(this.list.id, item.id, result).pipe(
          takeUntil(this.destroy$),
          catchError(error => {
            this.error = 'Failed to update item';
            console.error('Error updating item:', error);
            return of(null);
          })
        ).subscribe(updatedItem => {
          if (updatedItem && this.list) {
            // Reload the list to show the updated item
            this.loadList(this.list.id);
          }
        });
      }
    });
  }

  openEditListDialog(): void {
    if (!this.list) return;

    const dialogRef = this.dialog.open(ListDialogComponent, {
      width: '600px',
      data: { mode: 'edit', list: this.list }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && this.list) {
        this.listsService.updateList(this.list.id, result).pipe(
          takeUntil(this.destroy$),
          catchError(error => {
            this.error = 'Failed to update list';
            console.error('Error updating list:', error);
            return of(null);
          })
        ).subscribe(updatedList => {
          if (updatedList && this.list) {
            // Reload the list to show the updated data
            this.loadList(this.list.id);
          }
        });
      }
    });
  }

  deleteItem(item: ListItem): void {
    if (!this.list) return;

    if (confirm(`Are you sure you want to delete "${item.title}"?`)) {
      this.listsService.deleteListItem(this.list.id, item.id).pipe(
        takeUntil(this.destroy$),
        catchError(error => {
          this.error = 'Failed to delete item';
          console.error('Error deleting item:', error);
          return of(null);
        })
      ).subscribe(() => {
        if (this.list) {
          // Reload the list to reflect the deletion
          this.loadList(this.list.id);
        }
      });
    }
  }

  deleteList(): void {
    if (!this.list) return;

    if (confirm(`Are you sure you want to delete "${this.list.title}"?`)) {
      this.listsService.deleteList(this.list.id).pipe(
        takeUntil(this.destroy$),
        catchError(error => {
          this.error = 'Failed to delete list';
          console.error('Error deleting list:', error);
          return of(null);
        })
      ).subscribe(() => {
        // List deleted - component should be hidden
        this.list = null;
      });
    }
  }

  goBack(): void {
    // Since we don't have routing, this method will be used to emit an event
    // or set a flag that the parent component can use to switch back to overview
    this.list = null;
  }

  onFilterChange(): void {
    this.updateFilteredItems();
  }

  onSortChange(): void {
    this.updateFilteredItems();
  }

  toggleSortOrder(): void {
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    this.updateFilteredItems();
  }

  getStatusColor(status: ListItemStatus): string {
    switch (status) {
      case ListItemStatus.TODO: return '';
      case ListItemStatus.IN_PROGRESS: return 'primary';
      case ListItemStatus.IN_REVIEW: return 'accent';
      case ListItemStatus.DONE: return 'primary';
      default: return '';
    }
  }

  getPriorityColor(priority: Priority): string {
    switch (priority) {
      case Priority.CRITICAL: return '#d32f2f';
      case Priority.HIGH: return '#f57c00';
      case Priority.MEDIUM: return '#1976d2';
      case Priority.LOW: return '#388e3c';
      default: return '#757575';
    }
  }

  getPriorityIcon(priority: Priority): string {
    switch (priority) {
      case Priority.CRITICAL: return 'priority_high';
      case Priority.HIGH: return 'expand_less';
      case Priority.MEDIUM: return 'remove';
      case Priority.LOW: return 'expand_more';
      default: return 'remove';
    }
  }

  getItemsByStatus(status: ListItemStatus): ListItem[] {
    return this.filteredItems.filter(item => item.status === status);
  }

  onItemDropped(event: any, newStatus: ListItemStatus): void {
    // This would handle drag & drop in kanban view
    const item = event.item.data;
    if (item.status !== newStatus && this.list) {
      const updateData = { ...item, status: newStatus };
      this.listsService.updateListItem(this.list.id, item.id, updateData).pipe(
        takeUntil(this.destroy$),
        catchError(error => {
          this.error = 'Failed to update item status';
          console.error('Error updating item status:', error);
          return of(null);
        })
      ).subscribe(updatedItem => {
        if (updatedItem && this.list) {
          // Reload the list to reflect the status change
          this.loadList(this.list.id);
        }
      });
    }
  }

  get completionPercentage(): number {
    if (!this.list || this.list.items.length === 0) return 0;
    const completed = this.list.items.filter(item => item.status === ListItemStatus.DONE).length;
    return Math.round((completed / this.list.items.length) * 100);
  }

  get uniqueAssignees(): string[] {
    if (!this.list) return [];
    const assignees = this.list.items
      .map(item => item.assignee)
      .filter((assignee, index, array) => assignee && array.indexOf(assignee) === index) as string[];
    return assignees;
  }

  get completedItemsCount(): number {
    if (!this.list) return 0;
    return this.list.items.filter(item => item.status === ListItemStatus.DONE).length;
  }

  isOverdue(dueDate: Date | undefined): boolean {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  }
}
