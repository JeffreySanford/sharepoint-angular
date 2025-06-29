import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, interval } from 'rxjs';
import { switchMap, startWith } from 'rxjs/operators';

export interface UptimeData {
  uptime: number;
}

export interface TimeData {
  time: string;
}

@Injectable({
  providedIn: 'root'
})
export class UptimeService {

  constructor(private http: HttpClient) { }

  getUptime(): Observable<UptimeData> {
    return this.http.get<UptimeData>('/api/uptime');
  }

  getCurrentTime(): Observable<TimeData> {
    return this.http.get<TimeData>('/api/time');
  }

  // Auto-refresh every 5 seconds
  getUptimeStream(): Observable<UptimeData> {
    return interval(5000).pipe(
      startWith(0),
      switchMap(() => this.getUptime())
    );
  }

  getTimeStream(): Observable<TimeData> {
    return interval(1000).pipe(
      startWith(0),
      switchMap(() => this.getCurrentTime())
    );
  }
}
