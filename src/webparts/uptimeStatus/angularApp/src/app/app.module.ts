import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AdminModule } from './admin/admin.module';
import { AdminComponent } from './admin/admin.component';
import { ManageTeamsComponent } from './admin/manage-teams/manage-teams.component';
import { PiConfigurationComponent } from './admin/pi-configuration/pi-configuration.component';
import { IntegrationsComponent } from './admin/integrations/integrations.component';
import { SecurityPermissionComponent } from './admin/security-permission/security-permission.component';

// Angular Material imports
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';

// Chart.js
import { NgChartsModule } from 'ng2-charts';

import { AppComponent } from './app.component';
import { TeamsMessagesComponent } from './teams-messages/teams-messages.component';
import { MetricsComponent } from './metrics/metrics.component';
import { HomeComponent } from './home/home.component';
import { ReportsComponent } from './reports/reports.component';
import { UptimeService } from './uptime.service';

// Lists Module
import { ListsModule } from './lists/lists.module';

// Define main app routes
import { ListsOverviewComponent } from './lists/components/lists-overview.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'metrics', component: MetricsComponent },
  { path: 'reports', component: ReportsComponent },
  { path: 'teams-messages', component: TeamsMessagesComponent },
  { path: 'lists', component: ListsOverviewComponent },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  declarations: [
    AppComponent,
    TeamsMessagesComponent,
    MetricsComponent,
    HomeComponent,
    ReportsComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgChartsModule,
    
    // Material Modules
    MatCardModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatDividerModule,
    MatChipsModule,
    MatBadgeModule,
    MatTooltipModule,
    MatDialogModule,
    MatTabsModule,
    MatGridListModule,
    MatProgressBarModule,
    MatListModule,
    MatExpansionModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    
  // Feature Modules
  ListsModule,
  // Remove direct AdminModule import, use lazy loading
  RouterModule.forRoot(routes)
  ],
  providers: [
    UptimeService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
