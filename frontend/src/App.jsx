import { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getHabits, createHabit, completeHabit, getMe, deleteHabit, updateHabit } from './lib/api';
import { HabitCard } from './features/habits/HabitCard';
import { LoginPage } from './features/auth/LoginPage';
import { SignupPage } from './features/auth/SignupPage';
import { XPBar } from './features/gamification/XPBar';
import { PlantVisual } from './features/gamification/PlantVisual';
import { CreateHabitModal } from './features/habits/CreateHabitModal';
import { SettingsPage } from './features/settings/SettingsPage';
import { AnalyticsPage } from './features/analytics/AnalyticsPage';
import { Plus, Settings, BarChart3 } from 'lucide-react';

const queryClientInstance = new QueryClient();

function HabitList({ onLogout }) {
  const { data: habits, isLoading: habitsLoading } = useQuery({ queryKey: ['habits'], queryFn: getHabits });
  const { data: user, isLoading: userLoading } = useQuery({ queryKey: ['user'], queryFn: getMe });
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);
  const [view, setView] = useState('home'); // 'home' | 'settings'

  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: createHabit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] });
    },
  });

  const completeMutation = useMutation({
    mutationFn: completeHabit,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['habits'] });
      queryClient.invalidateQueries({ queryKey: ['user'] }); // Refresh XP/Level
      // Habit completed
    },
    onError: (error) => {
      // Logic handled in UI
      console.log(error);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteHabit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateHabit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] });
    },
  });

  if (view === 'settings') {
    return <SettingsPage onBack={() => setView('home')} onLogout={onLogout} />;
  }

  if (view === 'analytics') {
    return <AnalyticsPage onBack={() => setView('home')} />;
  }

  if (habitsLoading || userLoading) return <div className="p-8 text-center">Loading your garden...</div>;

  return (
    <div className="max-w-md mx-auto w-full pb-32 animate-in fade-in duration-500">
      <header className="px-4 py-6 flex justify-between items-center bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-40 shadow-sm mb-4 transition-all">
        <div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-green-600 bg-clip-text text-transparent">
            {user?.username}'s Garden
          </h1>
          <p className="text-xs text-gray-500">Keep blooming!</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-32">
            <XPBar xp={user?.xp || 0} level={user?.level || 1} />
          </div>
          <button
            onClick={() => setView('analytics')}
            className="text-gray-400 hover:text-primary transition-colors"
          >
            <BarChart3 size={22} />
          </button>
          <button
            onClick={() => setView('settings')}
            className="text-gray-400 hover:text-primary transition-colors"
          >
            <Settings size={22} />
          </button>
        </div>
      </header>

      <div className="px-4 mb-6">
        <PlantVisual level={user?.level || 1} />
      </div>

      <div className="px-4 space-y-4">
        {habits?.map(habit => (
          <HabitCard
            key={habit.id}
            habit={habit}
            onComplete={(id) => completeMutation.mutate(id)}
            onDelete={(id) => deleteMutation.mutate(id)}
            onEdit={(habit) => {
              setEditingHabit(habit);
              setIsCreateModalOpen(true);
            }}
            onArchive={(habit) => updateMutation.mutate({ id: habit.id, data: { is_archived: true } })}
          />
        ))}

        {habits?.length === 0 && (
          <div className="text-center py-10 opacity-50">
            <p>No habits yet. Plant your first seed!</p>
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <button
        onClick={() => {
          setEditingHabit(null);
          setIsCreateModalOpen(true);
        }}
        className="fixed bottom-6 right-6 w-14 h-14 bg-primary text-black rounded-full shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-transform z-50"
      >
        <Plus size={28} />
      </button>

      <CreateHabitModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setEditingHabit(null);
        }}
        initialData={editingHabit}
        onCreate={async (habitData) => {
          if (editingHabit) {
            await updateMutation.mutateAsync({ id: editingHabit.id, data: habitData });
          } else {
            await createMutation.mutateAsync(habitData);
          }
        }}
      />
    </div>
  );
}

function MainApp() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) setIsAuthenticated(true);
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  if (!isAuthenticated) {
    if (showSignup) {
      return <SignupPage onLoginSuccess={handleLoginSuccess} onSwitchToLogin={() => setShowSignup(false)} />;
    }
    return (
      <>
        <LoginPage onLoginSuccess={handleLoginSuccess} />
        <div className="text-center pb-8">
          <button onClick={() => setShowSignup(true)} className="text-sm text-primary hover:underline">
            Need an account? Sign up
          </button>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20">
      <HabitList onLogout={() => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
      }} />
    </div>
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
