import { Component, ChangeDetectionStrategy, signal, inject, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { PropertyService, ContextItem } from '../../services/property.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-context-selector',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './context-selector.component.html',
  styleUrl: './context-selector.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContextSelectorComponent {
  protected propertyService = inject(PropertyService);
  private router = inject(Router);

  isDropdownOpen = signal(false);
  searchTerm = new FormControl('');

  filteredContextItems = computed<ContextItem[]>(() => {
    const term = this.searchTerm.value?.toLowerCase().trim();
    if (!term) {
      return this.propertyService.contextItems();
    }
    return this.propertyService.contextItems().filter(item =>
      item.name.toLowerCase().includes(term) ||
      (item.subtext && item.subtext.toLowerCase().includes(term))
    );
  });

  constructor() {
    // Close dropdown if navigation occurs
    effect(() => {
      this.router.events.subscribe(() => {
        this.isDropdownOpen.set(false);
      });
    });
  }

  toggleDropdown(): void {
    this.isDropdownOpen.update(value => !value);
    if (!this.isDropdownOpen()) {
      this.searchTerm.setValue(''); // Clear search when closing
    }
  }

  selectContext(item: ContextItem): void {
    this.propertyService.setSelectedContext(item.id);
    this.isDropdownOpen.set(false);
    this.searchTerm.setValue('');

    // Navigate to properties overview if a property is selected, or dashboard for account
    if (item.type === 'property') {
      this.router.navigate(['/property-detail']); // Or perhaps /properties and then detail logic. Let's stick to detail for direct edit.
    } else {
      // For 'account' context, we can navigate to a dashboard or default page
      this.router.navigate(['/properties']); // Default to properties overview for account context
    }
  }

  // Handle outside clicks to close the dropdown (can be done with host listener or directive)
  // For simplicity, we'll rely on global click handling for now or a directive later if needed
}