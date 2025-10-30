import React, { useState, useRef } from 'react';
import Screen from '../components/Screen';
import TripCard from '../components/TripCard';
import { useMockData } from '../hooks/useMockData';
import Icon from '../components/Icon';
import { ScreenName, Trip } from '../types';

// Add SpeechRecognition types to the global window object to avoid TypeScript errors.
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface DashboardScreenProps {
  onSelectTrip: (trip: Trip) => void;
  setActiveScreen: (screen: ScreenName) => void;
}

const popularDestinations = [
  { name: 'Tokyo', imageUrl: 'https://picsum.photos/seed/tokyo_explore/400/300' },
  { name: 'Bali', imageUrl: 'https://picsum.photos/seed/bali_explore/400/300' },
  { name: 'London', imageUrl: 'https://picsum.photos/seed/london_explore/400/300' },
  { name: 'Sydney', imageUrl: 'https://picsum.photos/seed/sydney_explore/400/300' },
  { name: 'Cape Town', imageUrl: 'https://picsum.photos/seed/capetown_explore/400/300' },
];

const travelThemes = [
  { name: 'Adventure', imageUrl: 'https://picsum.photos/seed/adventure_theme/400/300' },
  { name: 'Beaches', imageUrl: 'https://picsum.photos/seed/beach_theme/400/300' },
  { name: 'Cultural', imageUrl: 'https://picsum.photos/seed/cultural_theme/400/300' },
  { name: 'Relaxation', imageUrl: 'https://picsum.photos/seed/relaxation_theme/400/300' },
];


const VoiceListeningModal: React.FC<{ onStop: () => void }> = ({ onStop }) => (
  <div 
    className="fixed inset-0 bg-black/50 z-50 flex flex-col justify-center items-center backdrop-blur-sm"
    onClick={onStop}
    role="dialog"
    aria-modal="true"
    aria-label="Voice input active"
  >
    <div className="bg-white rounded-full p-6 animate-pulse">
        <Icon name="Mic" className="h-12 w-12 text-deep-ocean-blue" />
    </div>
    <p className="text-white text-xl mt-4 font-semibold">Listening...</p>
    <p className="text-gray-300 text-sm mt-1">Tap anywhere to cancel</p>
  </div>
);


const DashboardScreen: React.FC<DashboardScreenProps> = ({ onSelectTrip, setActiveScreen }) => {
  const { trips } = useMockData();
  const upcomingTrips = trips.filter(trip => trip.status === 'Upcoming');

  const [searchValue, setSearchValue] = useState('');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null); // Using `any` for SpeechRecognition instance

  const stopListening = () => {
    if (recognitionRef.current) {
        recognitionRef.current.stop();
    }
  };

  const handleVoiceSearch = () => {
    if (isListening) {
      stopListening();
      return;
    }
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Sorry, your browser doesn't support speech recognition.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const speechResult = event.results[0][0].transcript;
      setSearchValue(speechResult);
      stopListening();
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error', event.error);
      if (event.error === 'not-allowed') {
        alert('Microphone access was denied. Please allow microphone access in your browser settings.');
      }
      setIsListening(false);
      recognitionRef.current = null;
    };

    recognition.onend = () => {
      setIsListening(false);
      recognitionRef.current = null;
    };

    recognition.start();
  };

  return (
    <>
      {isListening && <VoiceListeningModal onStop={stopListening} />}
      <Screen title="Dashboard">
        <div className="space-y-6">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Where do you want to go?"
              className="w-full pl-5 pr-12 py-3 text-base bg-surface border border-border text-text-primary rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              aria-label="Search for a destination"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
            <button 
              className="absolute inset-y-0 right-0 flex items-center pr-4 text-text-secondary hover:text-primary transition-colors"
              aria-label="Use voice search"
              onClick={handleVoiceSearch}
            >
              <Icon name="Mic" className="h-6 w-6" />
            </button>
          </div>

          <div>
            <h2 className="text-xl font-heading font-semibold text-text-primary mb-3">Welcome to TripNest!</h2>
            <p className="text-text-secondary">Your next adventure awaits. Let's get started.</p>
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-center">
              <button className="flex flex-col items-center p-3 bg-fresh-mint-green/10 dark:bg-fresh-mint-green/20 rounded-xl hover:bg-fresh-mint-green/20 dark:hover:bg-fresh-mint-green/30 transition-colors">
                  <div className="p-3 bg-fresh-mint-green rounded-full">
                      <Icon name="Plus" className="h-6 w-6 text-white"/>
                  </div>
                  <span className="text-sm font-semibold text-text-primary mt-2">Plan Trip</span>
              </button>
              <button 
                onClick={() => setActiveScreen('Trips')}
                className="flex flex-col items-center p-3 bg-warm-sunset-orange/10 dark:bg-warm-sunset-orange/20 rounded-xl hover:bg-warm-sunset-orange/20 dark:hover:bg-warm-sunset-orange/30 transition-colors"
              >
                  <div className="p-3 bg-warm-sunset-orange rounded-full">
                      <Icon name="Trips" className="h-6 w-6 text-white"/>
                  </div>
                  <span className="text-sm font-semibold text-text-primary mt-2">My Trips</span>
              </button>
              <button 
                onClick={() => setActiveScreen('Chat')}
                className="flex flex-col items-center p-3 bg-deep-ocean-blue/10 dark:bg-deep-ocean-blue/20 rounded-xl hover:bg-deep-ocean-blue/20 dark:hover:bg-deep-ocean-blue/30 transition-colors"
              >
                  <div className="p-3 bg-deep-ocean-blue rounded-full">
                      <Icon name="Chat" className="h-6 w-6 text-white"/>
                  </div>
                  <span className="text-sm font-semibold text-text-primary mt-2">AI Assistant</span>
              </button>
          </div>

          <div>
            <h2 className="text-xl font-heading font-semibold text-text-primary mb-3">Upcoming Trips</h2>
            {upcomingTrips.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {upcomingTrips.map(trip => (
                  <TripCard key={trip.id} trip={trip} onClick={() => onSelectTrip(trip)} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 px-4 bg-surface border border-border rounded-lg shadow-sm">
                <p className="text-text-secondary">No upcoming trips planned yet.</p>
                <button className="mt-4 bg-secondary text-white font-bold py-2 px-4 rounded-full hover:bg-opacity-90 transition-colors">
                  Plan Your First Trip!
                </button>
              </div>
            )}
          </div>

          <div>
            <h2 className="text-xl font-heading font-semibold text-text-primary mb-3">Explore & Discover</h2>
            
            <div className="mb-6">
                <h3 className="text-lg font-heading font-medium text-text-primary mb-3">Popular Destinations</h3>
                <div className="flex overflow-x-auto space-x-4 pb-4 -mb-4">
                    {popularDestinations.map((dest, index) => (
                        <div key={index} className="flex-shrink-0 w-32 cursor-pointer group" onClick={() => alert(`Exploring ${dest.name}...`)}>
                            <div className="relative rounded-xl overflow-hidden shadow-md transform group-hover:scale-105 transition-transform duration-300">
                                <img src={dest.imageUrl} alt={dest.name} className="w-full h-40 object-cover"/>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                <p className="absolute bottom-2 left-2 font-bold text-white font-heading text-sm">{dest.name}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <h3 className="text-lg font-heading font-medium text-text-primary mb-3">Travel Themes</h3>
                <div className="grid grid-cols-2 gap-4">
                    {travelThemes.map((theme, index) => (
                        <div key={index} className="relative rounded-xl overflow-hidden shadow-lg cursor-pointer group" onClick={() => alert(`Finding ${theme.name} trips...`)}>
                            <img src={theme.imageUrl} alt={theme.name} className="w-full h-24 object-cover transform group-hover:scale-110 transition-transform duration-300"/>
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                <p className="font-bold text-white text-md font-heading">{theme.name}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
          </div>
        </div>
      </Screen>
    </>
  );
};

export default DashboardScreen;