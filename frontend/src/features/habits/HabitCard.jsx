import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { Check, Flame, Trash2, MoreVertical, Edit2, Archive, RotateCcw, MessageSquareHeart } from 'lucide-react';
import { clsx } from 'clsx';
import { cn } from '../../lib/utils';
import { useState } from 'react';

export function HabitCard({ habit, onComplete, onDelete, onEdit, onArchive }) {
    const [isFlipped, setIsFlipped] = useState(false);
    const [showReflection, setShowReflection] = useState(false);
    const [reflectionNote, setReflectionNote] = useState('');
    const [reflectionMood, setReflectionMood] = useState('😊');

    // Drag Logic
    const x = useMotionValue(0);
    const xInput = [0, 100];
    const bgOpacity = useTransform(x, xInput, [0, 1]);
    const scale = useTransform(x, xInput, [1, 1.05]);

    const handleDragEnd = (_, info) => {
        if (info.offset.x > 80 && !habit.is_completed_today) {
            if (navigator.vibrate) navigator.vibrate(50);
            // Trigger Reflection intead of immediate complete if desired
            setShowReflection(true);
        }
    };

    const handleFinalComplete = () => {
        onComplete(habit.id, { note: reflectionNote, mood: reflectionMood });
        setShowReflection(false);
    };

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <div className="relative mb-4 group perspective-1000">
            {/* Reflection Modal Overlay */}
            <AnimatePresence>
                {showReflection && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="bg-card dark:bg-slate-900 w-full max-w-sm rounded-3xl p-6 shadow-2xl border border-primary/20">
                            <h3 className="text-xl font-bold bg-gradient-to-r from-primary to-emerald-500 bg-clip-text text-transparent mb-2">
                                Great Job! 🎉
                            </h3>
                            <p className="text-muted-foreground text-sm mb-4">Take a moment to reflect.</p>

                            <div className="flex justify-center gap-4 text-3xl mb-6">
                                {['😫', '😐', '😊', '🤩'].map(mood => (
                                    <button
                                        key={mood}
                                        onClick={() => setReflectionMood(mood)}
                                        className={cn(
                                            "p-2 rounded-full transition-transform hover:scale-125",
                                            reflectionMood === mood ? "bg-primary/20 scale-125" : "grayscale opacity-50 hover:grayscale-0 hover:opacity-100"
                                        )}
                                    >
                                        {mood}
                                    </button>
                                ))}
                            </div>

                            <textarea
                                placeholder="How did it feel? (Optional)"
                                className="w-full bg-secondary/50 rounded-xl p-3 text-sm outline-none focus:ring-1 focus:ring-primary mb-4 resize-none h-20"
                                value={reflectionNote}
                                onChange={(e) => setReflectionNote(e.target.value)}
                            />

                            <button
                                onClick={handleFinalComplete}
                                className="w-full py-3 bg-primary text-primary-foreground font-bold rounded-xl"
                            >
                                Complete Habit
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>


            {/* Success Background (Underlay) */}
            <motion.div
                style={{ opacity: bgOpacity }}
                className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/5 rounded-2xl flex items-center justify-start pl-6 text-primary z-0 pointer-events-none"
            >
                <motion.div style={{ scale }}>
                    <Check size={32} strokeWidth={3} />
                </motion.div>
            </motion.div>

            {/* Main Card (Flippable) */}
            <motion.div
                style={{ x }}
                drag={habit.is_completed_today || isFlipped ? false : "x"}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={{ right: 0.2, left: 0.05 }}
                onDragEnd={handleDragEnd}
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.6, type: "spring" }}
                className="relative preserve-3d z-10"
            >
                {/* FRONT FACE */}
                <div className={cn(
                    "relative p-5 rounded-2xl border transition-all duration-300 flex items-center justify-between overflow-hidden backface-hidden bg-card/90 backdrop-blur-md shadow-sm dark:bg-card/60",
                    habit.is_completed_today
                        ? "border-primary/30 bg-primary/5 dark:bg-primary/10"
                        : "border-border/50"
                )}>
                    <div className="flex items-center gap-5">
                        <div
                            className={cn(
                                "w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-inner shrink-0 transition-all cursor-pointer hover:scale-105 active:scale-95",
                                habit.is_completed_today ? "bg-primary text-primary-foreground scale-110 rotate-3" : "bg-secondary text-secondary-foreground"
                            )}
                            onClick={() => setIsFlipped(true)}
                        >
                            {habit.is_completed_today ? <Check size={28} strokeWidth={3} /> : (habit.emoji || '🌱')}
                        </div>

                        <div className="flex flex-col">
                            <h3 className={cn(
                                "font-bold text-lg leading-tight transition-colors duration-300",
                                habit.is_completed_today ? "text-primary line-through decoration-2 decoration-primary/30" : "text-foreground"
                            )}>
                                {habit.title}
                            </h3>
                            <div className="flex items-center gap-2 mt-0.5">
                                <p className="text-sm text-muted-foreground font-medium">
                                    {habit.duration_minutes ? `${habit.duration_minutes}m` : 'Daily'}
                                </p>
                                {habit.motivation && (
                                    <span className="text-[10px] px-1.5 py-0.5 bg-blue-500/10 text-blue-500 rounded-md font-bold uppercase tracking-wide">
                                        Identity
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1">
                        <div className={cn(
                            "flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold mr-2 border",
                            habit.current_streak > 0
                                ? "bg-orange-500/10 text-orange-600 border-orange-500/20 dark:text-orange-400"
                                : "bg-secondary text-muted-foreground border-transparent"
                        )}>
                            <Flame size={14} className={cn(habit.current_streak > 0 && "fill-orange-600 dark:fill-orange-400")} />
                            <span>{habit.current_streak || 0}</span>
                        </div>

                        {/* Menu (Simpler version) */}
                        <button
                            onClick={(e) => { e.stopPropagation(); setIsMenuOpen(!isMenuOpen); }}
                            className="p-2 text-muted-foreground hover:bg-secondary rounded-full"
                        >
                            <MoreVertical size={20} />
                        </button>
                        {/* Dropdown would go here, simplified for brevity */}
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
                                        <button onClick={(e) => { e.stopPropagation(); setIsMenuOpen(false); onEdit(habit); }} className="w-full text-left px-3 py-2 text-sm font-medium rounded-lg hover:bg-secondary text-foreground flex items-center gap-2 transition-colors"><Edit2 size={16} /> Edit</button>
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
                                        <button onClick={(e) => { e.stopPropagation(); setIsMenuOpen(false); if (window.confirm('Delete habit?')) onDelete(habit.id); }} className="w-full text-left px-3 py-2 text-sm font-medium rounded-lg hover:bg-destructive/10 text-destructive flex items-center gap-2 transition-colors"><Trash2 size={16} /> Delete</button>
                                    </motion.div>
                                </>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* BACK FACE (Motivation) */}
                <div
                    className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl p-6 text-white backface-hidden rotate-y-180 flex flex-col justify-center items-center text-center cursor-pointer shadow-xl"
                    onClick={() => setIsFlipped(false)}
                >
                    <div className="absolute top-3 right-3 opacity-50"><RotateCcw size={16} /></div>
                    <span className="text-xs font-bold uppercase tracking-widest opacity-70 mb-2">Why I do this</span>
                    <p className="text-lg font-bold leading-tight">
                        "{habit.motivation || "To become 1% better every day."}"
                    </p>
                </div>
            </motion.div>
        </div>
    );
}

// Add simple CSS for 3D flip if not in tailwind
/* 
.perspective-1000 { perspective: 1000px; }
.preserve-3d { transform-style: preserve-3d; }
.backface-hidden { backface-visibility: hidden; }
.rotate-y-180 { transform: rotateY(180deg); }
*/
