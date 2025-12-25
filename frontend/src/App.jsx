import { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LoginPage } from './features/auth/LoginPage';
import { SignupPage } from './features/auth/SignupPage';
import { SettingsPage } from './features/settings/SettingsPage';
import { AnalyticsPage } from './features/analytics/AnalyticsPage';
import { HabitList } from './features/habits/HabitList';
import { Layout } from './components/Layout';
import { AnimatePresence, motion } from 'framer-motion';

const queryClientInstance = new QueryClient();

function MainApp() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [currentView, setCurrentView] = useState('home');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) setIsAuthenticated(true);
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    if (showSignup) {
      return <SignupPage onLoginSuccess={handleLoginSuccess} onSwitchToLogin={() => setShowSignup(false)} />;
    }
    return (
      <div className="min-h-screen bg-background flex flex-col justify-center items-center p-4">
        <div className="w-full max-w-md space-y-8 animate-fade-in-up">
          <LoginPage onLoginSuccess={handleLoginSuccess} />
          <div className="text-center">
            <button onClick={() => setShowSignup(true)} className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Don't have an account? <span className="font-semibold underline decoration-primary/50">Sign up</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <HabitList />;
      case 'settings':
        return <SettingsPage onBack={() => setCurrentView('home')} onLogout={handleLogout} />;
      case 'analytics':
        return <AnalyticsPage onBack={() => setCurrentView('home')} />;
      case 'leaderboard':
        return (
          <div className="p-8 text-center min-h-[50vh] flex flex-col items-center justify-center text-muted-foreground">
            <span className="text-4xl mb-4">🏆</span>
            <h2 className="text-lg font-semibold mb-2">Leaderboard Coming Soon!</h2>
            <p className="text-sm">Compete with friends to grow the best garden.</p>
          </div>
        );
      default:
        return <HabitList />;
    }
  };

  return (
    <Layout currentView={currentView} onViewChange={setCurrentView}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentView}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {renderView()}
        </motion.div>
      </AnimatePresence>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClientInstance}>
      <MainApp />
    </QueryClientProvider>
  )
}

export default App
