import React, { useRef, useState } from 'react';
import { Trip, Place } from '../types';
import Screen from '../components/Screen';
import Icon from '../components/Icon';

interface TripDetailsScreenProps {
  trip: Trip;
  onBack: () => void;
  onViewExpenses: () => void;
}

const StarIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
);

// --- ShareModal Component ---
interface ShareModalProps {
  trip: Trip;
  onClose: () => void;
}

const ShareModal: React.FC<ShareModalProps> = ({ trip, onClose }) => {
  const [copied, setCopied] = useState(false);
  const shareUrl = `https://tripnest.app/trip/${trip.id}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center backdrop-blur-sm" onClick={onClose}>
      <div 
        className="bg-surface rounded-2xl shadow-xl p-6 m-4 w-full max-w-md transform transition-all" 
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center">
          <h2 className="font-heading text-2xl font-bold text-text-primary">Share Trip</h2>
          <button onClick={onClose} className="text-text-secondary hover:text-text-primary">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <p className="mt-2 text-text-secondary">Share this trip with your friends and family!</p>
        
        <div className="mt-4">
          <label htmlFor="share-link" className="text-sm font-medium text-text-secondary">Trip Link</label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <input 
              id="share-link"
              type="text" 
              readOnly 
              value={shareUrl} 
              className="flex-1 block w-full rounded-none rounded-l-md sm:text-sm border-border bg-background text-text-primary p-2"
            />
            <button
              onClick={handleCopyLink}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md text-white bg-accent hover:bg-opacity-90"
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>

        <div className="mt-6">
            <p className="text-center text-sm text-text-secondary">Or share on social media</p>
            <div className="mt-3 flex justify-center space-x-4">
                <button className="w-12 h-12 bg-background rounded-full flex items-center justify-center text-text-secondary hover:bg-border" aria-label="Share on Facebook">
                    <p className="font-bold">FB</p>
                </button>
                 <button className="w-12 h-12 bg-background rounded-full flex items-center justify-center text-text-secondary hover:bg-border" aria-label="Share on Twitter">
                    <p className="font-bold">TW</p>
                </button>
                 <button className="w-12 h-12 bg-background rounded-full flex items-center justify-center text-text-secondary hover:bg-border" aria-label="Share on WhatsApp">
                    <p className="font-bold">WA</p>
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

// --- AddToItineraryModal Component ---
interface AddToItineraryModalProps {
  place: Place | null;
  trip: Trip;
  onClose: () => void;
}

const AddToItineraryModal: React.FC<AddToItineraryModalProps> = ({ place, trip, onClose }) => {
  if (!place) return null;

  const getTripDates = () => {
    const dates: Date[] = [];
    const startDate = new Date(trip.startDate);
    const endDate = new Date(trip.endDate);
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
  };

  const tripDates = getTripDates();

  const handleDateSelect = (date: Date) => {
    const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    alert(`${place.name} has been added to your itinerary for ${formattedDate}.`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center backdrop-blur-sm" onClick={onClose}>
      <div 
        className="bg-surface rounded-2xl shadow-xl p-6 m-4 w-full max-w-sm transform transition-all" 
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center">
          <h2 className="font-heading text-xl font-bold text-text-primary">Add to Itinerary</h2>
          <button onClick={onClose} className="text-text-secondary hover:text-text-primary">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <p className="mt-2 text-text-secondary">Select a date to add <span className="font-bold text-text-primary">{place.name}</span> to your plan.</p>
        
        <div className="mt-4 max-h-60 overflow-y-auto space-y-2 pr-2">
          {tripDates.map((date, index) => (
            <button 
              key={index} 
              onClick={() => handleDateSelect(date)}
              className="w-full text-left p-3 bg-background rounded-lg hover:bg-primary hover:text-white dark:hover:text-text-primary transition-colors text-text-primary"
            >
              {date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};


// --- ImageCarousel Component ---
const ImageCarousel: React.FC<{ images: string[]; alt: string }> = ({ images, alt }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = (e: React.MouseEvent) => {
    e.stopPropagation();
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    const isLastSlide = currentIndex === images.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };
  
  const goToSlide = (slideIndex: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex(slideIndex);
  };

  if (!images || images.length === 0) {
    return <div className="w-full h-48 bg-gray-200"></div>;
  }

  return (
    <div className="relative w-full h-48 group">
      <div className="w-full h-full rounded-t-2xl overflow-hidden">
        <img
          src={images[currentIndex]}
          alt={`${alt} image ${currentIndex + 1}`}
          className="w-full h-full object-cover cursor-pointer"
          onClick={() => alert(alt)}
        />
      </div>
      
      {images.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/80 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
            aria-label="Previous image"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={goToNext}
            className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/80 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
            aria-label="Next image"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-2">
            {images.map((_, slideIndex) => (
              <button
                key={slideIndex}
                onClick={(e) => goToSlide(slideIndex, e)}
                className={`h-2 w-2 rounded-full transition-colors ${
                  currentIndex === slideIndex ? 'bg-white' : 'bg-white/50 hover:bg-white/75'
                }`}
                aria-label={`Go to image ${slideIndex + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};


const TripDetailsScreen: React.FC<TripDetailsScreenProps> = ({ trip, onBack, onViewExpenses }) => {
  const hotelsRef = useRef<HTMLDivElement>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isAddToItineraryModalOpen, setIsAddToItineraryModalOpen] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);

  const handleViewHotels = () => {
    hotelsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const openAddToItineraryModal = (place: Place) => {
    setSelectedPlace(place);
    setIsAddToItineraryModalOpen(true);
  };

  const closeAddToItineraryModal = () => {
    setSelectedPlace(null);
    setIsAddToItineraryModalOpen(false);
  };

  const calculateTripDuration = (startDateStr: string, endDateStr: string): number => {
    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) return 0;
    const timeDiff = endDate.getTime() - startDate.getTime();
    const durationInDays = Math.round(timeDiff / (1000 * 3600 * 24)) + 1;
    return durationInDays > 0 ? durationInDays : 1;
  };

  const tripDuration = calculateTripDuration(trip.startDate, trip.endDate);

  return (
    <>
      <Screen title={trip.destination} onBack={onBack}>
        <div className="space-y-6">
          <div className="relative">
            <img src={trip.imageUrl} alt={trip.destination} className="w-full h-56 object-cover rounded-xl shadow-lg" />
            <div className="absolute bottom-0 left-0 bg-gradient-to-t from-black/60 to-transparent w-full h-24 rounded-b-xl p-4 flex flex-col justify-end">
               <h2 className="text-white font-bold text-2xl font-heading">{trip.destination}</h2>
               <p className="text-gray-200 text-sm">{trip.startDate} - {trip.endDate} &bull; {tripDuration} {tripDuration === 1 ? 'Day' : 'Days'}</p>
            </div>
          </div>

          <div className="bg-surface border border-border p-4 rounded-xl shadow-sm">
            <p className="text-text-secondary">{trip.description}</p>
          </div>
          
          <div className="bg-surface border border-border p-4 rounded-xl shadow-sm">
             <h3 className="font-semibold font-heading text-text-primary mb-3">Trip Tools</h3>
             <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={onViewExpenses}
                  className="flex items-center p-4 bg-accent/10 rounded-lg hover:bg-accent/20 transition-colors"
                >
                  <Icon name="Receipt" className="h-6 w-6 text-accent" />
                  <span className="ml-3 font-semibold text-text-primary">Expenses</span>
                </button>
                <button 
                  onClick={handleViewHotels}
                  className="flex items-center p-4 bg-secondary/10 rounded-lg hover:bg-secondary/20 transition-colors"
                >
                  <Icon name="Bed" className="h-6 w-6 text-secondary" />
                  <span className="ml-3 font-semibold text-text-primary">View Hotel Suggestions</span>
                </button>
                <button className="flex items-center p-4 bg-background dark:bg-border/50 rounded-lg cursor-not-allowed">
                  <Icon name="Pencil" className="h-6 w-6 text-text-secondary" />
                  <span className="ml-3 font-semibold text-text-secondary">Edit Trip</span>
                </button>
                <button 
                  onClick={() => setIsShareModalOpen(true)}
                  className="flex items-center p-4 bg-accent/10 rounded-lg hover:bg-accent/20 transition-colors"
                >
                  <Icon name="Share" className="h-6 w-6 text-accent" />
                  <span className="ml-3 font-semibold text-text-primary">Share Trip</span>
                </button>
             </div>
          </div>
          
          {trip.suggestedFlights && trip.suggestedFlights.length > 0 && (
            <div>
              <h3 className="text-xl font-heading font-semibold text-text-primary mb-3">Flight Suggestions</h3>
              <div className="space-y-4">
                {trip.suggestedFlights.map((flight, index) => (
                  <div key={index} className="bg-surface border border-border rounded-xl shadow-sm p-4 flex items-center justify-between flex-wrap">
                    <div className="flex items-center gap-4 flex-1 min-w-[200px] mb-3 sm:mb-0">
                      <img src={flight.airlineLogoUrl} alt={`${flight.airline} logo`} className="w-12 h-12 rounded-full object-contain bg-white border" />
                      <div>
                        <p className="font-bold text-text-primary">{flight.airline} {flight.flightNumber}</p>
                        <p className="text-sm text-text-secondary">{flight.departureTime} &rarr; {flight.arrivalTime}</p>
                        <p className="text-lg font-bold text-text-primary mt-1">${flight.price}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => alert(`Booking flow for ${flight.airline} ${flight.flightNumber} initiated!`)}
                      className="bg-secondary text-white dark:text-text-primary font-bold py-2 px-5 rounded-lg hover:bg-opacity-90 transition-colors w-full sm:w-auto"
                      aria-label={`Book flight with ${flight.airline} ${flight.flightNumber}`}
                    >
                      Book Flight
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div ref={hotelsRef}>
            <h3 className="text-xl font-heading font-semibold text-text-primary mb-3">Hotel Suggestions</h3>
            <div className="flex overflow-x-auto space-x-4 pb-4 -mb-4">
              {trip.suggestedHotels.map((hotel, index) => (
                <div key={index} className="flex-shrink-0 w-[22rem] bg-surface border border-border rounded-2xl shadow-lg overflow-hidden transform hover:-translate-y-1 hover:shadow-xl transition-all duration-300 flex flex-col">
                  <div className="relative">
                    <ImageCarousel images={hotel.imageUrls} alt={hotel.name} />
                     <div className="absolute top-3 right-3 flex items-center bg-black/50 backdrop-blur-sm text-white font-bold text-xs px-2.5 py-1.5 rounded-full pointer-events-none">
                        <StarIcon className="h-4 w-4 text-yellow-300 mr-1.5" />
                        <span>{hotel.rating.toFixed(1)}</span>
                    </div>
                  </div>
                  <div className="p-5 flex flex-col flex-1 space-y-3">
                      <h4 className="font-bold font-heading text-xl text-text-primary">{hotel.name}</h4>
                      
                      <div className="flex items-start text-text-secondary">
                          <Icon name="LocationMarker" className="h-5 w-5 mt-0.5 mr-2 flex-shrink-0" />
                          <p className="text-sm">{hotel.address}</p>
                      </div>
                      
                      <div className="mt-auto pt-4 flex justify-between items-center border-t border-border">
                          <div>
                              <span className="text-sm text-text-secondary">From </span>
                              <span className="text-2xl font-bold text-text-primary">${hotel.pricePerNight}</span>
                              <span className="text-sm text-text-secondary">/night</span>
                          </div>
                          <button 
                              onClick={() => alert(`Booking flow for ${hotel.name} initiated!`)}
                              className="bg-accent text-white font-bold py-2.5 px-6 rounded-lg hover:bg-opacity-90 transition-colors shadow hover:shadow-md text-base"
                              aria-label={`Book ${hotel.name} now`}
                          >
                              Book
                          </button>
                      </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-heading font-semibold text-text-primary mb-3">Places to Visit</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {trip.places.map((place, index) => (
                <div key={index} className="bg-surface border border-border rounded-lg shadow-sm overflow-hidden flex flex-col">
                  <img src={place.imageUrl} alt={place.name} className="w-full h-32 object-cover" />
                  <div className="p-4 flex flex-col flex-1">
                    <h4 className="font-bold font-heading text-text-primary">{place.name}</h4>
                    <p className="text-sm text-text-secondary mt-1 flex-1">{place.description}</p>
                    <button 
                      onClick={() => openAddToItineraryModal(place)}
                      className="w-full mt-4 bg-secondary text-white dark:text-text-primary font-semibold py-2 rounded-lg hover:bg-opacity-90 transition-colors"
                    >
                      Add to Itinerary
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </Screen>
      {isShareModalOpen && <ShareModal trip={trip} onClose={() => setIsShareModalOpen(false)} />}
      {isAddToItineraryModalOpen && <AddToItineraryModal place={selectedPlace} trip={trip} onClose={closeAddToItineraryModal} />}
    </>
  );
};

export default TripDetailsScreen;