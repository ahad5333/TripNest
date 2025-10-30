import { GoogleGenAI, Chat, Type } from "@google/genai";
import { ReceiptDetails, ExpenseCategory } from '../types';

class GeminiService {
  private ai: GoogleGenAI;
  private chat: Chat;

  constructor() {
    if (!process.env.API_KEY) {
      throw new Error("API_KEY is not set in environment variables.");
    }
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    this.chat = this.ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: 'You are a helpful and friendly travel assistant for the TripNest app. Provide personalized travel recommendations, help build itineraries, and answer travel-related questions. Keep your responses concise and mobile-friendly. Use markdown for formatting when appropriate.',
      },
    });
  }

  public async sendMessage(message: string): Promise<string> {
    try {
      const result = await this.chat.sendMessage({ message });
      return result.text;
    } catch (error) {
      console.error("Gemini API error:", error);
      throw new Error("Failed to get response from AI.");
    }
  }

  public async extractReceiptDetails(base64ImageDataUrl: string): Promise<ReceiptDetails | null> {
    try {
        const base64Data = base64ImageDataUrl.split(',')[1];
        if (!base64Data) {
            throw new Error("Invalid base64 image data URL");
        }

        const imagePart = {
            inlineData: {
                mimeType: 'image/jpeg',
                data: base64Data,
            },
        };

        const textPart = {
            text: `Analyze this receipt image. Extract the merchant name, the final total amount paid, and the transaction date. Also, based on the merchant name or items, suggest a category for this expense from the following list: 'Food', 'Transport', 'Accommodation', 'Activities', 'Other'. If you cannot determine a category, omit the category field. Respond in a JSON format.`,
        };

        const response = await this.ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [textPart, imagePart] },
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        merchant: { type: Type.STRING, description: 'The name of the store or merchant.' },
                        amount: { type: Type.NUMBER, description: 'The total final amount paid.' },
                        date: { type: Type.STRING, description: 'The date of the transaction (e.g., YYYY-MM-DD).' },
                        category: { type: Type.STRING, description: `The expense category. Must be one of: 'Food', 'Transport', 'Accommodation', 'Activities', 'Other'.` }
                    },
                    required: ['merchant', 'amount', 'date'],
                }
            }
        });

        const jsonString = response.text.trim();
        const details: ReceiptDetails = JSON.parse(jsonString);
        return details;

    } catch (error) {
        console.error("Gemini OCR error:", error);
        // Fail gracefully so the user can still input manually
        return null;
    }
  }
}

const geminiService = new GeminiService();
export default geminiService;