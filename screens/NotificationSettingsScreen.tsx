import React, { useState } from 'react';
import Screen from '../components/Screen';

interface NotificationSettingsScreenProps {
  onBack: () => void;
}

interface ToggleProps {
  label: string;
  description: string;
  isEnabled: boolean;
  onToggle: () => void;
}

const SettingToggle: React.FC<ToggleProps> = ({ label, description, isEnabled, onToggle }) => {
  return (
    <div className="flex items-center justify-between py-4">
      <div className="flex-1 pr-4">
        <p className="font-medium text-text-primary">{label}</p>
        <p className="text-sm text-text-secondary">{description}</p>
      </div>
      <button
        onClick={onToggle}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          isEnabled ? 'bg-primary' : 'bg-gray-300 dark:bg-border'
        }`}
        aria-label={`Toggle ${label}`}
        role="switch"
        aria-checked={isEnabled}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            isEnabled ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
};

const NotificationSettingsScreen: React.FC<NotificationSettingsScreenProps> = ({ onBack }) => {
  const [settings, setSettings] = useState({
    tripReminders: true,
    flightStatus: true,
    bookingConfirmations: true,
    promotions: false,
    socialUpdates: true,
  });

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };
  
  const handleSaveChanges = () => {
    alert('Notification settings saved!');
    onBack();
  };

  return (
    <Screen title="Notifications" onBack={onBack}>
      <div className="space-y-6 max-w-2xl mx-auto">
        <p className="text-text-secondary">
          Choose what you want to be notified about. You can change these settings at any time.
        </p>

        <div className="bg-surface border border-border rounded-xl shadow-sm divide-y divide-border px-4">
          <SettingToggle
            label="Trip Reminders"
            description="Get notified about upcoming activities and bookings."
            isEnabled={settings.tripReminders}
            onToggle={() => toggleSetting('tripReminders')}
          />
          <SettingToggle
            label="Flight Status Changes"
            description="Receive real-time updates about delays, cancellations, and gate changes."
            isEnabled={settings.flightStatus}
            onToggle={() => toggleSetting('flightStatus')}
          />
          <SettingToggle
            label="Booking Confirmations"
            description="Get a notification as soon as your bookings are confirmed."
            isEnabled={settings.bookingConfirmations}
            onToggle={() => toggleSetting('bookingConfirmations')}
          />
          <SettingToggle
            label="Promotions & Offers"
            description="Receive exclusive deals and travel inspiration from TripNest."
            isEnabled={settings.promotions}
            onToggle={() => toggleSetting('promotions')}
          />
           <SettingToggle
            label="Social Updates"
            description="Get notified when friends share trips or interact with you."
            isEnabled={settings.socialUpdates}
            onToggle={() => toggleSetting('socialUpdates')}
          />
        </div>

        <button
          onClick={handleSaveChanges}
          className="w-full p-3 bg-primary text-white dark:text-text-primary font-bold rounded-lg hover:bg-opacity-90 transition-colors shadow-md"
        >
          Save Settings
        </button>
      </div>
    </Screen>
  );
};

export default NotificationSettingsScreen;
