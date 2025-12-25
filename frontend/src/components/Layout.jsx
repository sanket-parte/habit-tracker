import { Home, BarChart3, Settings, Trophy } from "lucide-react";
import { cn } from "../lib/utils";

export function Layout({ children, currentView, onViewChange }) {
    const navItems = [
        { id: "home", icon: Home, label: "Garden" },
        { id: "analytics", icon: BarChart3, label: "Stats" },
        { id: "leaderboard", icon: Trophy, label: "Ranks" },
        { id: "settings", icon: Settings, label: "Settings" },
    ];

    return (
        <div className="min-h-screen bg-background text-foreground font-sans pb-24 selection:bg-primary/20">
            <main className="max-w-md mx-auto w-full min-h-screen relative">
                {children}
            </main>

            {/* Bottom Navigation using Glassmorphism */}
            <nav className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-6 pt-2">
                <div className="max-w-md mx-auto relative">
                    <div className="glass absolute inset-0 rounded-2xl -z-10 shadow-lg border border-white/20 dark:border-white/5" />
                    <div className="flex justify-around items-center h-16 relative z-10">
                        {navItems.map((item) => {
                            const isActive = currentView === item.id;
                            const Icon = item.icon;

                            return (
                                <button
                                    key={item.id}
                                    onClick={() => onViewChange(item.id)}
                                    className={cn(
                                        "flex flex-col items-center justify-center w-14 h-14 rounded-xl transition-all duration-300",
                                        isActive
                                            ? "text-primary scale-110"
                                            : "text-muted-foreground hover:text-foreground active:scale-95"
                                    )}
                                >
                                    <div className={cn(
                                        "relative p-2 rounded-full transition-all duration-300",
                                        isActive ? "bg-primary/10" : "bg-transparent"
                                    )}>
                                        <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                                        {isActive && (
                                            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full animate-scale-in" />
                                        )}
                                    </div>
                                    {/* <span className="text-[10px] font-medium mt-1">{item.label}</span> */}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </nav>
        </div>
    );
}
