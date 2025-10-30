import React from 'react';
import { ScreenName } from '../types';
import Icon from './Icon';

interface BottomNavProps {
  activeScreen: ScreenName;
  setActiveScreen: (screen: ScreenName) => void;
}

const NAV_ITEMS: ScreenName[] = ['Dashboard', 'Explore', 'Chat', 'Trips', 'Profile'];

const BottomNav: React.FC<BottomNavProps> = ({ activeScreen, setActiveScreen }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 h-20 bg-surface flex justify-around items-center z-50 border-t border-border shadow-[0_-1px_3px_rgba(0,0,0,0.05)]">
      {NAV_ITEMS.map((item) => (
        <button
          key={item}
          onClick={() => setActiveScreen(item)}
          className={`flex flex-col items-center justify-center w-full h-full transition-colors duration-200 ${
            activeScreen === item ? 'text-primary' : 'text-text-secondary hover:text-primary'
          }`}
          style={{ minWidth: '44px', minHeight: '44px' }}
        >
          <Icon name={item} className="h-7 w-7" />
          <span className={`text-xs font-medium mt-1 ${activeScreen === item ? 'font-bold' : ''}`}>
            {item}
          </span>
        </button>
      ))}
    </nav>
  );
};

export default BottomNav;