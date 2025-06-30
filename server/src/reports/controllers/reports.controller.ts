import { Controller, Get, Sse } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ReportsService } from '../services/reports.service';
import { SystemHealth, SafeMetrics, ReportsData } from '../interfaces/reports.interface';

@Controller('api/reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('system-health')
  getSystemHealth(): Observable<SystemHealth> {
    return this.reportsService.getSystemHealth();
  }

  @Get('safe-metrics')
  getSafeMetrics(): Observable<SafeMetrics> {
    return this.reportsService.getSafeMetrics();
  }

  @Get('all')
  getAllReportsData(): ReportsData {
    return this.reportsService.getCurrentReportsData();
  }

  @Sse('system-health-stream')
  getSystemHealthStream(): Observable<MessageEvent> {
    return new Observable(observer => {
      const subscription = this.reportsService.getSystemHealth().subscribe(data => {
        observer.next({
          data: JSON.stringify(data),
          type: 'system-health'
        } as MessageEvent);
      });

      return () => subscription.unsubscribe();
    });
  }

  @Sse('safe-metrics-stream')
  getSafeMetricsStream(): Observable<MessageEvent> {
    return new Observable(observer => {
      const subscription = this.reportsService.getSafeMetrics().subscribe(data => {
        observer.next({
          data: JSON.stringify(data),
          type: 'safe-metrics'
        } as MessageEvent);
      });

      return () => subscription.unsubscribe();
    });
  }

  @Sse('reports-stream')
  getReportsStream(): Observable<MessageEvent> {
    return new Observable(observer => {
      const subscription = this.reportsService.getReportsData().subscribe(data => {
        observer.next({
          data: JSON.stringify(data),
          type: 'reports-data'
        } as MessageEvent);
      });

      return () => subscription.unsubscribe();
    });
  }
}
