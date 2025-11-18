
import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirmation-step',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirmation-step.component.html',
  styleUrl: './confirmation-step.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmationStepComponent {
  formData = input.required<any>(); // Input for the complete form data
}
    