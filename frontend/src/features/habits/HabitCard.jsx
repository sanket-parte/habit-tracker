import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { Check, Flame, Trash2, MoreVertical, Edit2, Archive } from 'lucide-react';
import { clsx } from 'clsx';
import { cn } from '../../lib/utils';
import { useState } from 'react';

export function HabitCard({ habit, onComplete, onDelete, onEdit, onArchive }) {
    const x = useMotionValue(0);
    const xInput = [0, 100];
    const bgOpacity = useTransform(x, xInput, [0, 1]);
    const scale = useTransform(x, xInput, [1, 1.05]);

    // Swipe threshold logic
    const handleDragEnd = (_, info) => {
        if (info.offset.x > 80 && !habit.is_completed_today) {
            if (navigator.vibrate) navigator.vibrate(50);
            onComplete(habit.id);
        }
    };

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <div className="relative mb-4 group touch-pan-y">
            {/* Success Background Gradient */}
            <motion.div
                style={{ opacity: bgOpacity }}
                className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/5 rounded-2xl flex items-center justify-start pl-6 text-primary z-0 pointer-events-none"
            >
                <motion.div style={{ scale }}>
                    <Check size={32} strokeWidth={3} />
                </motion.div>
            </motion.div>

            {/* Main Card */}
            <motion.div
                style={{ x }}
                drag={habit.is_completed_today ? false : "x"}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={{ right: 0.2, left: 0.05 }}
                onDragEnd={handleDragEnd}
                whileTap={habit.is_completed_today ? {} : { scale: 0.98 }}
                className={cn(
                    "relative p-5 rounded-2xl border transition-all duration-300 z-10 flex items-center justify-between overflow-hidden",
                    // Glassmorphic styles
                    "bg-card/90 backdrop-blur-md shadow-sm dark:bg-card/60",
                    habit.is_completed_today
                        ? "border-primary/30 bg-primary/5 dark:bg-primary/10"
                        : "border-border/50 hover:border-primary/30 hover:shadow-md"
                )}
            >
                {/* Progress Bar Background for "Fill" effect could go here */}

                <div className="flex items-center gap-5">
                    {/* Icon Container */}
                    <div className={cn(
                        "w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-inner shrink-0 transition-all duration-500",
                        habit.is_completed_today ? "bg-primary text-primary-foreground scale-110 rotate-3" : "bg-secondary text-secondary-foreground"
                    )}>
                        {habit.is_completed_today ? <Check size={28} strokeWidth={3} /> : (habit.emoji || '🌱')}
                    </div>

                    <div className="flex flex-col">
                        <h3 className={cn(
                            "font-bold text-lg leading-tight transition-colors duration-300",
                            habit.is_completed_today ? "text-primary line-through decoration-2 decoration-primary/30" : "text-foreground"
                        )}>
                            {habit.title}
                        </h3>
                        <p className="text-sm text-muted-foreground font-medium mt-0.5">
                            {habit.description || "Daily Goal"}
                        </p>
                    </div>
                </div>

                {/* Actions / Stats */}
                <div className="flex items-center gap-1">
                    {/* Streak Badge */}
                    <div className={cn(
                        "flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold mr-2 border",
                        habit.current_streak > 0
                            ? "bg-orange-500/10 text-orange-600 border-orange-500/20 dark:text-orange-400"
                            : "bg-secondary text-muted-foreground border-transparent"
                    )}>
                        <Flame size={14} className={cn(habit.current_streak > 0 && "fill-orange-600 dark:fill-orange-400")} />
                        <span>{habit.current_streak || 0}</span>
                    </div>

                    {/* Menu Trigger */}
                    <div className="relative">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-full transition-colors"
                        >
                            <MoreVertical size={20} />
                        </button>

                        <AnimatePresence>
                            {isMenuOpen && (
                                <>
                                    <div className="fixed inset-0 z-20" onClick={() => setIsMenuOpen(false)} />
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.9, y: 10 }}
                                        className="absolute right-0 top-full mt-2 w-40 bg-popover/95 backdrop-blur-xl border border-border rounded-xl shadow-xl z-30 p-1.5 flex flex-col gap-1"
                                    >
                                        <button
                                            onClick={(e) => { e.stopPropagation(); setIsMenuOpen(false); onEdit(habit); }}
                                            className="w-full text-left px-3 py-2 text-sm font-medium rounded-lg hover:bg-secondary text-foreground flex items-center gap-2 transition-colors"
                                        >
                                            <Edit2 size={16} /> Edit
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setIsMenuOpen(false);
                                                if (window.confirm('Archive this habit?')) onArchive(habit);
                                            }}
                                            className="w-full text-left px-3 py-2 text-sm font-medium rounded-lg hover:bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center gap-2 transition-colors"
                                        >
                                            <Archive size={16} /> Archive
                                        </button>
                                        <div className="h-px bg-border my-0.5" />
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setIsMenuOpen(false);
                                                if (window.confirm('Delete habit?')) onDelete(habit.id);
                                            }}
                                            className="w-full text-left px-3 py-2 text-sm font-medium rounded-lg hover:bg-destructive/10 text-destructive flex items-center gap-2 transition-colors"
                                        >
                                            <Trash2 size={16} /> Delete
                                        </button>
                                    </motion.div>
                                </>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Quick Complete Button (Mobile Fallback if swipe isn't obvious) */}
                    {!habit.is_completed_today && (
                        <button
                            onClick={(e) => { e.stopPropagation(); onComplete(habit.id); }}
                            className="ml-1 w-10 h-10 rounded-full bg-secondary hover:bg-primary/20 hover:text-primary flex items-center justify-center transition-all md:hidden"
                        >
                            <Check size={20} />
                        </button>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
