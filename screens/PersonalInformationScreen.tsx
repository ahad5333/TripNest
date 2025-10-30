import React, { useState } from 'react';
import Screen from '../components/Screen';

interface PersonalInformationScreenProps {
  onBack: () => void;
}

const PersonalInformationScreen: React.FC<PersonalInformationScreenProps> = ({ onBack }) => {
  const [firstName, setFirstName] = useState('Alex');
  const [lastName, setLastName] = useState('Doe');
  const [email, setEmail] = useState('alex.doe@example.com');
  const [phone, setPhone] = useState('+1 123 456 7890');

  const handleSaveChanges = () => {
    // In a real app, you would send this data to your backend.
    alert('Personal information saved!');
    onBack();
  };

  return (
    <Screen title="Personal Information" onBack={onBack}>
      <div className="space-y-6 max-w-2xl mx-auto">
        <p className="text-text-secondary">
          Manage your personal details here. This information will be used to auto-fill booking forms and personalize your experience.
        </p>

        <div className="p-6 bg-surface border border-border rounded-xl shadow-sm space-y-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-text-secondary mb-1">
              First Name
            </label>
            <input
              id="firstName"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full p-3 bg-background dark:bg-surface border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-text-secondary mb-1">
              Last Name
            </label>
            <input
              id="lastName"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full p-3 bg-background dark:bg-surface border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-text-secondary mb-1">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 bg-background dark:bg-surface border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-text-secondary mb-1">
              Phone Number
            </label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-3 bg-background dark:bg-surface border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>
        </div>

        <button
          onClick={handleSaveChanges}
          className="w-full p-3 bg-primary text-white dark:text-text-primary font-bold rounded-lg hover:bg-opacity-90 transition-colors shadow-md"
        >
          Save Changes
        </button>
      </div>
    </Screen>
  );
};

export default PersonalInformationScreen;
