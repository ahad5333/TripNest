import React from 'react';
import { Trip, TripStatus } from '../types';

interface TripCardProps {
  trip: Trip;
  onClick: () => void;
}

const getStatusStyles = (status: TripStatus): string => {
  switch (status) {
    case 'Upcoming':
      return 'bg-fresh-mint-green';
    case 'Current':
      return 'bg-warm-sunset-orange';
    case 'Past':
      return 'bg-gray-500';
    default:
      return 'bg-text-primary';
  }
};

// New helper to provide distinct colors for the icons themselves
const getStatusIconFillColor = (status: TripStatus): string => {
  switch (status) {
    case 'Upcoming':
      return '#A7F3D0'; // A light mint green for contrast
    case 'Current':
      return '#FDE68A'; // A light warm yellow for contrast
    case 'Past':
      return '#E5E7EB'; // A light gray for contrast
    default:
      return 'white';
  }
};

const StatusIcon: React.FC<{ status: TripStatus }> = ({ status }) => {
  const iconProps = {
    className: "h-3 w-3",
    viewBox: "0 0 20 20",
    fill: getStatusIconFillColor(status), // Set a distinct fill color
  };

  switch (status) {
    case 'Upcoming':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" {...iconProps}>
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.415L11 9.586V6z" clipRule="evenodd" />
        </svg>
      ); // Clock icon
    case 'Current':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" {...iconProps}>
          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
        </svg>
      ); // Location pin
    case 'Past':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" {...iconProps}>
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      ); // Checkmark circle
    default:
      return null;
  }
};


const TripCard: React.FC<TripCardProps> = ({ trip, onClick }) => {
  const statusStyles = getStatusStyles(trip.status);

  return (
    <div 
      className="bg-surface rounded-xl shadow-lg border border-border overflow-hidden transform hover:scale-105 transition-transform duration-300 cursor-pointer"
      onClick={onClick}
      aria-label={`View details for ${trip.destination}`}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => e.key === 'Enter' && onClick()}
    >
      <div className="relative">
        <img className="h-40 w-full object-cover" src={trip.imageUrl} alt={`View of ${trip.destination}`} />
        <span className={`absolute top-3 right-3 text-xs font-bold text-white px-2.5 py-1 rounded-full ${statusStyles} inline-flex items-center gap-1.5`}>
          <StatusIcon status={trip.status} />
          {trip.status}
        </span>
      </div>
      <div className="p-4">
        <h3 className="font-heading text-lg font-bold text-text-primary">{trip.destination}</h3>
        <p className="text-sm text-text-secondary">{trip.startDate} - {trip.endDate}</p>
      </div>
    </div>
  );
};

export default TripCard;