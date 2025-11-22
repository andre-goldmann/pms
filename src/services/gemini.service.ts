import { Injectable, signal } from '@angular/core';
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";

@Injectable({
  providedIn: 'root',
})
export class GeminiService {
  private ai: GoogleGenAI;
  private chat: Chat | null = null;

  constructor() {
    // CRITICAL: API key must be from process.env.API_KEY
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    this.initChat();
  }

  initChat(): void {
    // Ensure we create a new chat instance to clear previous context
    this.chat = this.ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: "You are a helpful assistant for the apaleo Property Management System. Your goal is to guide users through the application's features, answer questions about properties, and assist with tasks like creating a new property. Be concise, actionable, and always encourage the user to interact with the UI. For example, if a user asks about creating a property, you should tell them to click the 'New property' button on the Properties overview page, or navigate to '/create-property'.",
      },
    });
    console.log('Gemini chat initialized.');
  }

  async sendMessage(message: string): Promise<AsyncIterable<GenerateContentResponse>> {
    if (!this.chat) {
      this.initChat(); // Re-initialize if chat somehow became null
    }
    try {
      // Use sendMessageStream for a better UX with streaming responses
      const response = await this.chat!.sendMessageStream({ message: message });
      return response;
    } catch (error) {
      console.error('Error sending message to Gemini:', error);
      // Depending on the error, you might want to re-throw, return a specific error object,
      // or handle it gracefully in the component.
      throw error;
    }
  }
}
