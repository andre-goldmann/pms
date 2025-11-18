import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { ContextSelectorComponent } from './components/context-selector/context-selector.component'; // Import the new component

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, ContextSelectorComponent], // Add ContextSelectorComponent here
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  activeMenuItem = signal('Properties'); // Highlight active menu item
}