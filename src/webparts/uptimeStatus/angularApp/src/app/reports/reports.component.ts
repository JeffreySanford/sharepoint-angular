import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { ReportsService } from './reports.service';
import { ReportsData, SystemHealth, SafeMetrics } from './reports.interface';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit, OnDestroy {
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  reportsData: ReportsData | null = null;
  systemHealth: SystemHealth | null = null;
  safeMetrics: SafeMetrics | null = null;
  lastUpdated: Date | null = null;
  
  private subscription: Subscription = new Subscription();

  // Chart options
  doughnutChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 20
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0,0,0,0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        cornerRadius: 8
      }
    }
  };

  lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0,0,0,0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        cornerRadius: 8
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0,0,0,0.1)'
        }
      },
      x: {
        grid: {
          color: 'rgba(0,0,0,0.1)'
        }
      }
    }
  };

  barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0,0,0,0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        cornerRadius: 8
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0,0,0,0.1)'
        }
      },
      x: {
        grid: {
          color: 'rgba(0,0,0,0.1)'
        }
      }
    }
  };

  constructor(private reportsService: ReportsService) {}

  ngOnInit(): void {
    console.log('Reports component initialized');
    
    // Subscribe to real-time reports data
    this.subscription.add(
      this.reportsService.getReportsData().subscribe(data => {
        console.log('Received real-time reports data:', data);
        if (data) {
          this.reportsData = data;
          this.systemHealth = data.systemHealth;
          this.safeMetrics = data.safeMetrics;
          this.lastUpdated = data.lastUpdated;
        }
      })
    );

    // Initial data load
    console.log('Attempting to load initial reports data...');
    this.reportsService.getAllReportsData().subscribe(
      data => {
        console.log('Successfully loaded initial reports data:', data);
        this.reportsData = data;
        this.systemHealth = data.systemHealth;
        this.safeMetrics = data.safeMetrics;
        this.lastUpdated = data.lastUpdated;
      },
      error => {
        console.error('Error loading reports data:', error);
        console.error('Error details:', error.message);
        console.error('Error status:', error.status);
        console.error('Error url:', error.url);
      }
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.reportsService.destroy();
  }

  // Helper methods
  getStatusColor(status: string): string {
    return this.reportsService.getStatusColor(status);
  }

  getStatusIcon(status: string): string {
    return this.reportsService.getStatusIcon(status);
  }

  getUsageColor(percentage: number): string {
    return this.reportsService.getUsageColor(percentage);
  }

  formatBytes(bytes: number): string {
    return this.reportsService.formatBytes(bytes);
  }

  formatUptime(seconds: number): string {
    return this.reportsService.formatUptime(seconds);
  }

  refreshData(): void {
    this.reportsService.getAllReportsData().subscribe(
      data => {
        this.reportsData = data;
        this.systemHealth = data.systemHealth;
        this.safeMetrics = data.safeMetrics;
        this.lastUpdated = data.lastUpdated;
      },
      error => {
        console.error('Error refreshing reports data:', error);
      }
    );
  }
}
