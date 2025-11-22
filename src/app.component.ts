import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { NgOptimizedImage } from '@angular/common'; // Import NgOptimizedImage
import { ContextSelectorComponent } from './components/context-selector/context-selector.component';
import { PropertyService } from './services/property.service'; // Inject PropertyService
import { ChatComponent } from './components/chat/chat.component'; // Import ChatComponent

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, NgOptimizedImage, ContextSelectorComponent, ChatComponent], // Add NgOptimizedImage, RouterLinkActive and ChatComponent here
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  protected propertyService = inject(PropertyService); // Inject PropertyService

  isAppsExpanded = signal(false); // State for collapsible 'Apps' section

  toggleApps(): void {
    this.isAppsExpanded.update(value => !value);
  }
}