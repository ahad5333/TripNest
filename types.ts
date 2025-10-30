// FIX: The original content of this file was incorrect and duplicated theme logic.
// It has been replaced with the application's core type definitions to resolve import errors.

export type ScreenName = 'Dashboard' | 'Explore' | 'Chat' | 'Trips' | 'Profile';

export type ProfileSubScreen = 'main' | 'personal' | 'preferences' | 'payment' | 'notifications';

export type TripStatus = 'Upcoming' | 'Current' | 'Past';

export interface Place {
  name: string;
  description: string;
  imageUrl: string;
}

export interface Hotel {
  name: string;
  pricePerNight: number;
  imageUrls: string[];
  rating: number;
  address: string;
}

export interface Flight {
  airline: string;
  flightNumber: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
  airlineLogoUrl: string;
}

export interface Trip {
  id: string;
  destination: string;
  startDate: string;
  endDate: string;
  imageUrl: string;
  status: TripStatus;
  budget: number;
  description: string;
  places: Place[];
  suggestedHotels: Hotel[];
  suggestedFlights?: Flight[];
}

export type ExpenseCategory = 'Food' | 'Transport' | 'Accommodation' | 'Activities' | 'Other';

export interface Expense {
  id: string;
  tripId: string;
  category: ExpenseCategory;
  description: string;
  amount: number;
  date: string;
  receiptImageUrl?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
}

export interface ReceiptDetails {
    merchant: string;
    amount: number;
    date: string;
    category?: ExpenseCategory;
}