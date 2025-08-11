import { Component, OnInit } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Agile SAFe Project Manager';
  notificationCount = 3;
  selectedTabIndex = 0;

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Initialize component
    console.log('Agile SAFe Project Manager initialized');
  }

  onTabChange(event: MatTabChangeEvent): void {
    this.selectedTabIndex = event.index;
    console.log('Tab changed to:', event.index);
    // Tab index to route mapping
    const tabRoutes = [
      '/',
      '/metrics',
      '/teams-messages',
      '/reports',
      '/lists',
      '/admin'
    ];
    this.router.navigate([tabRoutes[event.index]]);
  }
}
