
import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-general-details-step',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './general-details-step.component.html',
  styleUrl: './general-details-step.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GeneralDetailsStepComponent {
  formGroup = input.required<FormGroup>();
}
    