import React, { useState } from 'react';
import Screen from '../components/Screen';

interface TravelPreferencesScreenProps {
  onBack: () => void;
}

const travelStyles = ['Budget', 'Mid-Range', 'Luxury', 'Backpacking'];
const travelInterests = ['Adventure', 'Culture', 'Beaches', 'Foodie', 'History', 'Nature', 'Nightlife', 'Relaxation'];

const TravelPreferencesScreen: React.FC<TravelPreferencesScreenProps> = ({ onBack }) => {
  const [selectedStyle, setSelectedStyle] = useState('Mid-Range');
  const [selectedInterests, setSelectedInterests] = useState<string[]>(['Culture', 'Foodie']);

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev =>
      prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest]
    );
  };

  const handleSaveChanges = () => {
    alert('Travel preferences saved!');
    onBack();
  };

  return (
    <Screen title="Travel Preferences" onBack={onBack}>
      <div className="space-y-8 max-w-2xl mx-auto">
        <p className="text-text-secondary">
          Help us find the perfect trips for you by sharing your travel style and interests.
        </p>

        {/* Travel Style Section */}
        <div className="p-6 bg-surface border border-border rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold font-heading text-text-primary mb-3">
            What's your travel style?
          </h3>
          <div className="flex flex-wrap gap-3">
            {travelStyles.map(style => (
              <button
                key={style}
                onClick={() => setSelectedStyle(style)}
                className={`px-4 py-2 text-sm font-semibold rounded-full transition-all duration-200 border-2 ${
                  selectedStyle === style
                    ? 'bg-primary text-white dark:text-text-primary border-primary'
                    : 'bg-transparent text-text-primary border-border hover:border-primary'
                }`}
              >
                {style}
              </button>
            ))}
          </div>
        </div>

        {/* Travel Interests Section */}
        <div className="p-6 bg-surface border border-border rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold font-heading text-text-primary mb-3">
            What are your interests?
          </h3>
          <p className="text-sm text-text-secondary mb-4">Select all that apply.</p>
          <div className="flex flex-wrap gap-3">
            {travelInterests.map(interest => (
              <button
                key={interest}
                onClick={() => toggleInterest(interest)}
                className={`px-4 py-2 text-sm font-semibold rounded-full transition-all duration-200 border-2 ${
                  selectedInterests.includes(interest)
                    ? 'bg-accent text-white border-accent'
                    : 'bg-transparent text-text-primary border-border hover:border-accent'
                }`}
              >
                {interest}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleSaveChanges}
          className="w-full p-3 bg-primary text-white dark:text-text-primary font-bold rounded-lg hover:bg-opacity-90 transition-colors shadow-md"
        >
          Save Preferences
        </button>
      </div>
    </Screen>
  );
};

export default TravelPreferencesScreen;
