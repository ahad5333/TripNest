import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Trip, Expense, ExpenseCategory } from '../types';
import Screen from '../components/Screen';
import Icon from '../components/Icon';
import { useMockData } from '../hooks/useMockData';
import geminiService from '../services/geminiService';
import CameraView from '../components/CameraView';

// --- Helper Components ---

const CATEGORIES: ExpenseCategory[] = ['Food', 'Transport', 'Accommodation', 'Activities', 'Other'];
const CATEGORY_ICONS: Record<ExpenseCategory, React.ReactNode> = {
  Food: <Icon name="Food" className="h-5 w-5 text-white" />,
  Transport: <Icon name="Transport" className="h-5 w-5 text-white" />,
  Accommodation: <Icon name="Bed" className="h-5 w-5 text-white" />,
  Activities: <Icon name="Ticket" className="h-5 w-5 text-white" />,
  Other: <Icon name="DotsHorizontal" className="h-5 w-5 text-white" />,
};
const CATEGORY_COLORS: Record<ExpenseCategory, string> = {
  Food: 'bg-red-500',
  Transport: 'bg-blue-500',
  Accommodation: 'bg-purple-500',
  Activities: 'bg-yellow-500',
  Other: 'bg-gray-500',
};

interface ReceiptOptionsModalProps {
    onClose: () => void;
    onChooseFile: () => void;
    onTakePhoto: () => void;
}

const ReceiptOptionsModal: React.FC<ReceiptOptionsModalProps> = ({ onClose, onChooseFile, onTakePhoto }) => {
    return (
        <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-end" onClick={onClose}>
            <div className="w-full max-w-md bg-surface rounded-t-2xl p-4 m-4" onClick={e => e.stopPropagation()}>
                <div className="text-center text-sm text-text-secondary mb-2 font-medium">Add Receipt</div>
                <div className="space-y-2">
                    <button onClick={onTakePhoto} className="w-full text-center p-3 bg-background rounded-lg text-primary font-semibold hover:bg-border transition-colors">
                        Take Photo
                    </button>
                    <button onClick={onChooseFile} className="w-full text-center p-3 bg-background rounded-lg text-primary font-semibold hover:bg-border transition-colors">
                        Choose from Library
                    </button>
                </div>
                <button onClick={onClose} className="w-full text-center p-3 mt-4 bg-border rounded-lg text-text-primary font-bold hover:bg-opacity-80 transition-colors">
                    Cancel
                </button>
            </div>
        </div>
    );
}

interface ExpenseFormModalProps {
  onClose: () => void;
  onSave: (expense: Omit<Expense, 'tripId'>) => void;
  expenseToEdit: Expense | null;
}

const ExpenseFormModal: React.FC<ExpenseFormModalProps> = ({ onClose, onSave, expenseToEdit }) => {
    const isEditMode = !!expenseToEdit;
    const [amount, setAmount] = useState(isEditMode ? String(expenseToEdit.amount) : '');
    const [description, setDescription] = useState(isEditMode ? expenseToEdit.description : '');
    const [category, setCategory] = useState<ExpenseCategory>(isEditMode ? expenseToEdit.category : 'Other');
    const [receipt, setReceipt] = useState<string | undefined>(isEditMode ? expenseToEdit.receiptImageUrl : undefined);
    const [date, setDate] = useState(isEditMode ? new Date(expenseToEdit.date).toLocaleDateString('en-CA') : new Date().toLocaleDateString('en-CA'));
    const [showCamera, setShowCamera] = useState(false);
    const [isOcrLoading, setIsOcrLoading] = useState(false);
    const [showReceiptOptions, setShowReceiptOptions] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = () => {
        if (!amount || !description) {
            alert('Please fill in both amount and description.');
            return;
        }
        const displayDate = new Date(date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        onSave({
            id: isEditMode ? expenseToEdit.id : `exp-${Date.now()}`,
            amount: parseFloat(amount),
            description,
            category,
            receiptImageUrl: receipt,
            date: displayDate,
        });
        onClose();
    };

    const processReceiptImage = (imageDataUrl: string) => {
        setShowCamera(false); // Close camera immediately
        setIsOcrLoading(true);
        setReceipt(imageDataUrl);

        (async () => {
            try {
                const details = await geminiService.extractReceiptDetails(imageDataUrl);
                if (details) {
                    setAmount(details.amount.toString());
                    setDescription(details.merchant || 'Scanned Receipt');
                    if (details.category && CATEGORIES.includes(details.category)) {
                        setCategory(details.category);
                    }
                    if (details.date) {
                        const localDate = new Date(details.date.replace(/-/g, '/'));
                        if (!isNaN(localDate.getTime())) {
                            setDate(localDate.toLocaleDateString('en-CA'));
                        }
                    }
                } else {
                    alert("Could not automatically extract details. Please enter them manually.");
                }
            } catch (error) {
                console.error("OCR process failed:", error);
                alert("An error occurred during receipt analysis. Please enter details manually.");
            } finally {
                setIsOcrLoading(false);
            }
        })();
    };
    
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    if (typeof reader.result === 'string') {
                        processReceiptImage(reader.result);
                    }
                };
                reader.onerror = () => {
                    console.error("Error reading file");
                    alert("There was an error reading the selected file.");
                };
                reader.readAsDataURL(file);
            } else {
                alert("Please select a valid image file.");
            }
        }
        if (event.target) {
            event.target.value = '';
        }
    };

    const handleChooseFile = () => {
        setShowReceiptOptions(false);
        fileInputRef.current?.click();
    };

    const handleTakePhoto = () => {
        setShowReceiptOptions(false);
        setShowCamera(true);
    };

    if (showCamera) {
        return <CameraView onCapture={processReceiptImage} onClose={() => setShowCamera(false)} facingMode="environment" />;
    }

    return (
        <div className="fixed inset-0 bg-black/40 z-40 flex justify-center items-end" onClick={onClose}>
            <div className="w-full bg-surface rounded-t-2xl p-6 space-y-4" onClick={e => e.stopPropagation()}>
                <h2 className="font-heading text-2xl font-bold text-text-primary text-center">{isEditMode ? 'Edit Expense' : 'Add Expense'}</h2>
                <div className="space-y-4">
                     <div>
                        <label className="text-sm font-medium text-text-secondary">Amount</label>
                        <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" className="w-full mt-1 p-3 bg-background dark:bg-surface border border-border rounded-lg focus:ring-primary focus:border-primary disabled:bg-border" disabled={isOcrLoading} />
                    </div>
                     <div>
                        <label className="text-sm font-medium text-text-secondary">Description</label>
                        <input type="text" value={description} onChange={e => setDescription(e.target.value)} placeholder="e.g., Dinner with friends" className="w-full mt-1 p-3 bg-background dark:bg-surface border border-border rounded-lg focus:ring-primary focus:border-primary disabled:bg-border" disabled={isOcrLoading}/>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-text-secondary">Date</label>
                        <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full mt-1 p-3 bg-background dark:bg-surface border border-border rounded-lg focus:ring-primary focus:border-primary disabled:bg-border" disabled={isOcrLoading} />
                    </div>
                     <div>
                        <label className="text-sm font-medium text-text-secondary">Category</label>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {CATEGORIES.map(cat => (
                                <button key={cat} onClick={() => setCategory(cat)} className={`px-3 py-1.5 text-sm font-semibold rounded-full transition-colors disabled:opacity-50 ${category === cat ? 'bg-primary text-white dark:text-text-primary' : 'bg-background dark:bg-border text-text-primary'}`} disabled={isOcrLoading}>
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="relative">
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className="hidden"
                            accept="image/png, image/jpeg, image/gif"
                        />
                        {receipt ? (
                            <div className="relative w-24 h-24 mx-auto">
                                <img src={receipt} alt="Receipt preview" className="w-full h-full object-cover rounded-lg"/>
                                {isOcrLoading && (
                                    <div className="absolute inset-0 bg-black/60 flex flex-col justify-center items-center rounded-lg text-white text-xs">
                                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        <span className="mt-2">Analyzing...</span>
                                    </div>
                                )}
                                {!isEditMode && <button onClick={() => setReceipt(undefined)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold" disabled={isOcrLoading}>X</button>}
                            </div>
                        ) : (
                            <button onClick={() => setShowReceiptOptions(true)} className="w-full flex items-center justify-center gap-2 p-3 border-2 border-dashed border-border rounded-lg text-text-secondary hover:bg-background transition-colors disabled:opacity-50" disabled={isOcrLoading}>
                                <Icon name="Camera" className="h-5 w-5" />
                                Add Receipt
                            </button>
                        )}
                    </div>
                </div>
                <button onClick={handleSubmit} className="w-full p-4 bg-primary text-white dark:text-text-primary font-bold rounded-lg hover:bg-opacity-90 transition-colors disabled:bg-gray-400" disabled={isOcrLoading}>
                    {isEditMode ? 'Save Changes' : 'Add Expense'}
                </button>
            </div>
             {showReceiptOptions && (
                <ReceiptOptionsModal 
                    onClose={() => setShowReceiptOptions(false)}
                    onChooseFile={handleChooseFile}
                    onTakePhoto={handleTakePhoto}
                />
            )}
        </div>
    );
};

// --- Main Screen Component ---

interface ExpenseTrackingScreenProps {
  trip: Trip;
  onBack: () => void;
}

const ExpenseTrackingScreen: React.FC<ExpenseTrackingScreenProps> = ({ trip, onBack }) => {
  const { expenses: allExpenses } = useMockData();
  const [tripExpenses, setTripExpenses] = useState<Expense[]>(() => allExpenses.filter(e => e.tripId === trip.id).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  const [modalState, setModalState] = useState<{ isOpen: boolean; expenseToEdit: Expense | null }>({ isOpen: false, expenseToEdit: null });
  const [budget, setBudget] = useState(trip.budget);
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [newBudgetValue, setNewBudgetValue] = useState(String(trip.budget));

  const totalSpent = useMemo(() => {
    return tripExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  }, [tripExpenses]);

  const expensesByCategory = useMemo(() => {
    const categoryMap: { [key in ExpenseCategory]?: number } = {};
    tripExpenses.forEach(expense => {
        categoryMap[expense.category] = (categoryMap[expense.category] || 0) + expense.amount;
    });
    return (Object.keys(categoryMap) as ExpenseCategory[])
        .map(category => ({ category, amount: categoryMap[category]! }))
        .sort((a, b) => b.amount - a.amount);
  }, [tripExpenses]);

  const budgetRemaining = budget - totalSpent;
  const spentPercentage = budget > 0 ? Math.min((totalSpent / budget) * 100, 100) : 0;

  const handleSaveExpense = (expenseData: Omit<Expense, 'tripId'>) => {
    const isEditing = tripExpenses.some(e => e.id === expenseData.id);
    if (isEditing) {
        setTripExpenses(prev => prev.map(e => e.id === expenseData.id ? { ...e, ...expenseData } : e)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    } else {
        const newExpense: Expense = {
          ...expenseData,
          tripId: trip.id,
        };
        setTripExpenses(prev => [newExpense, ...prev]
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    }
  };

  const handleDeleteExpense = (expenseId: string) => {
    if (window.confirm("Are you sure you want to delete this expense?")) {
        setTripExpenses(prev => prev.filter(e => e.id !== expenseId));
    }
  };
  
  const handleOpenModal = (expense: Expense | null) => {
      setModalState({ isOpen: true, expenseToEdit: expense });
  };

  const handleEditBudget = () => {
    setNewBudgetValue(budget.toString());
    setIsEditingBudget(true);
  };

  const handleSaveBudget = () => {
    const newAmount = parseFloat(newBudgetValue);
    if (!isNaN(newAmount) && newAmount >= 0) {
      setBudget(newAmount);
      setIsEditingBudget(false);
    } else {
      alert("Please enter a valid, non-negative number for the budget.");
    }
  };

  return (
    <>
      <Screen title="Expense Tracking" onBack={onBack}>
        <div className="space-y-6">
          {/* Budget Summary */}
          <div className="p-6 bg-surface border border-border rounded-xl shadow-sm flex flex-col items-center space-y-4">
              <div className="relative w-40 h-40">
                  <svg className="w-full h-full" viewBox="0 0 36 36">
                      <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" className="stroke-current text-border" strokeWidth="3" fill="none" />
                      <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" className={`stroke-current ${spentPercentage > 90 ? 'text-danger' : 'text-accent'} transition-colors duration-500`} strokeWidth="3" fill="none" strokeDasharray={`${spentPercentage}, 100`} strokeLinecap="round" transform="rotate(-90 18 18)" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <span className="font-bold text-3xl font-heading text-text-primary">${totalSpent.toFixed(2)}</span>
                      <span className="text-sm text-text-secondary">Spent</span>
                  </div>
              </div>
              <div className="w-full bg-background dark:bg-border rounded-full h-2.5">
                  <div className={`h-2.5 rounded-full transition-all duration-500 ease-in-out ${spentPercentage > 90 ? 'bg-danger' : 'bg-accent'}`} style={{ width: `${spentPercentage}%` }} role="progressbar" aria-valuenow={spentPercentage} aria-valuemin={0} aria-valuemax={100} aria-label="Budget spent percentage"></div>
              </div>
              <div className="w-full flex justify-between items-center text-sm font-medium text-text-secondary">
                  {isEditingBudget ? (
                    <div className="w-full flex items-center gap-2">
                      <input type="number" value={newBudgetValue} onChange={(e) => setNewBudgetValue(e.target.value)} className="w-full p-2 bg-background border border-border rounded-md text-text-primary focus:ring-primary focus:border-primary" placeholder="New Budget" autoFocus />
                      <button onClick={handleSaveBudget} className="px-3 py-1 bg-accent text-white text-xs font-bold rounded-md hover:bg-opacity-80">Save</button>
                      <button onClick={() => setIsEditingBudget(false)} className="px-3 py-1 bg-border text-text-secondary text-xs font-bold rounded-md hover:bg-opacity-80">Cancel</button>
                    </div>
                  ) : (
                    <>
                      <span className="flex items-center">
                        Budget: ${budget.toFixed(2)}
                        <button onClick={handleEditBudget} className="ml-2 text-text-secondary hover:text-primary p-1 rounded-full" aria-label="Edit budget">
                            <Icon name="Pencil" className="h-4 w-4" />
                        </button>
                      </span>
                      <span>Remaining: ${budgetRemaining.toFixed(2)}</span>
                    </>
                  )}
              </div>
          </div>
          
          {/* Category Breakdown */}
          <div>
            <h2 className="text-xl font-heading font-semibold text-text-primary mb-3">Spending by Category</h2>
            {expensesByCategory.length > 0 ? (
              <div className="space-y-4 bg-surface border border-border p-4 rounded-xl shadow-sm">
                {expensesByCategory.map(({ category, amount }) => (
                  <div key={category}>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center"><div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${CATEGORY_COLORS[category]}`}>{CATEGORY_ICONS[category]}</div><span className="text-sm font-semibold text-text-primary">{category}</span></div>
                      <span className="text-sm font-bold text-text-primary">${amount.toFixed(2)}</span>
                    </div>
                    <div className="w-full bg-background dark:bg-border rounded-full h-2 mt-2"><div className={`${CATEGORY_COLORS[category]} h-2 rounded-full`} style={{ width: `${totalSpent > 0 ? (amount / totalSpent) * 100 : 0}%` }}></div></div>
                  </div>
                ))}
              </div>
            ) : (<div className="text-center py-4 px-4 bg-surface border border-border rounded-lg shadow-sm"><p className="text-sm text-text-secondary">No spending to categorize yet.</p></div>)}
          </div>

          {/* Expenses List */}
          <div>
            <h2 className="text-xl font-heading font-semibold text-text-primary mb-3">Recent Transactions</h2>
            {tripExpenses.length > 0 ? (
              <div className="space-y-3">
                {tripExpenses.map(expense => (
                  <div key={expense.id} className="flex items-center bg-surface border border-border p-3 rounded-lg shadow-sm group">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${CATEGORY_COLORS[expense.category]}`}>{CATEGORY_ICONS[expense.category]}</div>
                     <div className="flex-1 ml-3 overflow-hidden"><p className="font-semibold text-text-primary truncate">{expense.description}</p><p className="text-sm text-text-secondary">{expense.date}</p></div>
                    <div className="flex items-center ml-3">
                        {expense.receiptImageUrl && <Icon name="Receipt" className="h-5 w-5 text-text-secondary mr-2" />}
                        <p className="font-bold text-text-primary">${expense.amount.toFixed(2)}</p>
                        <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleOpenModal(expense)} className="ml-2 text-text-secondary hover:text-primary p-1 rounded-full" aria-label={`Edit expense: ${expense.description}`}><Icon name="Pencil" className="h-5 w-5" /></button>
                            <button onClick={() => handleDeleteExpense(expense.id)} className="ml-1 text-text-secondary hover:text-danger p-1 rounded-full" aria-label={`Delete expense: ${expense.description}`}><Icon name="Trash" className="h-5 w-5" /></button>
                        </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (<div className="text-center py-8 px-4 bg-surface border border-border rounded-lg shadow-sm"><p className="text-text-secondary">No expenses logged for this trip yet.</p></div>)}
          </div>
        </div>
      </Screen>
      <button onClick={() => handleOpenModal(null)} className="fixed bottom-24 right-6 w-16 h-16 bg-primary rounded-full text-white dark:text-text-primary shadow-lg flex items-center justify-center transform hover:scale-110 transition-transform z-30" aria-label="Add new expense">
        <Icon name="Plus" className="w-8 h-8"/>
      </button>
      {modalState.isOpen && <ExpenseFormModal onClose={() => setModalState({ isOpen: false, expenseToEdit: null })} onSave={handleSaveExpense} expenseToEdit={modalState.expenseToEdit} />}
    </>
  );
};

export default ExpenseTrackingScreen;