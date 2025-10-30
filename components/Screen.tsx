import React from 'react';
import Icon from './Icon';

interface ScreenProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  onBack?: () => void;
}

const Screen: React.FC<ScreenProps> = ({ title, children, className = '', onBack }) => {
  return (
    <div className={`p-4 md:p-6 ${className}`}>
      <div className="flex items-center mb-4">
        {onBack && (
          <button onClick={onBack} className="mr-3 p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors" aria-label="Go back">
            <Icon name="ArrowLeft" className="h-6 w-6 text-text-primary" />
          </button>
        )}
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-text-primary">
          {title}
        </h1>
      </div>
      {children}
    </div>
  );
};

export default Screen;