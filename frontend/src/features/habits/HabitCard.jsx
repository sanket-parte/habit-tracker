import { motion, useMotionValue, useTransform } from 'framer-motion';
import { Check, Flame, Trash2, MoreVertical } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
    return twMerge(clsx(inputs));
}

export function HabitCard({ habit, onComplete, onDelete, onEdit, onArchive }) {
    const x = useMotionValue(0);
    const bgOpacity = useTransform(x, [0, 100], [0, 1]);
    const xInput = [0, 100];
    // Interpolate background color for a subtle effect or just use static bg

    // Reset spring animation
    const handleDragEnd = (_, info) => {
        if (info.offset.x > 100) {
            onComplete(habit.id);
            // Optional: Vibrate?
            if (navigator.vibrate) navigator.vibrate(50);
        }
    };

    return (
        <div className="relative mb-3 group hover:z-40">
            {/* Background Layer (Success State) */}
            <motion.div
                style={{ opacity: bgOpacity }}
                className="absolute inset-0 bg-green-500 rounded-xl flex items-center justify-start pl-6 text-white"
            >
                <Check size={32} strokeWidth={3} />
            </motion.div>

            {/* Foreground Card */}
            <motion.div
                style={{ x }}
                drag={habit.is_completed_today ? false : "x"} // Disable drag if completed
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={{ right: 0.5, left: 0 }}
                onDragEnd={handleDragEnd}
                whileTap={habit.is_completed_today ? {} : { scale: 0.98 }}
                className={cn(
                    "relative bg-card text-card-foreground p-4 rounded-xl border shadow-sm flex items-center justify-between z-10 select-none touch-pan-y transition-colors",
                    habit.is_completed_today ? "border-green-500 bg-green-50 dark:bg-green-900/10" : "border-gray-100 dark:border-gray-800"
                )}
            >
                <div className="flex items-center gap-4">
                    <div
                        className="w-12 h-12 rounded-full flex items-center justify-center text-xl shrink-0"
                        style={{ backgroundColor: habit.color + '20', color: habit.color }}
                    >
                        {habit.is_completed_today ? '✅' : '🌱'}
                    </div>
                    <div>
                        <h3 className={cn("font-semibold text-lg leading-tight", habit.is_completed_today && "text-green-700 dark:text-green-400")}>
                            {habit.title}
                        </h3>
                        <p className="text-sm text-gray-500">{habit.description || "Daily"}</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex items-center text-orange-500 text-sm font-bold">
                        <Flame size={16} className="fill-orange-500 mr-1" />
                        <span>{habit.current_streak || 0}</span>
                    </div>

                    <div className="relative group/menu">
                        <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                            <MoreVertical size={20} />
                        </button>
                        <div className="absolute right-0 top-full mt-1 w-32 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden hidden group-hover/menu:block z-20">
                            <button
                                onClick={(e) => { e.stopPropagation(); onEdit(habit); }}
                                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
                            >
                                <span className="text-gray-700 dark:text-gray-200">Edit</span>
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (window.confirm('Archive this habit?')) {
                                        onArchive(habit);
                                    }
                                }}
                                className="w-full text-left px-4 py-2 text-sm hover:bg-orange-50 dark:hover:bg-orange-900/20 text-orange-500 flex items-center gap-2"
                            >
                                <span className="text-orange-600 dark:text-orange-400">Archive</span>
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (window.confirm('Delete habit?')) onDelete(habit.id);
                                }}
                                className="w-full text-left px-4 py-2 text-sm hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 flex items-center gap-2"
                            >
                                <span>Delete</span>
                            </button>
                        </div>
                    </div>

                    <button
                        onClick={() => !habit.is_completed_today && onComplete(habit.id)}
                        disabled={habit.is_completed_today}
                        className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
                            habit.is_completed_today
                                ? "bg-green-500 text-white cursor-default"
                                : "bg-gray-100 dark:bg-gray-800 hover:bg-primary hover:text-white active:scale-95"
                        )}
                        aria-label={habit.is_completed_today ? "Completed" : "Complete habit"}
                    >
                        <Check size={20} />
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
