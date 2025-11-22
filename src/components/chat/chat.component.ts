import { Component, ChangeDetectionStrategy, signal, inject, effect, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { GeminiService } from '../../services/gemini.service';
import { Router } from '@angular/router';

interface ChatMessage {
  text: string;
  sender: 'user' | 'ai';
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatComponent {
  @ViewChild('messageContainer') private messageContainer!: ElementRef;

  private geminiService = inject(GeminiService);
  private router = inject(Router);

  isOpen = signal(false);
  isLoading = signal(false);
  messages = signal<ChatMessage[]>([]);
  userMessage = new FormControl('');

  constructor() {
    effect(() => {
      // Scroll to bottom when messages change and chat is open
      if (this.isOpen() && this.messages().length > 0) {
        this.scrollChatToBottom();
      }
    });

    // Add initial welcome message if no messages exist when chat is opened
    effect(() => {
      if (this.isOpen() && this.messages().length === 0) {
        this.messages.set([
          { sender: 'ai', text: 'Hello! I am your apaleo assistant. How can I help you today?' }
        ]);
      }
    });

    // Reset chat and close dropdown on navigation
    effect(() => {
      this.router.events.subscribe(() => {
        if (this.isOpen()) {
          this.isOpen.set(false);
          this.resetChat();
        }
      });
    });
  }

  toggleChat(): void {
    this.isOpen.update(value => !value);
    if (this.isOpen()) {
      // Ensure chat is initialized when opened
      this.geminiService.initChat();
      this.scrollChatToBottom();
    }
  }

  async sendUserMessage(): Promise<void> {
    const messageText = this.userMessage.value?.trim();
    if (!messageText) {
      return;
    }

    this.messages.update(msgs => [...msgs, { sender: 'user', text: messageText! }]);
    this.userMessage.setValue('');
    this.isLoading.set(true);
    this.scrollChatToBottom();

    try {
      const stream = await this.geminiService.sendMessage(messageText);
      let aiResponseText = '';
      this.messages.update(msgs => [...msgs, { sender: 'ai', text: '' }]); // Add an empty AI message placeholder

      for await (const chunk of stream) {
        aiResponseText += chunk.text;
        // Update the last message in the signal array
        this.messages.update(msgs => {
          const lastMsg = msgs[msgs.length - 1];
          if (lastMsg && lastMsg.sender === 'ai') {
            lastMsg.text = aiResponseText;
          }
          return [...msgs]; // Trigger change detection
        });
        this.scrollChatToBottom();
      }
    } catch (error) {
      console.error('Failed to get AI response:', error);
      this.messages.update(msgs => [...msgs, { sender: 'ai', text: 'Sorry, I am having trouble connecting right now. Please try again later.' }]);
    } finally {
      this.isLoading.set(false);
      this.scrollChatToBottom();
    }
  }

  resetChat(): void {
    this.messages.set([]);
    this.userMessage.setValue('');
    this.isLoading.set(false);
    this.geminiService.initChat(); // Re-initialize the chat service to clear history
  }

  private scrollChatToBottom(): void {
    // Use a timeout to ensure DOM has updated before attempting to scroll
    setTimeout(() => {
      if (this.messageContainer) {
        this.messageContainer.nativeElement.scrollTop = this.messageContainer.nativeElement.scrollHeight;
      }
    }, 0);
  }
}
