import React, { useState } from 'react';
import Icon from '../components/Icon';

interface AuthScreenProps {
  onAuthSuccess: (email: string) => void;
}

type AuthView = 'login' | 'signup' | 'forgotPassword' | 'resetSent';

const AuthScreen: React.FC<AuthScreenProps> = ({ onAuthSuccess }) => {
  const [authView, setAuthView] = useState<AuthView>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      onAuthSuccess(email);
    } else {
      alert('Please fill in all fields.');
    }
  };
  
  const handlePasswordResetRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      alert(`Password reset link sent to ${email}. (This is a demo)`);
      setAuthView('resetSent');
    } else {
      alert('Please enter your email address.');
    }
  };

  const handleSocialLogin = (provider: string) => {
    alert(`Signing in with ${provider}... (This is a demo)`);
    onAuthSuccess(`${provider.toLowerCase()}@example.com`);
  };

  const renderContent = () => {
    switch (authView) {
      case 'forgotPassword':
        return (
          <>
            <div className="text-center mb-8">
              <h1 className="font-heading text-4xl font-bold text-text-primary">Reset Password</h1>
              <p className="text-text-secondary mt-2">Enter your email to get a reset link.</p>
            </div>
            <form onSubmit={handlePasswordResetRequest} className="space-y-6">
              <div>
                <label className="text-sm font-medium text-text-secondary">Email</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com" 
                  className="w-full mt-1 p-3 bg-background dark:bg-surface border border-border rounded-lg focus:ring-primary focus:border-primary" 
                  required
                />
              </div>
              <button 
                type="submit" 
                className="w-full p-3 bg-primary text-white dark:text-text-primary font-bold rounded-lg hover:bg-opacity-90 transition-colors shadow-lg"
              >
                Send Reset Link
              </button>
            </form>
            <div className="text-center mt-6">
              <button onClick={() => setAuthView('login')} className="text-sm text-primary hover:underline">
                Back to Login
              </button>
            </div>
          </>
        );
      case 'resetSent':
        return (
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-accent/20">
                <Icon name="Envelope" className="h-8 w-8 text-accent" />
              </div>
              <h1 className="font-heading text-3xl font-bold text-text-primary mt-6">Check your email</h1>
              <p className="text-text-secondary mt-2">We've sent a password reset link to <br/><span className="font-semibold text-text-primary">{email}</span>.</p>
               <button 
                onClick={() => setAuthView('login')}
                className="w-full mt-8 p-3 bg-primary text-white dark:text-text-primary font-bold rounded-lg hover:bg-opacity-90 transition-colors shadow-lg"
              >
                Back to Login
              </button>
            </div>
        );
      case 'login':
      case 'signup':
      default:
        const isLoginView = authView === 'login';
        return (
          <>
            <div className="text-center mb-8">
              <h1 className="font-heading text-4xl font-bold text-text-primary">TripNest</h1>
              <p className="text-text-secondary mt-2">{isLoginView ? 'Welcome back, adventurer!' : 'Join the adventure!'}</p>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-6">
              {!isLoginView && (
                 <div>
                    <label className="text-sm font-medium text-text-secondary">Name</label>
                    <input type="text" placeholder="Your Name" className="w-full mt-1 p-3 bg-background dark:bg-surface border border-border rounded-lg focus:ring-primary focus:border-primary" />
                </div>
              )}
              <div>
                <label className="text-sm font-medium text-text-secondary">Email</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com" 
                  className="w-full mt-1 p-3 bg-background dark:bg-surface border border-border rounded-lg focus:ring-primary focus:border-primary" 
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-text-secondary">Password</label>
                <input 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)} 
                  placeholder="••••••••" 
                  className="w-full mt-1 p-3 bg-background dark:bg-surface border border-border rounded-lg focus:ring-primary focus:border-primary" 
                  required
                />
              </div>
              
              {isLoginView && (
                  <div className="flex justify-end text-sm">
                      <button type="button" onClick={() => setAuthView('forgotPassword')} className="font-medium text-primary hover:underline">Forgot password?</button>
                  </div>
              )}

              <button 
                type="submit" 
                className="w-full p-3 bg-primary text-white dark:text-text-primary font-bold rounded-lg hover:bg-opacity-90 transition-colors shadow-lg"
              >
                {isLoginView ? 'Login' : 'Create Account'}
              </button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-surface text-text-secondary">Or continue with</span>
              </div>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => handleSocialLogin('Google')}
                className="w-full flex items-center justify-center p-3 bg-surface border border-border rounded-lg hover:bg-background transition-colors text-text-primary"
                aria-label="Sign in with Google"
              >
                <Icon name="Google" className="h-6 w-6 mr-3" />
                <span className="font-semibold">Sign in with Google</span>
              </button>
              <button
                onClick={() => handleSocialLogin('GitHub')}
                className="w-full flex items-center justify-center p-3 bg-surface border border-border rounded-lg hover:bg-background transition-colors text-text-primary"
                aria-label="Sign in with GitHub"
              >
                <Icon name="GitHub" className="h-6 w-6 mr-3" />
                <span className="font-semibold">Sign in with GitHub</span>
              </button>
            </div>

            <div className="text-center mt-6">
              <button onClick={() => setAuthView(isLoginView ? 'signup' : 'login')} className="text-sm text-primary hover:underline">
                {isLoginView ? 'Need an account? Sign Up' : 'Already have an account? Login'}
              </button>
            </div>
          </>
        );
    }
  };

  return (
    <div className="h-screen w-screen bg-background flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-surface p-8 rounded-2xl shadow-2xl transition-all">
        {renderContent()}
      </div>
    </div>
  );
};

export default AuthScreen;