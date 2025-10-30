import React, { useState } from 'react';
import Screen from '../components/Screen';
import TripCard from '../components/TripCard';
import { useMockData } from '../hooks/useMockData';
import { Trip, TripStatus } from '../types';

interface TripsScreenProps {
  onSelectTrip: (trip: Trip) => void;
}

const TABS: TripStatus[] = ['Upcoming', 'Current', 'Past'];

const TripsScreen: React.FC<TripsScreenProps> = ({ onSelectTrip }) => {
  const [activeTab, setActiveTab] = useState<TripStatus>('Upcoming');
  const { trips } = useMockData();

  const filteredTrips = trips.filter(trip => trip.status === activeTab);

  return (
    <Screen title="My Trips">
      <div className="mb-4 border-b border-border">
        <nav className="-mb-px flex space-x-4" aria-label="Tabs">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`${
                activeTab === tab
                  ? 'border-primary text-primary'
                  : 'border-transparent text-text-secondary hover:text-text-primary hover:border-border'
              } whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {filteredTrips.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrips.map(trip => (
            <TripCard key={trip.id} trip={trip} onClick={() => onSelectTrip(trip)} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 px-4 bg-surface border border-border rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-text-primary">No {activeTab.toLowerCase()} trips</h3>
          <p className="text-text-secondary mt-2">Looks like you don't have any trips here. Time to plan a new one!</p>
        </div>
      )}
    </Screen>
  );
};

export default TripsScreen;