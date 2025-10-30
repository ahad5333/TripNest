import React from 'react';
import Screen from '../components/Screen';
import Icon from '../components/Icon';

interface PaymentMethodsScreenProps {
  onBack: () => void;
}

const savedCards = [
  { id: '1', type: 'Visa' as const, last4: '4242', expiry: '08/25' },
  { id: '2', type: 'Mastercard' as const, last4: '5555', expiry: '11/26' },
];

const PaymentMethodsScreen: React.FC<PaymentMethodsScreenProps> = ({ onBack }) => {

  const handleAddCard = () => {
    alert('Add New Card form would appear here.');
  };
  
  const handleRemoveCard = (cardId: string) => {
      if (confirm('Are you sure you want to remove this card?')) {
          alert(`Card with ID ${cardId} would be removed.`);
          // Here you would filter the state to remove the card
      }
  }

  return (
    <Screen title="Payment Methods" onBack={onBack}>
      <div className="space-y-6 max-w-2xl mx-auto">
        <p className="text-text-secondary">
          Manage your saved payment methods for faster and easier bookings.
        </p>

        <div className="space-y-4">
          {savedCards.map(card => (
            <div key={card.id} className="p-4 bg-surface border border-border rounded-xl shadow-sm flex items-center justify-between">
              <div className="flex items-center">
                <Icon name={card.type} className="h-8 w-8 text-text-primary mr-4" />
                <div>
                  <p className="font-semibold text-text-primary">{card.type} ending in {card.last4}</p>
                  <p className="text-sm text-text-secondary">Expires {card.expiry}</p>
                </div>
              </div>
              <button onClick={() => handleRemoveCard(card.id)} className="text-danger hover:text-opacity-80">
                <Icon name="Trash" className="h-6 w-6" />
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={handleAddCard}
          className="w-full flex items-center justify-center p-3 border-2 border-dashed border-border rounded-lg text-text-secondary hover:bg-background transition-colors"
        >
          <Icon name="Plus" className="h-5 w-5 mr-2" />
          Add New Card
        </button>
      </div>
    </Screen>
  );
};

export default PaymentMethodsScreen;
