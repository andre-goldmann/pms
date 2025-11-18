import { Routes } from '@angular/router';
import { PropertyWizardComponent } from './components/property-wizard/property-wizard.component';
import { PropertyOverviewComponent } from './components/property-overview/property-overview.component';
import { PropertyDetailComponent } from './components/property-detail/property-detail.component';

export const routes: Routes = [
  { path: '', redirectTo: 'properties', pathMatch: 'full' }, // Default to the overview
  { path: 'properties', component: PropertyOverviewComponent },
  { path: 'create-property', component: PropertyWizardComponent },
  { path: 'property-detail', component: PropertyDetailComponent }, // Detail route, relies on PropertyService for data
  // Add other routes here if necessary
];
