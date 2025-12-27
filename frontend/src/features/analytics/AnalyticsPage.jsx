import { useQuery } from '@tanstack/react-query';
import { getHabits } from '../../lib/api';

import { BarChart3 } from 'lucide-react';

export function AnalyticsPage({ onBack }) {
    const { data: habits } = useQuery({
        queryKey: ['habits', 'analytics'],
        queryFn: () => getHabits({ pageParam: 0 })
    });

    // Aggregate all logs to get "Total Completions per Day"
    const getActivityMap = () => {
        const activity = {};
        habits?.forEach(habit => {
            habit.logs.forEach(log => {
                const dateKey = new Date(log.date).toDateString();
                activity[dateKey] = (activity[dateKey] || 0) + 1;
            });
        });
        return activity;
    };

    const activityMap = getActivityMap();

    // Generate last 30 days
    const days = Array.from({ length: 30 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (29 - i));
        return d;
    });

    return (
        <div className="max-w-md mx-auto w-full p-4 pb-24 animate-in slide-in-from-right">
            <header className="flex items-center gap-4 mb-8">
                <button onClick={onBack} className="text-gray-500 hover:text-foreground">
                    ← Back
                </button>
                <h1 className="text-2xl font-bold">Garden Stats</h1>
            </header>

            <div className="space-y-6">
                {/* Overall Activity Heatmap */}
                <section className="bg-card text-card-foreground p-6 rounded-xl border shadow-sm">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                        <BarChart3 size={20} />
                        Last 30 Days Activity
                    </h3>
                    <div className="flex flex-wrap gap-1 justify-center">
                        {days.map((date, i) => {
                            const dateKey = date.toDateString();
                            const count = activityMap[dateKey] || 0;
                            let colorClass = "bg-gray-100 dark:bg-gray-800";
                            if (count > 0) colorClass = "bg-green-200 dark:bg-green-900";
                            if (count > 2) colorClass = "bg-green-400 dark:bg-green-700";
                            if (count > 4) colorClass = "bg-green-600 dark:bg-green-500";

                            return (
                                <div
                                    key={i}
                                    className={`w-3 h-3 rounded-sm ${colorClass}`}
                                    title={`${dateKey}: ${count} completions`}
                                />
                            );
                        })}
                    </div>
                    <div className="flex justify-between text-xs text-gray-400 mt-2">
                        <span>30 days ago</span>
                        <span>Today</span>
                    </div>
                </section>

                {/* Per Habit Stats */}
                <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Habit Consistency</h3>
                    {habits?.map(habit => (
                        <div key={habit.id} className="bg-card p-4 rounded-xl border flex justify-between items-center">
                            <div>
                                <div className="font-medium">{habit.title}</div>
                                <div className="text-xs text-gray-500">Streak: {habit.current_streak || 0}</div>
                            </div>
                            <div className="flex gap-1">
                                {/* Show last 7 days dots for this habit */}
                                {Array.from({ length: 7 }, (_, i) => {
                                    const d = new Date();
                                    d.setDate(d.getDate() - (6 - i));
                                    // Check if logged on this day
                                    const isDone = habit.logs.some(l => new Date(l.date).toDateString() === d.toDateString());
                                    return (
                                        <div
                                            key={i}
                                            className={`w-2 h-2 rounded-full ${isDone ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'}`}
                                        />
                                    )
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
