
import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-company-details-step',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './company-details-step.component.html',
  styleUrl: './company-details-step.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompanyDetailsStepComponent {
  formGroup = input.required<FormGroup>();
}
    