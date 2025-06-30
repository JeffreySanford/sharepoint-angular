import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { UptimeService, UptimeData, TimeData } from '../uptime.service';
import { ReportsService } from '../reports/reports.service';
import { ReportsData, SystemHealth, SafeMetrics } from '../reports/reports.interface';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-metrics',
  templateUrl: './metrics.component.html',
  styleUrls: ['./metrics.component.scss']
})
export class MetricsComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  // Server Monitoring Data
  uptimeData$!: Observable<UptimeData>;
  timeData$!: Observable<TimeData>;
  serverMetrics$!: Observable<any>;

  // System Health Metrics
  systemHealth = {
    serverUptime: 0,
    serverStatus: 'unknown',
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
  };

  // Infrastructure Monitoring Charts
  serverUptimeChartData: ChartData<'doughnut'> = {
    labels: ['Uptime', 'Downtime'],
    datasets: [{
      data: [99.8, 0.2],
      backgroundColor: ['#4caf50', '#f44336'],
      borderWidth: 0
    }]
  };

  memoryUsageChartData: ChartData<'line'> = {
    labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'],
    datasets: [{
      data: [45, 52, 48, 55, 62, 58, 53],
      label: 'Memory Usage %',
      borderColor: '#2196f3',
      backgroundColor: 'rgba(33, 150, 243, 0.1)',
      fill: true,
      tension: 0.4
    }]
  };

  cpuUsageChartData: ChartData<'line'> = {
    labels: Array.from({length: 24}, (_, i) => i + ':00'),
    datasets: [{
      data: [15, 18, 22, 25, 28, 32, 35, 42, 38, 33, 29, 31, 34, 37, 40, 35, 32, 28, 25, 22, 19, 17, 16, 15],
      label: 'CPU Usage %',
      borderColor: '#ff9800',
      backgroundColor: 'rgba(255, 152, 0, 0.1)',
      fill: true,
      tension: 0.4
    }]
  };

  networkTrafficChartData: ChartData<'bar'> = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        data: [12.4, 15.2, 18.7, 22.1, 19.8, 8.9, 6.3],
        label: 'Incoming (MB/s)',
        backgroundColor: '#4caf50'
      },
      {
        data: [8.7, 11.2, 13.8, 16.4, 14.1, 6.2, 4.8],
        label: 'Outgoing (MB/s)',
        backgroundColor: '#2196f3'
      }
    ]
  };

  // Chart Options for Server Monitoring
  serverChartOptions: ChartConfiguration['options'] = {
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

  // Velocity Chart Data
  velocityChartData: ChartData<'line'> = {
    labels: ['Sprint 1', 'Sprint 2', 'Sprint 3', 'Sprint 4', 'Sprint 5', 'Sprint 6'],
    datasets: [
      {
        data: [42, 38, 45, 52, 48, 55],
        label: 'Story Points Completed',
        fill: true,
        tension: 0.5,
        borderColor: '#1976d2',
        backgroundColor: 'rgba(25, 118, 210, 0.1)'
      },
      {
        data: [50, 45, 48, 55, 50, 58],
        label: 'Planned Story Points',
        fill: false,
        tension: 0.5,
        borderColor: '#ff9800',
        backgroundColor: 'rgba(255, 152, 0, 0.1)'
      }
    ]
  };

  velocityChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top'
      },
      title: {
        display: true,
        text: 'Sprint Velocity Trend'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Story Points'
        }
      }
    }
  };

  // Burndown Chart Data
  burndownChartData: ChartData<'line'> = {
    labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7', 'Day 8', 'Day 9', 'Day 10'],
    datasets: [
      {
        data: [100, 95, 88, 82, 75, 68, 58, 45, 30, 0],
        label: 'Ideal Burndown',
        fill: false,
        tension: 0.1,
        borderColor: '#4caf50',
        backgroundColor: 'rgba(76, 175, 80, 0.1)',
        borderDash: [5, 5]
      },
      {
        data: [100, 92, 85, 88, 75, 70, 65, 52, 35, 8],
        label: 'Actual Burndown',
        fill: true,
        tension: 0.3,
        borderColor: '#f44336',
        backgroundColor: 'rgba(244, 67, 54, 0.1)'
      }
    ]
  };

  burndownChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top'
      },
      title: {
        display: true,
        text: 'Sprint Burndown Chart'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Remaining Work (Hours)'
        }
      }
    }
  };

  // Defect Trend Chart
  defectTrendData: ChartData<'bar'> = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
    datasets: [
      {
        data: [12, 8, 15, 6, 9, 4],
        label: 'New Defects',
        backgroundColor: '#f44336'
      },
      {
        data: [10, 12, 13, 8, 11, 7],
        label: 'Resolved Defects',
        backgroundColor: '#4caf50'
      }
    ]
  };

  defectTrendOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top'
      },
      title: {
        display: true,
        text: 'Defect Trend Analysis'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Defects'
        }
      }
    }
  };

  // Team Capacity Utilization
  capacityData: ChartData<'doughnut'> = {
    labels: ['Development', 'Testing', 'DevOps', 'Analysis', 'Available'],
    datasets: [
      {
        data: [45, 25, 15, 10, 5],
        backgroundColor: [
          '#1976d2',
          '#ff9800',
          '#4caf50',
          '#9c27b0',
          '#e0e0e0'
        ]
      }
    ]
  };

  capacityOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'right'
      },
      title: {
        display: true,
        text: 'Team Capacity Utilization'
      }
    }
  };

  // SAFe Program Metrics
  programMetrics = {
    pi: {
      number: 'PI 2024.1',
      progress: 75,
      features: { completed: 12, planned: 16 },
      stories: { completed: 89, planned: 120 }
    },
    art: {
      name: 'Customer Experience ART',
      teams: 8,
      velocity: 456,
      predictability: 92
    },
    objectives: [
      { name: 'Improve Customer Onboarding', progress: 85, confidence: 'High' },
      { name: 'Enhance Mobile Experience', progress: 70, confidence: 'Medium' },
      { name: 'Modernize Payment System', progress: 45, confidence: 'High' },
      { name: 'Implement AI Recommendations', progress: 25, confidence: 'Low' }
    ]
  };

  // Risk and Impediment Tracking
  risks = [
    { type: 'Technical', count: 3, severity: 'High' },
    { type: 'Resource', count: 2, severity: 'Medium' },
    { type: 'Dependency', count: 5, severity: 'High' },
    { type: 'Compliance', count: 1, severity: 'Low' }
  ];

  // Flow Efficiency Metrics
  flowEfficiencyData: ChartData<'line'> = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7', 'Week 8'],
    datasets: [
      {
        data: [65, 72, 68, 75, 82, 78, 85, 88],
        label: 'Flow Efficiency %',
        fill: true,
        tension: 0.4,
        borderColor: '#00bcd4',
        backgroundColor: 'rgba(0, 188, 212, 0.1)'
      },
      {
        data: [70, 70, 70, 70, 70, 70, 70, 70],
        label: 'Target (70%)',
        fill: false,
        borderDash: [5, 5],
        borderColor: '#ff5722',
        backgroundColor: 'transparent'
      }
    ]
  };

  flowEfficiencyOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top'
      },
      title: {
        display: true,
        text: 'Flow Efficiency Trend'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        title: {
          display: true,
          text: 'Efficiency Percentage'
        }
      }
    }
  };

  // Lead Time Distribution
  leadTimeData: ChartData<'bar'> = {
    labels: ['<1 Day', '1-3 Days', '4-7 Days', '1-2 Weeks', '2-4 Weeks', '>4 Weeks'],
    datasets: [
      {
        data: [25, 35, 42, 28, 15, 8],
        label: 'Story Count',
        backgroundColor: [
          '#4caf50',
          '#8bc34a',
          '#ffeb3b',
          '#ff9800',
          '#ff5722',
          '#f44336'
        ]
      }
    ]
  };

  leadTimeOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: 'Lead Time Distribution'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Stories'
        }
      }
    }
  };

  // Value Stream Metrics
  valueStreamMetrics = {
    cycleTime: {
      average: 4.2,
      p50: 3.1,
      p85: 8.5,
      p95: 12.3,
      trend: 'improving'
    },
    throughput: {
      daily: 12.5,
      weekly: 87,
      monthly: 348,
      trend: 'stable'
    },
    workInProgress: {
      current: 45,
      limit: 50,
      utilization: 90
    }
  };

  // Team Health Metrics
  teamHealthData: ChartData<'radar'> = {
    labels: [
      'Velocity Consistency',
      'Quality Metrics',
      'Team Morale',
      'Technical Debt',
      'Innovation Time',
      'Customer Satisfaction'
    ],
    datasets: [
      {
        data: [85, 92, 78, 65, 72, 88],
        label: 'Current Quarter',
        fill: true,
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgb(54, 162, 235)',
        pointBackgroundColor: 'rgb(54, 162, 235)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(54, 162, 235)'
      },
      {
        data: [80, 88, 75, 70, 68, 85],
        label: 'Previous Quarter',
        fill: true,
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgb(255, 99, 132)',
        pointBackgroundColor: 'rgb(255, 99, 132)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(255, 99, 132)'
      }
    ]
  };

  teamHealthOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top'
      },
      title: {
        display: true,
        text: 'Team Health Radar'
      }
    },
    scales: {
      r: {
        beginAtZero: true,
        max: 100,
        angleLines: {
          display: true
        },
        grid: {
          display: true
        }
      }
    }
  };

  // SAFe Portfolio Metrics
  portfolioMetrics = {
    strategicThemes: [
      { name: 'Digital Transformation', investment: 45, progress: 68 },
      { name: 'Customer Experience', investment: 30, progress: 82 },
      { name: 'Operational Excellence', investment: 25, progress: 74 }
    ],
    businessValue: {
      delivered: 8.7,
      planned: 12.0,
      percentage: 72.5
    },
    innovation: {
      percentage: 15,
      target: 20,
      trend: 'increasing'
    }
  };

  // Innovation and Exploration Metrics
  innovationData: ChartData<'doughnut'> = {
    labels: ['Feature Development', 'Technical Debt', 'Innovation', 'Maintenance'],
    datasets: [
      {
        data: [60, 20, 15, 5],
        backgroundColor: [
          '#2196f3',
          '#ff9800',
          '#4caf50',
          '#9e9e9e'
        ]
      }
    ]
  };

  innovationOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'right'
      },
      title: {
        display: true,
        text: 'Time Allocation'
      }
    }
  };

  // Epic Progress Tracking
  epicProgressData: ChartData<'bar'> = {
    labels: ['Customer Onboarding', 'Mobile Platform', 'Payment System', 'AI Engine', 'Analytics Platform'],
    datasets: [
      {
        data: [85, 70, 45, 25, 60],
        label: 'Completion %',
        backgroundColor: ['#4caf50', '#8bc34a', '#ff9800', '#f44336', '#2196f3'],
        borderColor: ['#388e3c', '#689f38', '#f57c00', '#d32f2f', '#1976d2'],
        borderWidth: 2
      }
    ]
  };

  epicProgressOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y' as const,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: 'Epic Progress Status'
      }
    },
    scales: {
      x: {
        beginAtZero: true,
        max: 100,
        title: {
          display: true,
          text: 'Completion Percentage'
        }
      }
    }
  };

  // Feature Completion Velocity
  featureVelocityData: ChartData<'line'> = {
    labels: ['PI 2023.4', 'PI 2024.1', 'PI 2024.2', 'PI 2024.3', 'PI 2024.4 (Planned)'],
    datasets: [
      {
        data: [18, 22, 19, 25, 28],
        label: 'Features Completed',
        fill: true,
        tension: 0.4,
        borderColor: '#673ab7',
        backgroundColor: 'rgba(103, 58, 183, 0.1)',
        pointBackgroundColor: '#673ab7',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 6
      },
      {
        data: [20, 24, 22, 26, 30],
        label: 'Planned Features',
        fill: false,
        tension: 0.4,
        borderColor: '#ff5722',
        backgroundColor: 'transparent',
        borderDash: [5, 5],
        pointBackgroundColor: '#ff5722',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4
      }
    ]
  };

  featureVelocityOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top'
      },
      title: {
        display: true,
        text: 'Feature Completion Velocity by PI'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Features'
        }
      }
    }
  };

  // Dependency Management Metrics
  dependencyMetrics = {
    totalDependencies: 47,
    resolvedDependencies: 32,
    blockedItems: 8,
    criticalPath: ['Feature A', 'Integration B', 'Testing C'],
    dependencyTypes: [
      { type: 'Team-to-Team', count: 15, status: 'On Track' },
      { type: 'External Vendor', count: 8, status: 'At Risk' },
      { type: 'Infrastructure', count: 12, status: 'On Track' },
      { type: 'Compliance', count: 5, status: 'Blocked' },
      { type: 'Technical Integration', count: 7, status: 'On Track' }
    ]
  };

  // Release Train Health Score
  releaseTrainHealth = {
    overallScore: 87,
    categories: {
      teamAlignment: 92,
      technicalHealth: 85,
      deliveryPredictability: 88,
      qualityMetrics: 84,
      teamMorale: 90,
      customerSatisfaction: 86
    },
    trends: {
      teamAlignment: 'improving',
      technicalHealth: 'stable',
      deliveryPredictability: 'improving',
      qualityMetrics: 'improving',
      teamMorale: 'stable',
      customerSatisfaction: 'improving'
    }
  };

  // Customer Satisfaction Metrics
  customerSatisfactionData: ChartData<'line'> = {
    labels: ['Q1 2024', 'Q2 2024', 'Q3 2024', 'Q4 2024 (Current)'],
    datasets: [
      {
        data: [7.2, 7.8, 8.1, 8.4],
        label: 'NPS Score',
        fill: true,
        tension: 0.4,
        borderColor: '#00bcd4',
        backgroundColor: 'rgba(0, 188, 212, 0.1)',
        pointBackgroundColor: '#00bcd4',
        pointBorderColor: '#fff',
        pointBorderWidth: 3,
        pointRadius: 6
      },
      {
        data: [4.1, 4.3, 4.5, 4.6],
        label: 'CSAT (1-5 scale)',
        fill: true,
        tension: 0.4,
        borderColor: '#4caf50',
        backgroundColor: 'rgba(76, 175, 80, 0.1)',
        pointBackgroundColor: '#4caf50',
        pointBorderColor: '#fff',
        pointBorderWidth: 3,
        pointRadius: 6,
        yAxisID: 'y1'
      }
    ]
  };

  customerSatisfactionOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top'
      },
      title: {
        display: true,
        text: 'Customer Satisfaction Trends'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 10,
        title: {
          display: true,
          text: 'NPS Score'
        },
        position: 'left'
      },
      y1: {
        beginAtZero: true,
        max: 5,
        title: {
          display: true,
          text: 'CSAT Score'
        },
        position: 'right',
        grid: {
          drawOnChartArea: false
        }
      }
    }
  };

  // Technical Debt Tracking
  technicalDebtData: ChartData<'doughnut'> = {
    labels: ['Code Quality Issues', 'Security Vulnerabilities', 'Performance Issues', 'Documentation Gaps', 'Test Coverage'],
    datasets: [
      {
        data: [35, 15, 20, 18, 12],
        backgroundColor: [
          '#f44336',
          '#ff9800',
          '#ff5722',
          '#795548',
          '#607d8b'
        ],
        borderWidth: 2,
        borderColor: '#fff'
      }
    ]
  };

  technicalDebtOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom'
      },
      title: {
        display: true,
        text: 'Technical Debt Distribution'
      }
    }
  };

  // Resource Allocation Matrix
  resourceAllocation = {
    teams: [
      {
        name: 'Frontend Team',
        members: 6,
        allocation: {
          newFeatures: 60,
          maintenance: 20,
          technicalDebt: 15,
          support: 5
        },
        utilization: 95
      },
      {
        name: 'Backend Team',
        members: 8,
        allocation: {
          newFeatures: 55,
          maintenance: 25,
          technicalDebt: 15,
          support: 5
        },
        utilization: 88
      },
      {
        name: 'DevOps Team',
        members: 4,
        allocation: {
          newFeatures: 30,
          maintenance: 40,
          technicalDebt: 20,
          support: 10
        },
        utilization: 92
      },
      {
        name: 'QA Team',
        members: 5,
        allocation: {
          newFeatures: 70,
          maintenance: 15,
          technicalDebt: 10,
          support: 5
        },
        utilization: 90
      }
    ]
  };

  // Advanced SAFe Metrics
  advancedSafeMetrics = {
    programIncrement: {
      planningEfficiency: 92,
      commitmentReliability: 87,
      scopeChange: 12, // percentage
      teamSyncLevel: 95
    },
    artAlignment: {
      sharedServices: 85,
      architecturalRunway: 78,
      systemDemo: 90,
      inspectAndAdapt: 88
    },
    businessValue: {
      valueStreamFlow: 82,
      customerImpact: 89,
      marketResponsiveness: 75,
      innovationRate: 68
    }
  };

  constructor(
    private uptimeService: UptimeService,
    private reportsService: ReportsService
  ) {
    // Initialize server monitoring streams (legacy support)
    this.uptimeData$ = this.uptimeService.getUptimeStream();
    this.timeData$ = this.uptimeService.getTimeStream();
    
    // Combine server metrics
    this.serverMetrics$ = combineLatest([
      this.uptimeData$,
      this.timeData$
    ]).pipe(
      map(([uptime, time]) => ({
        uptime: uptime.uptime,
        currentTime: time.time,
        status: uptime.uptime > 0 ? 'healthy' : 'down'
      }))
    );
  }

  ngOnInit(): void {
    // Subscribe to new reports service for real-time data
    this.reportsService.getReportsData().subscribe(reportsData => {
      if (reportsData) {
        // Update charts with new data from backend
        this.updateChartsFromReportsData(reportsData);
        
        // Update system health
        this.systemHealth = {
          ...reportsData.systemHealth,
          lastServerUpdate: new Date(reportsData.systemHealth.lastServerUpdate)
        };
      }
    });

    // Legacy server metrics subscription (for backward compatibility)
    if (this.serverMetrics$) {
      this.serverMetrics$.subscribe((metrics: any) => {
        if (this.systemHealth) {
          this.systemHealth.serverUptime = metrics.uptime;
          this.systemHealth.serverStatus = metrics.status;
          this.systemHealth.lastServerUpdate = new Date(metrics.currentTime);
        }
      });
    }
  }

  chartType: ChartType = 'line';

  // Chart event handlers
  public chartClicked({ event, active }: { event?: ChartEvent, active?: {}[] }): void {
    console.log(event, active);
  }

  public chartHovered({ event, active }: { event?: ChartEvent, active?: {}[] }): void {
    console.log(event, active);
  }

  getConfidenceColor(confidence: string): string {
    switch (confidence) {
      case 'High': return '#4caf50';
      case 'Medium': return '#ff9800';
      case 'Low': return '#f44336';
      default: return '#9e9e9e';
    }
  }

  getSeverityColor(severity: string): string {
    switch (severity) {
      case 'High': return '#f44336';
      case 'Medium': return '#ff9800';
      case 'Low': return '#4caf50';
      default: return '#9e9e9e';
    }
  }

  getHealthScoreColor(score: number): string {
    if (score >= 90) return '#4caf50';
    if (score >= 80) return '#8bc34a';
    if (score >= 70) return '#ff9800';
    if (score >= 60) return '#ff5722';
    return '#f44336';
  }

  getTrendIcon(trend: string): string {
    switch (trend) {
      case 'improving': return 'trending_up';
      case 'declining': return 'trending_down';
      case 'stable': return 'trending_flat';
      default: return 'help_outline';
    }
  }

  getTrendColor(trend: string): string {
    switch (trend) {
      case 'improving': return '#4caf50';
      case 'declining': return '#f44336';
      case 'stable': return '#2196f3';
      default: return '#9e9e9e';
    }
  }

  getDependencyStatusColor(status: string): string {
    switch (status) {
      case 'On Track': return '#4caf50';
      case 'At Risk': return '#ff9800';
      case 'Blocked': return '#f44336';
      default: return '#9e9e9e';
    }
  }

  getUtilizationColor(utilization: number): string {
    if (utilization >= 95) return '#f44336'; // Over-utilized
    if (utilization >= 85) return '#ff9800'; // High utilization
    if (utilization >= 70) return '#4caf50'; // Optimal
    return '#2196f3'; // Under-utilized
  }

  getHealthCategoryTrend(categoryKey: string): string {
    return this.releaseTrainHealth.trends[categoryKey as keyof typeof this.releaseTrainHealth.trends];
  }

  getHealthCategoryTrendColor(categoryKey: string): string {
    const trend = this.getHealthCategoryTrend(categoryKey);
    return this.getTrendColor(trend);
  }

  getHealthCategoryTrendIcon(categoryKey: string): string {
    const trend = this.getHealthCategoryTrend(categoryKey);
    return this.getTrendIcon(trend);
  }

  calculateOverallProgress(): number {
    const epicProgress = this.epicProgressData.datasets[0].data as number[];
    return Math.round(epicProgress.reduce((acc, val) => acc + val, 0) / epicProgress.length);
  }

  getCompletionRate(): number {
    return Math.round((this.dependencyMetrics.resolvedDependencies / this.dependencyMetrics.totalDependencies) * 100);
  }

  // Update charts with data from reports service
  updateChartsFromReportsData(reportsData: ReportsData): void {
    if (reportsData.chartConfigurations) {
      // Update server uptime chart
      if (reportsData.chartConfigurations.serverUptime) {
        this.serverUptimeChartData = {
          ...this.serverUptimeChartData,
          ...reportsData.chartConfigurations.serverUptime
        };
      }

      // Update memory usage chart
      if (reportsData.chartConfigurations.memoryUsage) {
        this.memoryUsageChartData = {
          ...this.memoryUsageChartData,
          ...reportsData.chartConfigurations.memoryUsage
        };
      }

      // Update CPU usage chart
      if (reportsData.chartConfigurations.cpuUsage) {
        this.cpuUsageChartData = {
          ...this.cpuUsageChartData,
          ...reportsData.chartConfigurations.cpuUsage
        };
      }

      // Update network traffic chart
      if (reportsData.chartConfigurations.networkTraffic) {
        this.networkTrafficChartData = {
          ...this.networkTrafficChartData,
          ...reportsData.chartConfigurations.networkTraffic
        };
      }

      // Update velocity chart
      if (reportsData.chartConfigurations.velocity) {
        this.velocityChartData = {
          ...this.velocityChartData,
          ...reportsData.chartConfigurations.velocity
        };
      }

      // Update burndown chart
      if (reportsData.chartConfigurations.burndown) {
        this.burndownChartData = {
          ...this.burndownChartData,
          ...reportsData.chartConfigurations.burndown
        };
      }

      // Trigger chart update
      if (this.chart) {
        this.chart.update();
      }
    }
  }

  // Helper methods from reports service
  getServerStatusColor(status: string): string {
    return this.reportsService.getStatusColor(status);
  }

  getServerStatusIcon(status: string): string {
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
}
