import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { PropertyService } from '../../services/property.service';

@Component({
  selector: 'app-property-overview',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './property-overview.component.html',
  styleUrl: './property-overview.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PropertyOverviewComponent {
  protected propertyService = inject(PropertyService);
  private router = inject(Router);

  viewPropertyDetails(propertyId: string): void {
    this.propertyService.setSelectedPropertyById(propertyId);
    this.router.navigate(['/property-detail']);
  }

  createNewProperty(): void {
    this.propertyService.setSelectedContext('account'); // Ensure no specific property is selected when creating a new one
    this.router.navigate(['/create-property']);
  }
}