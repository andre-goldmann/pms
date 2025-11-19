import { Routes } from '@angular/router';
import { PropertyWizardComponent } from './components/property-wizard/property-wizard.component';
import { PropertyOverviewComponent } from './components/property-overview/property-overview.component';
import { PropertyDetailComponent } from './components/property-detail/property-detail.component';

export const routes: Routes = [
  { path: '', redirectTo: 'properties', pathMatch: 'full' }, // Default to the overview
  { path: 'properties', component: PropertyOverviewComponent },
  { path: 'create-property', component: PropertyWizardComponent },
  { path: 'property-detail', component: PropertyDetailComponent }, // Detail route, relies on PropertyService for data

  // Placeholder routes for new navigation items
  { path: 'dashboard', component: PropertyOverviewComponent }, // Placeholder
  { path: 'reservations', component: PropertyOverviewComponent }, // Placeholder
  { path: 'room-rack', component: PropertyOverviewComponent }, // Placeholder
  { path: 'housekeeping', component: PropertyOverviewComponent }, // Placeholder
  { path: 'inventory', component: PropertyOverviewComponent }, // Placeholder
  { path: 'rates', component: PropertyOverviewComponent }, // Placeholder
  { path: 'companies', component: PropertyOverviewComponent }, // Placeholder
  { path: 'finance', component: PropertyOverviewComponent }, // Placeholder
  { path: 'reports', component: PropertyOverviewComponent }, // Placeholder
  { path: 'audit-logs', component: PropertyOverviewComponent }, // Placeholder
  { path: 'google-integration', component: PropertyOverviewComponent }, // Placeholder
  { path: 'youtube', component: PropertyOverviewComponent }, // Placeholder
];