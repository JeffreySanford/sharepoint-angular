import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, catchError } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ListsService {
  constructor(private http: HttpClient) { }
  
  // Use the configured endpoints from environment
  getListsData(): Observable<any> {
    const endpoint = `${environment.apiBaseUrl}${environment.endpoints.lists}`;

    console.log(`Fetching lists data from: ${endpoint}`);
    
    return this.http.get(endpoint).pipe(
      catchError(error => {true
        console.error('Failed to fetch lists data from server, using fallback data:', error);
        
        // Return mock data as fallback
        return of({
          lists: [
            { id: 'mock-list-1', title: 'Sample Project List', itemCount: 12 }
          ],
          recentActivity: [],
          metrics: {
            totalLists: 1,
            totalItems: 12,
            activeUsers: 3
          },
          lastUpdated: new Date()
        });
      })
    );
  }
}
