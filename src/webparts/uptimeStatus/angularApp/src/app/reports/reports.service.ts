import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ReportsData, SystemHealth, SafeMetrics } from './reports.interface';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {
  private baseUrl = '/api/reports';
  private reportsDataSubject = new BehaviorSubject<ReportsData | null>(null);
  private eventSource: EventSource | null = null;

  constructor(private http: HttpClient) {
    this.initializeEventSource();
  }

  // Get the current reports data as observable
  getReportsData(): Observable<ReportsData | null> {
    return this.reportsDataSubject.asObservable();
  }

  // Get system health data
  getSystemHealth(): Observable<SystemHealth> {
    return this.http.get<SystemHealth>(`${this.baseUrl}/system-health`);
  }

  // Get SAFe metrics data
  getSafeMetrics(): Observable<SafeMetrics> {
    return this.http.get<SafeMetrics>(`${this.baseUrl}/safe-metrics`);
  }

  // Get all reports data
  getAllReportsData(): Observable<ReportsData> {
    console.log('Making HTTP request to:', `${this.baseUrl}/all`);
    return this.http.get<ReportsData>(`${this.baseUrl}/all`).pipe(
      catchError(error => {
        console.error('HTTP Error in getAllReportsData:', error);
        throw error;
      })
    );
  }

  // Initialize Server-Sent Events for real-time updates
  private initializeEventSource(): void {
    console.log('Initializing EventSource for reports stream...');
    if (typeof EventSource !== 'undefined') {
      this.eventSource = new EventSource(`${this.baseUrl}/reports-stream`);
      
      this.eventSource.onmessage = (event) => {
        try {
          console.log('Received SSE data:', event.data);
          const data: ReportsData = JSON.parse(event.data);
          this.reportsDataSubject.next(data);
        } catch (error) {
          console.error('Error parsing SSE data:', error);
        }
      };

      this.eventSource.onerror = (error) => {
        console.error('SSE error:', error);
        console.log('SSE readyState:', this.eventSource?.readyState);
        // Fallback to HTTP polling if SSE fails
        this.fallbackToPolling();
      };

      this.eventSource.onopen = () => {
        console.log('SSE connection opened successfully');
      };
    } else {
      console.log('EventSource not supported, falling back to polling');
      // Fallback for browsers that don't support SSE
      this.fallbackToPolling();
    }
  }

  // Fallback to HTTP polling every 5 seconds
  private fallbackToPolling(): void {
    console.log('Starting HTTP polling fallback...');
    setInterval(() => {
      console.log('Polling for reports data...');
      this.getAllReportsData().subscribe(
        data => {
          console.log('Polling successful:', data);
          this.reportsDataSubject.next(data);
        },
        error => {
          console.error('Polling error:', error);
        }
      );
    }, 5000);
  }

  // Clean up resources
  destroy(): void {
    if (this.eventSource) {
      this.eventSource.close();
    }
  }

  // Helper methods for formatting and status
  getStatusColor(status: string): string {
    switch (status) {
      case 'healthy': return '#4caf50';
      case 'warning': return '#ff9800';
      case 'critical': return '#f44336';
      default: return '#9e9e9e';
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'healthy': return 'check_circle';
      case 'warning': return 'warning';
      case 'critical': return 'error';
      default: return 'help';
    }
  }

  getUsageColor(percentage: number): string {
    if (percentage < 60) return '#4caf50';
    if (percentage < 80) return '#ff9800';
    return '#f44336';
  }

  formatBytes(bytes: number): string {
    if (bytes === 0) return '0 GB';
    const k = 1024;
    const sizes = ['GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  formatUptime(seconds: number): string {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  }
}
