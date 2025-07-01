import { Component, OnInit, OnDestroy } from '@angular/core';
import { List, ListType, ListStatus, ListsData } from '../interfaces/lists.interface';
import { ListsService } from '../services/lists.service';
import { Subject, takeUntil } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-lists-overview',
  templateUrl: './lists-overview.component.html',
  styleUrls: ['./lists-overview.component.scss']
})
export class ListsOverviewComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  lists: List[] = [];
  filteredLists: List[] = [];
  selectedListId: string | null = null;
  selectedType: string = '';
  searchTerm: string = '';
  loading: boolean = false;
  
  // Add missing properties for template
  filterType: string = '';
  filterStatus: string = '';
  viewMode: 'cards' | 'list' = 'cards';
  displayedColumns: string[] = ['type', 'title', 'status', 'progress', 'items', 'actions'];
  
  // Expose enums to template
  ListType = ListType;
  ListStatus = ListStatus;
  
  // Getter/setter for isLoading to match template expectations
  get isLoading(): boolean {
    return this.loading;
  }
  
  set isLoading(value: boolean) {
    this.loading = value;
  }

  constructor(private listsService: ListsService) {}

  ngOnInit(): void {
    console.log('Lists component initialized');
    this.loadLists();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadLists(): void {
    this.loading = true;
    
    // Subscribe to the reactive data stream like the Reports component
    this.listsService.listsData$.pipe(
      takeUntil(this.destroy$),
      catchError(error => {
        console.error('Error loading lists data:', error);
        this.loading = false;
        return of({ lists: [], recentActivity: [], metrics: null, lastUpdated: new Date() });
      })
    ).subscribe(data => {
      console.log('Received real-time lists data:', data);
      this.lists = data.lists || [];
      this.applyFilters();
      this.loading = false;
    });
  }

  applyFilters(): void {
    this.filteredLists = this.lists.filter(list => {
      const matchesType = !this.filterType || list.type === this.filterType;
      const matchesStatus = !this.filterStatus || list.status === this.filterStatus;
      const matchesSearch = !this.searchTerm || 
        list.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        (list.description && list.description.toLowerCase().includes(this.searchTerm.toLowerCase()));
      
      return matchesType && matchesStatus && matchesSearch;
    });
  }

  // Add missing methods
  refreshData(): void {
    this.loadLists();
  }

  openCreateListDialog(): void {
    console.log('Opening create list dialog');
    // This would open the create dialog using MatDialog
    // Implementation will be added later
  }

  selectList(list: List): void {
    this.selectedListId = list.id;
    this.viewList(list);
  }

  editList(list: List): void {
    this.openEditListDialog(list);
  }

  deleteList(list: List): void {
    if (confirm(`Are you sure you want to delete "${list.title}"?`)) {
      this.listsService.deleteList(list.id).pipe(
        takeUntil(this.destroy$),
        catchError(error => {
          console.error('Error deleting list:', error);
          return of(null);
        })
      ).subscribe(() => {
        this.loadLists(); // Refresh the list
      });
    }
  }

  onDeleteList(list: List): void {
    this.deleteList(list);
  }

  openEditListDialog(list: List): void {
    console.log('Opening edit dialog for:', list.title);
    // This would open the edit dialog using MatDialog
    // Implementation will be added later
  }

  viewList(list: List): void {
    this.selectedListId = list.id;
    console.log('Viewing list:', list.title);
    // This would emit an event to show the list detail
  }

  getTypeIcon(type: ListType): string {
    switch (type) {
      case ListType.SPRINT: return 'flash_on';
      case ListType.EPIC: return 'assignment';
      case ListType.BACKLOG: return 'list';
      case ListType.BUG_TRACKING: return 'bug_report';
      case ListType.FEATURE_REQUEST: return 'lightbulb';
      case ListType.TEAM_TASKS: return 'group';
      case ListType.PROJECT: return 'work';
      case ListType.PORTFOLIO: return 'business_center';
      case ListType.TASK: return 'task';
      case ListType.BUG: return 'bug_report';
      case ListType.FEATURE: return 'star';
      case ListType.USER_STORY: return 'person';
      default: return 'folder';
    }
  }

  getStatusColor(status: ListStatus | undefined): string {
    if (!status) return 'primary';
    switch (status) {
      case ListStatus.ACTIVE: return 'primary';
      case ListStatus.COMPLETED: return 'accent';
      case ListStatus.ON_HOLD: return 'warn';
      case ListStatus.INACTIVE: return '';
      default: return 'primary';
    }
  }

  getCompletedItemsCount(list: List): number {
    return list.items.filter(item => item.isCompleted).length;
  }

  getCompletionPercentage(list: List): number {
    if (list.items.length === 0) return 0;
    const completed = this.getCompletedItemsCount(list);
    return Math.round((completed / list.items.length) * 100);
  }

  getTypeClass(type: ListType): string {
    switch (type) {
      case ListType.BACKLOG: return 'backlog';
      case ListType.SPRINT: return 'sprint';
      case ListType.EPIC: return 'epic';
      case ListType.PROJECT: return 'project';
      case ListType.PORTFOLIO: return 'portfolio';
      default: return 'default';
    }
  }

  formatDate(date: Date | string): string {
    if (!date) return 'N/A';
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString();
  }

  trackByListId(index: number, list: List): string {
    return list.id;
  }
}
