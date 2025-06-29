import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription, combineLatest, of } from 'rxjs';
import { delay } from 'rxjs/operators';

// Mock interfaces (will replace with real TeamsService later)
export interface TeamsMessage {
  id: string;
  createdDateTime: string;
  body: {
    content: string;
    contentType: string;
  };
  from: {
    user: {
      displayName: string;
      id: string;
    };
  };
  importance: string;
  messageType: string;
}

@Component({
  selector: 'app-teams-messages',
  template: `
    <mat-card class="teams-card" appearance="outlined">
      <mat-card-header>
        <div mat-card-avatar class="teams-avatar">
          <mat-icon class="avatar-icon">forum</mat-icon>
        </div>
        <mat-card-title>Teams Messages</mat-card-title>
        <mat-card-subtitle>Recent activity from monitored channels</mat-card-subtitle>
      </mat-card-header>
      
      <mat-card-content>
        <div *ngIf="isLoading" class="loading-messages">
          <mat-spinner diameter="30"></mat-spinner>
          <span>Loading Teams messages...</span>
        </div>

        <div *ngIf="!isLoading && messages.length === 0" class="no-messages">
          <mat-icon>chat_bubble_outline</mat-icon>
          <p>No recent messages found</p>
        </div>

        <div class="messages-container" *ngIf="!isLoading && messages.length > 0">
          <div class="message-item" *ngFor="let message of messages; trackBy: trackByMessageId">
            <div class="message-header">
              <div class="message-author">
                <mat-icon class="author-icon">person</mat-icon>
                <span class="author-name">{{ message.from.user.displayName }}</span>
              </div>
              <div class="message-time">
                <mat-icon class="time-icon">schedule</mat-icon>
                <span>{{ formatMessageTime(message.createdDateTime) }}</span>
              </div>
            </div>
            
            <div class="message-content" [innerHTML]="sanitizeMessageContent(message.body.content)">
            </div>
            
            <div class="message-actions">
              <button mat-icon-button 
                      matTooltip="View in Teams"
                      (click)="openInTeams(message)">
                <mat-icon>open_in_new</mat-icon>
              </button>
            </div>
          </div>
        </div>
      </mat-card-content>

      <mat-card-actions>
        <button mat-button 
                color="primary"
                (click)="refreshMessages()"
                [disabled]="isLoading">
          <mat-icon>refresh</mat-icon>
          Refresh Messages
        </button>
        
        <button mat-button 
                color="accent"
                (click)="configureChannels()">
          <mat-icon>settings</mat-icon>
          Configure Channels
        </button>
      </mat-card-actions>
    </mat-card>
  `,
  styleUrls: ['./teams-messages.component.scss']
})
export class TeamsMessagesComponent implements OnInit, OnDestroy {
  messages: TeamsMessage[] = [];
  isLoading = true;
  private subscriptions = new Subscription();

  constructor() {}

  ngOnInit(): void {
    this.loadMockMessages();
    
    // Auto-refresh every 30 seconds
    const refreshSub = setInterval(() => {
      this.loadMockMessages();
    }, 30000);
    
    this.subscriptions.add(() => clearInterval(refreshSub));
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  // Mock data for demonstration
  loadMockMessages(): void {
    this.isLoading = true;
    
    // Simulate API delay
    setTimeout(() => {
      this.messages = [
        {
          id: '1',
          createdDateTime: new Date(Date.now() - 300000).toISOString(), // 5 minutes ago
          body: {
            content: 'Server maintenance completed successfully. All systems are back online.',
            contentType: 'text'
          },
          from: {
            user: {
              displayName: 'John Smith',
              id: 'user1'
            }
          },
          importance: 'high',
          messageType: 'message'
        },
        {
          id: '2',
          createdDateTime: new Date(Date.now() - 900000).toISOString(), // 15 minutes ago
          body: {
            content: 'Monitoring dashboard looks great! 👍 The uptime metrics are very helpful.',
            contentType: 'text'
          },
          from: {
            user: {
              displayName: 'Sarah Johnson',
              id: 'user2'
            }
          },
          importance: 'normal',
          messageType: 'message'
        },
        {
          id: '3',
          createdDateTime: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
          body: {
            content: 'Alert: CPU usage spike detected on production server. Investigating...',
            contentType: 'text'
          },
          from: {
            user: {
              displayName: 'DevOps Bot',
              id: 'bot1'
            }
          },
          importance: 'urgent',
          messageType: 'message'
        },
        {
          id: '4',
          createdDateTime: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
          body: {
            content: 'Daily backup completed successfully. All data secured.',
            contentType: 'text'
          },
          from: {
            user: {
              displayName: 'Backup Service',
              id: 'service1'
            }
          },
          importance: 'normal',
          messageType: 'message'
        }
      ];
      
      this.isLoading = false;
    }, 1500); // 1.5 second delay to show loading
  }

  refreshMessages(): void {
    this.loadMockMessages();
  }

  configureChannels(): void {
    // Open dialog to configure which channels to monitor
    console.log('Configure channels dialog would open here');
    alert('Channel configuration coming soon! This will let you choose which Teams channels to monitor.');
  }

  trackByMessageId(index: number, message: TeamsMessage): string {
    return message.id;
  }

  formatMessageTime(dateTime: string): string {
    const date = new Date(dateTime);
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}h ago`;
    return date.toLocaleDateString();
  }

  sanitizeMessageContent(content: string): string {
    // Basic HTML sanitization - in production, use DOMPurify
    return content
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .substring(0, 200) + (content.length > 200 ? '...' : '');
  }

  openInTeams(message: TeamsMessage): void {
    // Mock action - would open message in Teams client
    console.log('Would open in Teams:', message);
    alert(`Would open message from ${message.from.user.displayName} in Teams app`);
  }
}
