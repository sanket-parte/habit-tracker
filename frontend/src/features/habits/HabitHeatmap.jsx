import { useMemo } from 'react';
import { clsx } from 'clsx';
import { cn } from '../../lib/utils';

export function HabitHeatmap({ logs = [] }) {
    const days = useMemo(() => {
        const today = new Date();
        const last30Days = [];
        const logSet = new Set(logs.map(l => new Date(l.date).toDateString()));

        for (let i = 29; i >= 0; i--) {
            const d = new Date();
            d.setDate(today.getDate() - i);
            last30Days.push({
                date: d,
                isCompleted: logSet.has(d.toDateString())
            });
        }
        return last30Days;
    }, [logs]);

    return (
        <div className="flex gap-1 flex-wrap justify-center max-w-[200px] mt-4">
            {days.map((day, i) => (
                <div
                    key={i}
                    title={day.date.toDateString()}
                    className={cn(
                        "w-2 h-2 rounded-[1px] transition-all",
                        day.isCompleted
                            ? "bg-white/90 shadow-[0_0_4px_rgba(255,255,255,0.8)]"
                            : "bg-white/20"
                    )}
                />
            ))}
        </div>
    );
}
