
import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-location-details-step',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './location-details-step.component.html',
  styleUrl: './location-details-step.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LocationDetailsStepComponent {
  formGroup = input.required<FormGroup>();

  // Simple hardcoded options for demonstration
  countries = ['Germany', 'USA', 'UK', 'France', 'Spain'];
  timezones = ['Europe/Berlin', 'America/New_York', 'Europe/London'];
  currencyCodes = ['EUR', 'USD', 'GBP'];
}
    