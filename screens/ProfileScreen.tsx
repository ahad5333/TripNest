import React, { useState, useRef } from 'react';
import Screen from '../components/Screen';
import Icon from '../components/Icon';
import CameraView from '../components/CameraView';
import { useTheme } from '../hooks/useTheme';
import { ProfileSubScreen } from '../types';

interface ProfileScreenProps {
  onLogout: () => void;
  userEmail: string;
  onNavigate: (screen: ProfileSubScreen) => void;
}

interface ProfileOptionProps {
  icon: any; 
  label: string;
  onClick: () => void;
  variant?: 'default' | 'danger';
}

const ProfileOption: React.FC<ProfileOptionProps> = ({ icon, label, onClick, variant = 'default' }) => {
    const baseClasses = "flex items-center justify-between w-full p-4 text-left transition-colors";
    const variantClasses = {
        default: "text-text-primary hover:bg-background",
        danger: "text-danger hover:bg-danger-surface",
    };
    const iconColorClass = variant === 'danger' ? 'text-danger' : 'text-text-primary';

    return (
        <button 
            className={`${baseClasses} ${variantClasses[variant]}`}
            onClick={onClick}
        >
            <div className="flex items-center">
                <Icon name={icon} className={`h-6 w-6 ${iconColorClass}`} />
                <span className={`ml-4 font-medium`}>{label}</span>
            </div>
            <Icon name="ChevronRight" className="h-5 w-5 text-text-secondary" />
        </button>
    );
};

interface AvatarOptionsModalProps {
    onClose: () => void;
    onChooseFile: () => void;
    onTakePhoto: () => void;
}

const AvatarOptionsModal: React.FC<AvatarOptionsModalProps> = ({ onClose, onChooseFile, onTakePhoto }) => {
    return (
        <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-end" onClick={onClose}>
            <div className="w-full max-w-md bg-surface rounded-t-2xl p-4 m-4" onClick={e => e.stopPropagation()}>
                <div className="text-center text-sm text-text-secondary mb-2 font-medium">Change Profile Photo</div>
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

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex items-center justify-between w-full p-4">
      <div className="flex items-center">
        <Icon name={theme === 'dark' ? 'Moon' : 'Sun'} className="h-6 w-6 text-text-primary" />
        <span className="ml-4 font-medium text-text-primary">Dark Mode</span>
      </div>
      <button
        onClick={toggleTheme}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          theme === 'dark' ? 'bg-primary' : 'bg-gray-300 dark:bg-border'
        }`}
        aria-label="Toggle dark mode"
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
};


const ProfileScreen: React.FC<ProfileScreenProps> = ({ onLogout, userEmail, onNavigate }) => {
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [showAvatarOptions, setShowAvatarOptions] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarClick = () => {
    setShowAvatarOptions(true);
  };

  const handleChooseFile = () => {
    setShowAvatarOptions(false);
    fileInputRef.current?.click();
  };

  const handleTakePhoto = () => {
    setShowAvatarOptions(false);
    setShowCamera(true);
  };
  
  const handleImageCapture = (imageDataUrl: string) => {
    setAvatarPreview(imageDataUrl);
    setShowCamera(false); // Close the camera immediately
    
    // Convert data URL to File object for saving/uploading
    (async () => {
      try {
          const response = await fetch(imageDataUrl);
          const blob = await response.blob();
          const file = new File([blob], `photo_${Date.now()}.jpg`, { type: 'image/jpeg' });
          setAvatarFile(file);
      } catch (error) {
          console.error("Error converting data URL to file:", error);
          alert("Could not process the captured image.");
      }
    })();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else if (file) {
      alert("Please select a valid image file.");
    }
  };
  
  const handleSaveAvatar = () => {
      if (avatarFile) {
          alert(`New avatar "${avatarFile.name}" saved!`);
          setAvatarFile(null); 
      }
  };

  return (
    <>
      <Screen title="Profile">
        <div className="space-y-6">
          
          {/* Profile Header */}
          <div className="flex flex-col items-center space-y-4 pt-4">
              <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
                   {avatarPreview ? (
                       <img 
                          src={avatarPreview}
                          alt="User Avatar" 
                          className="w-28 h-28 rounded-full shadow-lg border-4 border-surface object-cover"
                      />
                  ) : (
                      <div className="w-28 h-28 rounded-full shadow-lg border-4 border-surface bg-background flex items-center justify-center">
                          <Icon name="UserCircle" className="w-20 h-20 text-text-secondary" />
                      </div>
                  )}
                  <div
                      className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label="Change profile photo"
                  >
                      <Icon name="Camera" className="w-8 h-8"/>
                  </div>
              </div>
               <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept="image/png, image/jpeg, image/gif"
              />

              <div>
                  <h2 className="text-2xl font-bold font-heading text-text-primary text-center">Adventurer</h2>
                  <p className="text-text-secondary text-center">{userEmail}</p>
              </div>

              {avatarFile && (
                  <button 
                      onClick={handleSaveAvatar}
                      className="px-6 py-2 bg-accent text-white font-bold rounded-full hover:bg-opacity-90 transition-colors shadow-md"
                  >
                      Save Avatar
                  </button>
              )}
          </div>

          {/* Account Settings List */}
          <div className="bg-surface border border-border rounded-xl shadow-sm overflow-hidden">
              <div className="divide-y divide-border">
                  <ProfileOption icon="UserCircle" label="Personal Information" onClick={() => onNavigate('personal')} />
                  <ProfileOption icon="Cog" label="Travel Preferences" onClick={() => onNavigate('preferences')} />
                  <ProfileOption icon="Bell" label="Notification Settings" onClick={() => onNavigate('notifications')} />
                  <ProfileOption icon="CreditCard" label="Payment Methods" onClick={() => onNavigate('payment')} />
              </div>
          </div>

          {/* Appearance Settings */}
          <div className="bg-surface border border-border rounded-xl shadow-sm overflow-hidden">
            <ThemeToggle />
          </div>

          {/* Danger Zone */}
          <div className="bg-surface border border-border rounded-xl shadow-sm overflow-hidden">
              <ProfileOption icon="Trash" label="Account Deletion" onClick={() => alert('Account Deletion feature coming soon!')} variant="danger" />
          </div>

          {/* Logout Button */}
          <div>
            <button 
              onClick={onLogout}
              className="w-full flex items-center justify-center p-4 bg-surface border border-border rounded-xl shadow-sm text-danger font-bold hover:bg-danger-surface transition-colors"
            >
              <Icon name="Logout" className="h-6 w-6 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </Screen>
      {showAvatarOptions && (
        <AvatarOptionsModal 
            onClose={() => setShowAvatarOptions(false)}
            onChooseFile={handleChooseFile}
            onTakePhoto={handleTakePhoto}
        />
      )}
      {showCamera && (
          <CameraView 
              onCapture={handleImageCapture}
              onClose={() => setShowCamera(false)}
              facingMode="user"
          />
      )}
    </>
  );
};

export default ProfileScreen;