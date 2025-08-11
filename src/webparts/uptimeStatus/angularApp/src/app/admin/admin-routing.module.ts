import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { ManageTeamsComponent } from './manage-teams/manage-teams.component';
import { PiConfigurationComponent } from './pi-configuration/pi-configuration.component';
import { IntegrationsComponent } from './integrations/integrations.component';
import { SecurityPermissionComponent } from './security-permission/security-permission.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      { path: '', redirectTo: 'manage-teams', pathMatch: 'full' },
      { path: 'manage-teams', component: ManageTeamsComponent },
      { path: 'pi-configuration', component: PiConfigurationComponent },
      { path: 'integrations', component: IntegrationsComponent },
      { path: 'security-permission', component: SecurityPermissionComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {}
