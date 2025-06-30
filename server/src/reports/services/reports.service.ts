import { Injectable } from '@nestjs/common';
import { BehaviorSubject, Observable, interval } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { SystemHealth, SafeMetrics, ReportsData } from '../interfaces/reports.interface';

@Injectable()
export class ReportsService {
  private systemHealthSubject = new BehaviorSubject<SystemHealth>({
    serverUptime: 0,
    serverStatus: 'healthy',
    lastServerUpdate: new Date(),
    memoryUsage: {
      used: 4.2,
      total: 8.0,
      percentage: 52.5
    },
    cpuUsage: {
      current: 23.8,
      average: 28.5,
      peak: 45.2
    },
    diskUsage: {
      used: 125.6,
      total: 500.0,
      percentage: 25.1
    },
    networkStats: {
      incoming: 12.4,
      outgoing: 8.7,
      totalRequests: 1247,
      activeConnections: 42
    },
    serviceStatus: {
      database: 'healthy',
      cache: 'healthy',
      messaging: 'warning',
      storage: 'healthy',
      authentication: 'healthy'
    }
  });

  private safeMetricsSubject = new BehaviorSubject<SafeMetrics>({
    sprintData: {
      currentSprint: 6,
      totalSprints: 12,
      sprintGoal: 'Implement user authentication and dashboard features',
      sprintProgress: 75
    },
    velocityData: {
      labels: ['Sprint 1', 'Sprint 2', 'Sprint 3', 'Sprint 4', 'Sprint 5', 'Sprint 6'],
      completed: [42, 38, 45, 52, 48, 55],
      planned: [50, 45, 48, 55, 50, 58]
    },
    burndownData: {
      labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7', 'Day 8', 'Day 9', 'Day 10'],
      ideal: [100, 95, 88, 82, 75, 68, 58, 45, 30, 0],
      actual: [100, 92, 85, 88, 75, 70, 65, 52, 35, 8]
    },
    defectData: {
      labels: ['Sprint 1', 'Sprint 2', 'Sprint 3', 'Sprint 4', 'Sprint 5', 'Sprint 6'],
      found: [8, 12, 6, 15, 9, 7],
      resolved: [6, 10, 8, 12, 11, 9]
    },
    testData: {
      labels: ['Sprint 1', 'Sprint 2', 'Sprint 3', 'Sprint 4', 'Sprint 5', 'Sprint 6'],
      passed: [85, 88, 92, 89, 94, 96],
      failed: [15, 12, 8, 11, 6, 4],
      coverage: [78, 82, 85, 87, 90, 93]
    },
    cumulativeFlowData: {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
      backlog: [45, 42, 38, 35, 32, 28],
      inProgress: [8, 12, 15, 18, 16, 14],
      done: [12, 18, 25, 32, 38, 45]
    },
    leadTimeData: {
      labels: ['Sprint 1', 'Sprint 2', 'Sprint 3', 'Sprint 4', 'Sprint 5', 'Sprint 6'],
      leadTime: [8.5, 7.2, 6.8, 7.9, 6.1, 5.8],
      cycleTime: [4.2, 3.8, 3.5, 4.1, 3.2, 2.9]
    }
  });

  private startTime = Date.now();

  constructor() {
    this.startRealTimeUpdates();
  }

  // Hot observable for system health with real-time updates
  getSystemHealth(): Observable<SystemHealth> {
    return this.systemHealthSubject.asObservable();
  }

  // Hot observable for SAFe metrics
  getSafeMetrics(): Observable<SafeMetrics> {
    return this.safeMetricsSubject.asObservable();
  }

  // Combined reports data stream
  getReportsData(): Observable<ReportsData> {
    return interval(5000).pipe(
      startWith(0),
      map(() => {
        const systemHealth = this.systemHealthSubject.value;
        const safeMetrics = this.safeMetricsSubject.value;
        
        return {
          systemHealth,
          safeMetrics,
          chartConfigurations: this.getChartConfigurations(systemHealth, safeMetrics),
          lastUpdated: new Date()
        };
      })
    );
  }

  // Get current snapshot of reports data (for HTTP GET requests)
  getCurrentReportsData(): ReportsData {
    const systemHealth = this.systemHealthSubject.value;
    const safeMetrics = this.safeMetricsSubject.value;
    
    return {
      systemHealth,
      safeMetrics,
      chartConfigurations: this.getChartConfigurations(systemHealth, safeMetrics),
      lastUpdated: new Date()
    };
  }

  private startRealTimeUpdates(): void {
    // Update system health every 5 seconds with simulated real data
    interval(5000).subscribe(() => {
      const currentHealth = this.systemHealthSubject.value;
      
      // Simulate realistic fluctuations
      const updatedHealth: SystemHealth = {
        ...currentHealth,
        serverUptime: Math.floor((Date.now() - this.startTime) / 1000),
        lastServerUpdate: new Date(),
        memoryUsage: {
          ...currentHealth.memoryUsage,
          used: this.randomFluctuation(currentHealth.memoryUsage.used, 0.5),
          percentage: this.randomFluctuation(currentHealth.memoryUsage.percentage, 3)
        },
        cpuUsage: {
          ...currentHealth.cpuUsage,
          current: this.randomFluctuation(currentHealth.cpuUsage.current, 5),
          average: this.randomFluctuation(currentHealth.cpuUsage.average, 2)
        },
        networkStats: {
          ...currentHealth.networkStats,
          incoming: this.randomFluctuation(currentHealth.networkStats.incoming, 2),
          outgoing: this.randomFluctuation(currentHealth.networkStats.outgoing, 1.5),
          totalRequests: currentHealth.networkStats.totalRequests + Math.floor(Math.random() * 10),
          activeConnections: Math.max(0, currentHealth.networkStats.activeConnections + Math.floor(Math.random() * 6) - 3)
        }
      };

      this.systemHealthSubject.next(updatedHealth);
    });

    // Update SAFe metrics less frequently (every 30 seconds)
    interval(30000).subscribe(() => {
      const currentMetrics = this.safeMetricsSubject.value;
      
      // Simulate sprint progress updates
      const updatedMetrics: SafeMetrics = {
        ...currentMetrics,
        sprintData: {
          ...currentMetrics.sprintData,
          sprintProgress: Math.min(100, currentMetrics.sprintData.sprintProgress + Math.random() * 2)
        }
      };

      this.safeMetricsSubject.next(updatedMetrics);
    });
  }

  private randomFluctuation(baseValue: number, maxChange: number): number {
    const change = (Math.random() - 0.5) * 2 * maxChange;
    return Math.max(0, Math.round((baseValue + change) * 10) / 10);
  }

  private getChartConfigurations(systemHealth: SystemHealth, safeMetrics: SafeMetrics) {
    return {
      serverUptime: {
        labels: ['Uptime', 'Downtime'],
        datasets: [{
          data: [99.8, 0.2],
          label: 'Server Uptime',
          backgroundColor: ['#4caf50', '#f44336'],
          borderWidth: 0
        }]
      },
      memoryUsage: {
        labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'],
        datasets: [{
          data: [45, 52, 48, 55, 62, 58, systemHealth.memoryUsage.percentage],
          label: 'Memory Usage %',
          borderColor: '#2196f3',
          backgroundColor: 'rgba(33, 150, 243, 0.1)',
          fill: true,
          tension: 0.4
        }]
      },
      cpuUsage: {
        labels: Array.from({length: 24}, (_, i) => i + ':00'),
        datasets: [{
          data: [15, 18, 22, 25, 28, 32, 35, 42, 38, 33, 29, 31, 34, 37, 40, 35, 32, 28, 25, 22, 19, 17, 16, systemHealth.cpuUsage.current],
          label: 'CPU Usage %',
          borderColor: '#ff9800',
          backgroundColor: 'rgba(255, 152, 0, 0.1)',
          fill: true,
          tension: 0.4
        }]
      },
      networkTraffic: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
          {
            data: [12.4, 15.2, 18.7, 22.1, 19.8, 8.9, systemHealth.networkStats.incoming],
            label: 'Incoming (MB/s)',
            backgroundColor: '#4caf50'
          },
          {
            data: [8.7, 11.2, 13.8, 16.4, 14.1, 6.2, systemHealth.networkStats.outgoing],
            label: 'Outgoing (MB/s)',
            backgroundColor: '#2196f3'
          }
        ]
      },
      velocity: {
        labels: safeMetrics.velocityData.labels,
        datasets: [
          {
            data: safeMetrics.velocityData.completed,
            label: 'Story Points Completed',
            fill: true,
            tension: 0.5,
            borderColor: '#1976d2',
            backgroundColor: 'rgba(25, 118, 210, 0.1)'
          },
          {
            data: safeMetrics.velocityData.planned,
            label: 'Planned Story Points',
            fill: false,
            tension: 0.5,
            borderColor: '#ff9800',
            backgroundColor: 'rgba(255, 152, 0, 0.1)'
          }
        ]
      },
      burndown: {
        labels: safeMetrics.burndownData.labels,
        datasets: [
          {
            data: safeMetrics.burndownData.ideal,
            label: 'Ideal Burndown',
            fill: false,
            tension: 0.1,
            borderColor: '#4caf50',
            backgroundColor: 'rgba(76, 175, 80, 0.1)',
            borderDash: [5, 5]
          },
          {
            data: safeMetrics.burndownData.actual,
            label: 'Actual Burndown',
            fill: true,
            tension: 0.3,
            borderColor: '#f44336',
            backgroundColor: 'rgba(244, 67, 54, 0.1)'
          }
        ]
      },
      defects: {
        labels: safeMetrics.defectData.labels,
        datasets: [
          {
            data: safeMetrics.defectData.found,
            label: 'Defects Found',
            backgroundColor: '#f44336'
          },
          {
            data: safeMetrics.defectData.resolved,
            label: 'Defects Resolved',
            backgroundColor: '#4caf50'
          }
        ]
      },
      testing: {
        labels: safeMetrics.testData.labels,
        datasets: [
          {
            data: safeMetrics.testData.passed,
            label: 'Tests Passed %',
            backgroundColor: '#4caf50'
          },
          {
            data: safeMetrics.testData.failed,
            label: 'Tests Failed %',
            backgroundColor: '#f44336'
          },
          {
            data: safeMetrics.testData.coverage,
            label: 'Code Coverage %',
            backgroundColor: '#2196f3'
          }
        ]
      },
      cumulativeFlow: {
        labels: safeMetrics.cumulativeFlowData.labels,
        datasets: [
          {
            data: safeMetrics.cumulativeFlowData.backlog,
            label: 'Backlog',
            backgroundColor: '#9e9e9e'
          },
          {
            data: safeMetrics.cumulativeFlowData.inProgress,
            label: 'In Progress',
            backgroundColor: '#ff9800'
          },
          {
            data: safeMetrics.cumulativeFlowData.done,
            label: 'Done',
            backgroundColor: '#4caf50'
          }
        ]
      },
      leadTime: {
        labels: safeMetrics.leadTimeData.labels,
        datasets: [
          {
            data: safeMetrics.leadTimeData.leadTime,
            label: 'Lead Time (days)',
            borderColor: '#2196f3',
            backgroundColor: 'rgba(33, 150, 243, 0.1)',
            fill: true,
            tension: 0.4
          },
          {
            data: safeMetrics.leadTimeData.cycleTime,
            label: 'Cycle Time (days)',
            borderColor: '#ff9800',
            backgroundColor: 'rgba(255, 152, 0, 0.1)',
            fill: true,
            tension: 0.4
          }
        ]
      }
    };
  }
}
