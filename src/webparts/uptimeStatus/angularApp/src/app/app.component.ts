import { Component, OnInit } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Agile SAFe Project Manager';
  notificationCount = 3;
  selectedTabIndex = 0;

  ngOnInit(): void {
    // Initialize component
    console.log('Agile SAFe Project Manager initialized');
  }

  onTabChange(event: MatTabChangeEvent): void {
    this.selectedTabIndex = event.index;
    console.log('Tab changed to:', event.index);
  }
}
