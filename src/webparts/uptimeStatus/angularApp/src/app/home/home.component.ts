import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  // Dashboard summary data
  dashboardSummary = {
    currentSprint: {
      number: 'Sprint 15',
      daysRemaining: 3,
      progress: 78,
      burndownStatus: 'On Track'
    },
    teamHealth: {
      velocity: 52,
      capacity: 85,
      satisfaction: 4.2,
      impediments: 2
    },
    deliverables: {
      completed: 23,
      inProgress: 8,
      planned: 35,
      blocked: 1
    },
    recentActivities: [
      {
        type: 'story_completed',
        title: 'User Authentication Enhancement',
        time: '2 hours ago',
        icon: 'check_circle',
        color: '#4caf50'
      },
      {
        type: 'defect_found',
        title: 'Payment Gateway Issue',
        time: '4 hours ago',
        icon: 'bug_report',
        color: '#f44336'
      },
      {
        type: 'feature_deployed',
        title: 'Mobile Dashboard Release',
        time: '1 day ago',
        icon: 'rocket_launch',
        color: '#1976d2'
      },
      {
        type: 'impediment_resolved',
        title: 'Database Performance Fixed',
        time: '2 days ago',
        icon: 'build',
        color: '#ff9800'
      }
    ],
    upcomingEvents: [
      {
        title: 'Sprint Review',
        date: 'Today, 2:00 PM',
        type: 'meeting',
        attendees: 12
      },
      {
        title: 'PI Planning Session',
        date: 'Tomorrow, 9:00 AM',
        type: 'planning',
        attendees: 45
      },
      {
        title: 'Retrospective',
        date: 'Friday, 3:00 PM',
        type: 'retrospective',
        attendees: 8
      }
    ]
  };

  quickActions = [
    { title: 'Create User Story', icon: 'add_task', color: '#1976d2' },
    { title: 'Log Impediment', icon: 'report_problem', color: '#f44336' },
    { title: 'Update Capacity', icon: 'people', color: '#4caf50' },
    { title: 'Generate Report', icon: 'assessment', color: '#ff9800' }
  ];

  currentDate: string = '';
  currentTime: string = '';
  private timeIntervalId: any;

  constructor() { }

  ngOnInit(): void {
    // Initialize component
    this.updateCurrentDateTime();
    this.timeIntervalId = setInterval(() => {
      this.updateCurrentDateTime();
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.timeIntervalId) {
      clearInterval(this.timeIntervalId);
    }
  }

  private updateCurrentDateTime(): void {
    const now = new Date();
    this.currentDate = now.toLocaleDateString();
    this.currentTime = now.toLocaleTimeString();
  }

  getBurndownStatusColor(status: string): string {
    switch (status) {
      case 'On Track':
        return '#4caf50';
      case 'At Risk':
        return '#ff9800';
      case 'Off Track':
        return '#f44336';
      default:
        return '#757575';
    }
  }

  getHealthColor(metric: string, value: number): string {
    switch (metric) {
      case 'velocity':
        return value >= 50 ? '#4caf50' : value >= 30 ? '#ff9800' : '#f44336';
      case 'capacity':
        return value >= 80 ? '#4caf50' : value >= 60 ? '#ff9800' : '#f44336';
      case 'satisfaction':
        return value >= 4 ? '#4caf50' : value >= 3 ? '#ff9800' : '#f44336';
      default:
        return '#757575';
    }
  }

  onQuickAction(action: any): void {
    console.log('Quick action clicked:', action);
    // Handle navigation or action based on action.type
  }
}
