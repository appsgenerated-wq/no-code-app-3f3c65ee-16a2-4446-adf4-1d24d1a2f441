import React, { useState, useEffect } from 'react';
import Manifest from '@mnfst/sdk';
import LandingPage from './screens/LandingPage';
import DashboardPage from './screens/DashboardPage';
import config from './constants.js';
import { testBackendConnection } from './services/apiService.js';
import './index.css';

function App() {
  const [user, setUser] = useState(null);
  const [currentScreen, setCurrentScreen] = useState(null); // Start as null to show loading
  const [backendConnected, setBackendConnected] = useState(false);
  const manifest = new Manifest(config.BACKEND_URL);

  useEffect(() => {
    const initializeApp = async () => {
      console.log('🚀 [APP] Starting backend connection test...');
      const connectionResult = await testBackendConnection();
      setBackendConnected(connectionResult.success);

      if (connectionResult.success) {
        console.log('✅ [APP] Backend connection successful.');
        try {
          const loggedInUser = await manifest.from('User').me();
          setUser(loggedInUser);
          setCurrentScreen('dashboard');
        } catch (error) {
          console.log('ℹ️ [APP] No active session found.');
          setUser(null);
          setCurrentScreen('landing');
        }
      } else {
        console.error('❌ [APP] Backend connection failed.');
        setCurrentScreen('landing'); // Still show landing page but with error indicator
      }
    };

    initializeApp();
  }, []);

  const login = async (email, password) => {
    try {
      await manifest.login(email, password);
      const loggedInUser = await manifest.from('User').me();
      setUser(loggedInUser);
      setCurrentScreen('dashboard');
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed. Please check your credentials.');
    }
  };

  const logout = async () => {
    await manifest.logout();
    setUser(null);
    setCurrentScreen('landing');
  };

  if (currentScreen === null) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
        <p>Initializing Lunar Research Module...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="fixed top-4 right-4 z-50 flex items-center space-x-2">
        <div className={`w-3 h-3 rounded-full ${backendConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
        <span className="text-xs text-gray-600">{backendConnected ? 'System Online' : 'Connection Lost'}</span>
      </div>

      {currentScreen === 'landing' ? (
        <LandingPage onLogin={login} />
      ) : (
        <DashboardPage user={user} onLogout={logout} manifest={manifest} />
      )}
    </div>
  );
}

export default App;
