import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

import { AdminComponent } from './admin.component';
import { ManageTeamsComponent } from './manage-teams/manage-teams.component';
import { PiConfigurationComponent } from './pi-configuration/pi-configuration.component';
import { IntegrationsComponent } from './integrations/integrations.component';
import { SecurityPermissionComponent } from './security-permission/security-permission.component';
import { AdminRoutingModule } from './admin-routing.module';

@NgModule({
  declarations: [
    AdminComponent,
    ManageTeamsComponent,
    PiConfigurationComponent,
    IntegrationsComponent,
    SecurityPermissionComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatListModule,
    MatIconModule,
    MatDividerModule,
    AdminRoutingModule
  ],
  exports: [AdminComponent]
})
export class AdminModule {}
