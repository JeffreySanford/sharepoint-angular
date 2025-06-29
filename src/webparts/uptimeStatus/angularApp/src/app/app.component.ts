import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { UptimeService, UptimeData, TimeData } from './uptime.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Server Status Dashboard';
  uptime$: Observable<UptimeData>;
  currentTime$: Observable<TimeData>;
  isLoading = true;
  private subscriptions = new Subscription();

  constructor(private uptimeService: UptimeService) {
    this.uptime$ = this.uptimeService.getUptimeStream();
    this.currentTime$ = this.uptimeService.getTimeStream();
  }

  ngOnInit(): void {
    // Set loading to false after first data load
    const uptimeSub = this.uptime$.subscribe(() => {
      this.isLoading = false;
    });
    this.subscriptions.add(uptimeSub);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  formatUptime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}h ${minutes}m ${secs}s`;
  }

  formatTime(timeString: string): string {
    return new Date(timeString).toLocaleString();
  }

  refreshData(): void {
    this.isLoading = true;
    // Force refresh by creating new observables
    this.uptime$ = this.uptimeService.getUptimeStream();
    this.currentTime$ = this.uptimeService.getTimeStream();
    
    setTimeout(() => {
      this.isLoading = false;
    }, 500);
  }
}
