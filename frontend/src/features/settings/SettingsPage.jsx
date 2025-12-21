import { useQuery } from '@tanstack/react-query';
import { getMe } from '../../lib/api';
import { Moon, Sun, LogOut, User as UserIcon } from 'lucide-react';
import { useState, useEffect } from 'react';

export function SettingsPage({ onLogout, onBack }) {
    const { data: user } = useQuery({ queryKey: ['user'], queryFn: getMe });
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'system');

    useEffect(() => {
        const root = window.document.documentElement;
        if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    return (
        <div className="max-w-md mx-auto w-full p-4 pb-24 animate-in slide-in-from-right">
            <header className="flex items-center gap-4 mb-8">
                <button onClick={onBack} className="text-gray-500 hover:text-foreground">
                    ← Back
                </button>
                <h1 className="text-2xl font-bold">Settings</h1>
            </header>

            <div className="space-y-6">
                {/* Profile Section */}
                <section className="bg-card text-card-foreground p-6 rounded-xl border shadow-sm">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-16 h-16 bg-primary/20 text-primary rounded-full flex items-center justify-center text-3xl">
                            <UserIcon size={32} />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold">{user?.username}</h2>
                            <p className="text-sm text-gray-500">{user?.email}</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-center">
                        <div className="bg-background p-3 rounded-lg">
                            <div className="text-2xl font-bold">{user?.level}</div>
                            <div className="text-xs text-gray-500">Level</div>
                        </div>
                        <div className="bg-background p-3 rounded-lg">
                            <div className="text-2xl font-bold">{user?.xp}</div>
                            <div className="text-xs text-gray-500">XP</div>
                        </div>
                    </div>
                </section>

                {/* Theme Section */}
                <section className="bg-card text-card-foreground p-6 rounded-xl border shadow-sm">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                        Appearance
                    </h3>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setTheme('light')}
                            className={`flex-1 p-3 rounded-lg border flex flex-col items-center gap-2 transition-colors ${theme === 'light' ? 'border-primary bg-primary/10 text-primary' : 'hover:bg-gray-50'}`}
                        >
                            <Sun size={20} />
                            <span className="text-sm">Light</span>
                        </button>
                        <button
                            onClick={() => setTheme('dark')}
                            className={`flex-1 p-3 rounded-lg border flex flex-col items-center gap-2 transition-colors ${theme === 'dark' ? 'border-primary bg-primary/10 text-primary' : 'hover:bg-gray-50'}`}
                        >
                            <Moon size={20} />
                            <span className="text-sm">Dark</span>
                        </button>
                    </div>
                </section>

                <button
                    onClick={onLogout}
                    className="w-full p-4 rounded-xl border border-red-200 text-red-500 flex items-center justify-center gap-2 hover:bg-red-50 transition-colors"
                >
                    <LogOut size={20} />
                    Log Out
                </button>
            </div>

            <div className="text-center mt-8 text-xs text-gray-400">
                Ver 0.1.0 • Built with ❤️
            </div>
        </div>
    );
}
