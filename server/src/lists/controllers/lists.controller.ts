import { Controller, Get, Post, Put, Delete, Param, Body, Sse } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ListsService } from '../services/lists.service';
import { List, ListItem, ListsData } from '../interfaces/list.interface';

@Controller('api/lists')
export class ListsController {
  constructor(private readonly listsService: ListsService) {}

  @Get()
  getAllLists(): Observable<List[]> {
    return this.listsService.getLists();
  }

  @Get('data')
  getAllListsData(): ListsData {
    return this.listsService.getCurrentListsData();
  }

  @Get('metrics')
  getMetrics() {
    return this.listsService.getMetrics();
  }

  @Get('activity')
  getRecentActivity() {
    return this.listsService.getRecentActivities();
  }

  @Post()
  createList(@Body() listData: any): List {
    return this.listsService.createList(listData);
  }

  @Put(':listId')
  updateList(@Param('listId') listId: string, @Body() updateData: any): List | null {
    return this.listsService.updateList(listId, updateData);
  }

  @Delete(':listId')
  deleteList(@Param('listId') listId: string): { success: boolean } {
    const success = this.listsService.deleteList(listId);
    return { success };
  }

  @Post(':listId/items')
  addListItem(@Param('listId') listId: string, @Body() itemData: any): ListItem | null {
    return this.listsService.addListItem(listId, itemData);
  }

  @Put(':listId/items/:itemId')
  updateListItem(
    @Param('listId') listId: string, 
    @Param('itemId') itemId: string, 
    @Body() updateData: any
  ): ListItem | null {
    return this.listsService.updateListItem(listId, itemId, updateData);
  }

  @Delete(':listId/items/:itemId')
  deleteListItem(
    @Param('listId') listId: string, 
    @Param('itemId') itemId: string
  ): { success: boolean } {
    const success = this.listsService.deleteListItem(listId, itemId);
    return { success };
  }

  // Server-Sent Events for real-time updates
  @Sse('stream')
  getListsStream(): Observable<MessageEvent> {
    return new Observable(observer => {
      const subscription = this.listsService.getListsData().subscribe(data => {
        observer.next({
          data: JSON.stringify(data),
          type: 'lists-data'
        } as MessageEvent);
      });

      return () => subscription.unsubscribe();
    });
  }

  @Sse('lists-stream')
  getListsOnlyStream(): Observable<MessageEvent> {
    return new Observable(observer => {
      const subscription = this.listsService.getLists().subscribe(data => {
        observer.next({
          data: JSON.stringify(data),
          type: 'lists'
        } as MessageEvent);
      });

      return () => subscription.unsubscribe();
    });
  }

  @Sse('metrics-stream')
  getMetricsStream(): Observable<MessageEvent> {
    return new Observable(observer => {
      const subscription = this.listsService.getMetrics().subscribe(data => {
        observer.next({
          data: JSON.stringify(data),
          type: 'lists-metrics'
        } as MessageEvent);
      });

      return () => subscription.unsubscribe();
    });
  }

  @Sse('activity-stream')
  getActivityStream(): Observable<MessageEvent> {
    return new Observable(observer => {
      const subscription = this.listsService.getRecentActivities().subscribe(data => {
        observer.next({
          data: JSON.stringify(data),
          type: 'recent-activity'
        } as MessageEvent);
      });

      return () => subscription.unsubscribe();
    });
  }
}
