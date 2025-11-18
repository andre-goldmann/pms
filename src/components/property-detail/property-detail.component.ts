import { Component, ChangeDetectionStrategy, input, output, inject, OnInit, effect } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PropertyService } from '../../services/property.service';

@Component({
  selector: 'app-property-detail',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './property-detail.component.html',
  styleUrl: './property-detail.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PropertyDetailComponent {
  private fb = inject(FormBuilder);
  private propertyService = inject(PropertyService);
  private router = inject(Router);

  // propertyData is now derived from the service
  propertyData = this.propertyService.selectedProperty;
  editForm!: FormGroup;

  // Simple hardcoded options for demonstration (mirroring location-details-step)
  countries = ['Germany', 'USA', 'UK', 'France', 'Spain'];
  timezones = ['Europe/Berlin', 'America/New_York', 'Europe/London'];
  currencyCodes = ['EUR', 'USD', 'GBP'];

  constructor() {
    // Effect to re-initialize the form if the selected property changes
    effect(() => {
      const data = this.propertyData();
      if (data) {
        this.initializeForm(data);
      } else {
        // If no property is selected (e.g., direct navigation or deleted), redirect to overview
        this.router.navigate(['/properties']);
      }
    });
  }

  private initializeForm(data: any): void {
    this.editForm = this.fb.group({
      general: this.fb.group({
        propertyCode: [{ value: data.general.propertyCode, disabled: true }], // Property Code should not be editable
        propertyName: [data.general.propertyName, Validators.required],
      }),
      location: this.fb.group({
        addressLine: [data.location.addressLine, Validators.required],
        postalCode: [data.location.postalCode, Validators.required],
        city: [data.location.city, Validators.required],
        country: [data.location.country, Validators.required],
        timezone: [data.location.timezone, Validators.required],
        currencyCode: [data.location.currencyCode, Validators.required],
        checkInTime: [data.location.checkInTime, Validators.required],
        checkOutTime: [data.location.checkOutTime, Validators.required],
      }),
      company: this.fb.group({
        companyName: [data.company.companyName, Validators.required],
        commercialRegisterEntry: [data.company.commercialRegisterEntry],
        taxId: [data.company.taxId],
        paymentTerms: [data.company.paymentTerms],
        bankDetails: [data.company.bankDetails],
      }),
    });
  }

  onSaveChanges(): void {
    if (this.editForm.valid && this.propertyData()) {
      // Get the ID from the currently selected property
      const propertyId = this.propertyData()!.id;
      // Get the form values, merge with disabled controls if necessary
      const formValue = this.editForm.getRawValue(); // getRawValue includes disabled fields
      const updatedProperty = {
        ...this.propertyData(), // Keep existing data not in form, like ID
        general: { ...formValue.general },
        location: { ...formValue.location },
        company: { ...formValue.company },
      };
      this.propertyService.updateProperty(propertyId, updatedProperty);
      alert('Property details updated successfully!');
      this.router.navigate(['/properties']); // Navigate back to overview after saving
    } else {
      console.error('Form is invalid or no property selected', this.editForm.value, this.propertyData());
      alert('Please correct the errors before saving.');
      this.editForm.markAllAsTouched();
    }
  }

  onCreateNewProperty(): void {
    this.propertyService.setSelectedContext('account'); // Clear selection and set context to account
    this.router.navigate(['/create-property']);
  }
}