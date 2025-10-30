import React from 'react';
import Screen from '../components/Screen';
import Icon from '../components/Icon';

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

const featuredDeals = [
    { title: '50% off flights to Hawaii', description: 'Escape to paradise with our exclusive offer. Limited time only!', partner: 'Aloha Airlines' },
    { title: 'Luxury European Hotels from $99/night', description: 'Experience 5-star comfort without the 5-star price tag.', partner: 'Grand Hotels' },
];

const ExploreScreen: React.FC = () => {
  return (
    <Screen title="Explore">
      <div className="space-y-8">
        {/* Search Bar */}
        <div className="relative w-full">
            <input
              type="text"
              placeholder="Search for destinations, hotels..."
              className="w-full pl-5 pr-12 py-3 text-base bg-surface border border-border text-text-primary rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              aria-label="Search for a destination, hotel, or activity"
            />
            <button 
              className="absolute inset-y-0 right-0 flex items-center pr-4 text-text-secondary hover:text-primary transition-colors"
              aria-label="Search"
            >
              <Icon name="Explore" className="h-6 w-6" />
            </button>
        </div>
        
        {/* Popular Destinations */}
        <div>
            <h2 className="text-xl font-heading font-semibold text-text-primary mb-3">Popular Destinations</h2>
            <div className="flex overflow-x-auto space-x-4 pb-4 -mb-4">
                {popularDestinations.map((dest, index) => (
                    <div key={index} className="flex-shrink-0 w-40 cursor-pointer group" onClick={() => alert(`Exploring ${dest.name}...`)}>
                        <div className="relative rounded-xl overflow-hidden shadow-lg transform group-hover:scale-105 transition-transform duration-300">
                            <img src={dest.imageUrl} alt={dest.name} className="w-full h-48 object-cover"/>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                            <p className="absolute bottom-3 left-3 font-bold text-white font-heading">{dest.name}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Travel Themes */}
        <div>
            <h2 className="text-xl font-heading font-semibold text-text-primary mb-3">Browse by Theme</h2>
            <div className="grid grid-cols-2 gap-4">
                {travelThemes.map((theme, index) => (
                    <div key={index} className="relative rounded-xl overflow-hidden shadow-lg cursor-pointer group" onClick={() => alert(`Finding ${theme.name} trips...`)}>
                        <img src={theme.imageUrl} alt={theme.name} className="w-full h-28 object-cover transform group-hover:scale-110 transition-transform duration-300"/>
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <p className="font-bold text-white text-lg font-heading">{theme.name}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
        
        {/* Featured Deals */}
        <div>
            <h2 className="text-xl font-heading font-semibold text-text-primary mb-3">Featured Deals</h2>
            <div className="space-y-4">
                {featuredDeals.map((deal, index) => (
                    <div key={index} className="bg-surface border border-border rounded-xl shadow-sm p-4 cursor-pointer hover:bg-background transition-colors" onClick={() => alert('Viewing deal details...')}>
                        <p className="font-bold text-accent text-sm">{deal.partner}</p>
                        <h3 className="font-semibold text-text-primary mt-1">{deal.title}</h3>
                        <p className="text-sm text-text-secondary mt-1">{deal.description}</p>
                    </div>
                ))}
            </div>
        </div>

      </div>
    </Screen>
  );
};

export default ExploreScreen;