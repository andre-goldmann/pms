import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { startWith, map } from 'rxjs/operators';
import { Router } from '@angular/router';

import { GeneralDetailsStepComponent } from './steps/general-details-step/general-details-step.component';
import { LocationDetailsStepComponent } from './steps/location-details-step/location-details-step.component';
import { CompanyDetailsStepComponent } from './steps/company-details-step/company-details-step.component';
import { ConfirmationStepComponent } from './steps/confirmation-step/confirmation-step.component';
import { PropertyService } from '../../services/property.service'; // Import the new service

@Component({
  selector: 'app-property-wizard',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    GeneralDetailsStepComponent,
    LocationDetailsStepComponent,
    CompanyDetailsStepComponent,
    ConfirmationStepComponent,
  ],
  templateUrl: './property-wizard.component.html',
  styleUrl: './property-wizard.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PropertyWizardComponent {
  private fb = inject(FormBuilder);
  private propertyService = inject(PropertyService); // Inject PropertyService
  private router = inject(Router); // Inject Router

  currentStep = signal(1);
  totalSteps = 4; // General, Location, Company, Confirmation

  propertyForm: FormGroup;

  // Reactive signals for step validity
  readonly isGeneralStepValid: ReturnType<typeof toSignal<boolean>>;
  readonly isLocationStepValid: ReturnType<typeof toSignal<boolean>>;
  readonly isCompanyStepValid: ReturnType<typeof toSignal<boolean>>;

  constructor() {
    this.propertyForm = this.fb.group({
      general: this.fb.group({
        propertyCode: ['', Validators.required],
        propertyName: ['', Validators.required],
      }),
      location: this.fb.group({
        addressLine: ['', Validators.required],
        postalCode: ['', Validators.required],
        city: ['', Validators.required],
        country: ['', Validators.required],
        timezone: ['', Validators.required],
        currencyCode: ['', Validators.required],
        checkInTime: ['15:00', Validators.required],
        checkOutTime: ['11:00', Validators.required],
      }),
      company: this.fb.group({
        companyName: ['', Validators.required],
        commercialRegisterEntry: [''],
        taxId: [''],
        paymentTerms: [''],
        bankDetails: [''],
      }),
    });

    this.isGeneralStepValid = toSignal(
      (this.propertyForm.get('general') as FormGroup).statusChanges.pipe(
        startWith(this.propertyForm.get('general')!.status),
        map(status => status === 'VALID')
      ),
      { initialValue: this.propertyForm.get('general')!.valid }
    );

    this.isLocationStepValid = toSignal(
      (this.propertyForm.get('location') as FormGroup).statusChanges.pipe(
        startWith(this.propertyForm.get('location')!.status),
        map(status => status === 'VALID')
      ),
      { initialValue: this.propertyForm.get('location')!.valid }
    );

    this.isCompanyStepValid = toSignal(
      (this.propertyForm.get('company') as FormGroup).statusChanges.pipe(
        startWith(this.propertyForm.get('company')!.status),
        map(status => status === 'VALID')
      ),
      { initialValue: this.propertyForm.get('company')!.valid }
    );
  }

  nextStep(): void {
    if (this.currentStep() < this.totalSteps) {
      const currentStepFormGroup = this.getCurrentStepFormGroup();
      if (currentStepFormGroup && currentStepFormGroup.valid) {
        this.currentStep.update(step => step + 1);
      } else {
        currentStepFormGroup?.markAllAsTouched(); // Show validation errors
      }
    }
  }

  prevStep(): void {
    if (this.currentStep() > 1) {
      this.currentStep.update(step => step - 1);
    }
  }

  getCurrentStepFormGroup(): FormGroup | null {
    switch (this.currentStep()) {
      case 1: return this.propertyForm.get('general') as FormGroup;
      case 2: return this.propertyForm.get('location') as FormGroup;
      case 3: return this.propertyForm.get('company') as FormGroup;
      default: return null;
    }
  }

  submitForm(): void {
    if (this.propertyForm.valid) {
      if (this.currentStep() === this.totalSteps) {
        // Only save and navigate if on the final confirmation step
        console.log('Property created successfully!', this.propertyForm.value);
        this.propertyService.addProperty(this.propertyForm.value); // Add to service
        this.router.navigate(['/properties']); // Navigate to overview
        this.resetWizard(); // Reset form after successful creation
      } else {
        // If not on the last step, proceed to next step
        this.nextStep();
      }
    } else {
      console.error('Form is invalid', this.propertyForm);
      alert('Please correct the errors in the form.');
      this.propertyForm.markAllAsTouched(); // Mark all controls as touched to show errors
    }
  }

  resetWizard(): void {
    this.currentStep.set(1); // Reset to the first step
    this.propertyForm.reset({
      general: { propertyCode: '', propertyName: '' },
      location: { addressLine: '', postalCode: '', city: '', country: '', timezone: '', currencyCode: '', checkInTime: '15:00', checkOutTime: '11:00' },
      company: { companyName: '', commercialRegisterEntry: '', taxId: '', paymentTerms: '', bankDetails: '' },
    });
    // Mark all controls as untouched and pristine after reset
    this.propertyForm.markAsPristine();
    this.propertyForm.markAsUntouched();

    Object.values(this.propertyForm.controls).forEach((control: AbstractControl) => {
      control.markAsPristine();
      control.markAsUntouched();
      if (control instanceof FormGroup) {
        Object.values(control.controls).forEach((subControl: AbstractControl) => {
          subControl.markAsPristine();
          subControl.markAsUntouched();
        });
      }
    });
  }
}