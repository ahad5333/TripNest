import React, { useState } from 'react';
import { ScreenName, Trip, ProfileSubScreen } from './types';
import BottomNav from './components/BottomNav';
import DashboardScreen from './screens/DashboardScreen';
import ExploreScreen from './screens/ExploreScreen';
import ChatScreen from './screens/ChatScreen';
import TripsScreen from './screens/TripsScreen';
import ProfileScreen from './screens/ProfileScreen';
import TripDetailsScreen from './screens/TripDetailsScreen';
import ExpenseTrackingScreen from './screens/ExpenseTrackingScreen';
import AuthScreen from './screens/AuthScreen';
import PersonalInformationScreen from './screens/PersonalInformationScreen';
import TravelPreferencesScreen from './screens/TravelPreferencesScreen';
import PaymentMethodsScreen from './screens/PaymentMethodsScreen';
import NotificationSettingsScreen from './screens/NotificationSettingsScreen';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUserEmail, setCurrentUserEmail] = useState('');
  const [activeScreen, setActiveScreen] = useState<ScreenName>('Dashboard');
  const [activeProfileScreen, setActiveProfileScreen] = useState<ProfileSubScreen>('main');
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [isViewingExpenses, setIsViewingExpenses] = useState(false);

  const handleAuthSuccess = (email: string) => {
    setIsAuthenticated(true);
    setCurrentUserEmail(email);
    setActiveScreen('Dashboard');
  };
  
  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUserEmail('');
    setActiveScreen('Dashboard'); // Reset to dashboard on logout
  };

  const handleSelectTrip = (trip: Trip) => {
    setSelectedTrip(trip);
  };

  const handleBackToList = () => {
    setSelectedTrip(null);
    setIsViewingExpenses(false);
  };

  const handleViewExpenses = () => {
    if (selectedTrip) {
      setIsViewingExpenses(true);
    }
  };

  const handleBackToDetails = () => {
    setIsViewingExpenses(false);
  }
  
  const handleSetActiveScreen = (screen: ScreenName) => {
    handleBackToList(); // Always go back to list view when changing tabs
    setActiveProfileScreen('main'); // Reset profile view when changing main tabs
    setActiveScreen(screen);
  }
  
  const handleNavigateToProfileSubScreen = (screen: ProfileSubScreen) => {
    setActiveProfileScreen(screen);
  };

  const renderProfileContent = () => {
    switch (activeProfileScreen) {
      case 'personal':
        return <PersonalInformationScreen onBack={() => setActiveProfileScreen('main')} />;
      case 'preferences':
        return <TravelPreferencesScreen onBack={() => setActiveProfileScreen('main')} />;
      case 'payment':
        return <PaymentMethodsScreen onBack={() => setActiveProfileScreen('main')} />;
      case 'notifications':
        return <NotificationSettingsScreen onBack={() => setActiveProfileScreen('main')} />;
      case 'main':
      default:
        return <ProfileScreen onLogout={handleLogout} userEmail={currentUserEmail} onNavigate={handleNavigateToProfileSubScreen} />;
    }
  }

  const renderContent = () => {
    if (selectedTrip) {
      if (isViewingExpenses) {
        return <ExpenseTrackingScreen trip={selectedTrip} onBack={handleBackToDetails} />;
      }
      return <TripDetailsScreen trip={selectedTrip} onBack={handleBackToList} onViewExpenses={handleViewExpenses} />;
    }

    switch (activeScreen) {
      case 'Dashboard':
        return <DashboardScreen onSelectTrip={handleSelectTrip} setActiveScreen={handleSetActiveScreen} />;
      case 'Explore':
        return <ExploreScreen />;
      case 'Chat':
        return <ChatScreen />;
      case 'Trips':
        return <TripsScreen onSelectTrip={handleSelectTrip} />;
      case 'Profile':
        return renderProfileContent();
      default:
        return <DashboardScreen onSelectTrip={handleSelectTrip} setActiveScreen={handleSetActiveScreen} />;
    }
  };

  if (!isAuthenticated) {
    return <AuthScreen onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <div className="h-screen w-screen bg-background font-sans text-text-primary flex flex-col">
      <main className="flex-1 overflow-y-auto pb-20">
        {renderContent()}
      </main>
      <BottomNav activeScreen={activeScreen} setActiveScreen={handleSetActiveScreen} />
    </div>
  );
};

export default App;