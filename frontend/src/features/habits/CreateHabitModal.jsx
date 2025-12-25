import { useState, useEffect } from 'react';
import { X, Sparkles, Clock, AlertCircle } from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export function CreateHabitModal({ isOpen, onClose, onCreate, initialData = null }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [frequency, setFrequency] = useState('DAILY');
    const [motivation, setMotivation] = useState('');
    const [duration, setDuration] = useState(2);
    const [error, setError] = useState(null);

    // Habit Stacking Helpers
    const [stackingCue, setStackingCue] = useState('');
    const [showStacking, setShowStacking] = useState(false);

    useEffect(() => {
        if (initialData) {
            setTitle(initialData.title);
            setDescription(initialData.description || '');
            setFrequency(initialData.frequency || 'DAILY');
            setMotivation(initialData.motivation || '');
            setDuration(initialData.duration_minutes || 2);
        } else {
            setTitle('');
            setDescription('');
            setFrequency('DAILY');
            setMotivation('');
            setDuration(2);
            setStackingCue('');
        }
        setError(null);
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            await onCreate({
                title,
                description: showStacking && stackingCue ? `After I ${stackingCue}, I will ${title}` : description,
                frequency,
                motivation,
                duration_minutes: parseInt(duration)
            });
            onClose();
        } catch (err) {
            // Check if it's the specific duplicate error we threw from backend
            if (err.response?.status === 400 && err.response?.data?.detail) {
                setError(err.response.data.detail);
            } else {
                setError("Failed to create habit.");
            }
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-card dark:bg-slate-900 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden border border-border/50"
            >
                <div className="px-6 py-5 border-b border-border/50 flex justify-between items-center bg-secondary/30">
                    <h2 className="text-xl font-bold bg-gradient-to-r from-primary to-emerald-500 bg-clip-text text-transparent flex items-center gap-2">
                        {initialData ? 'Prune Habit' : 'Plant New Seed'}
                        <Sparkles size={18} className="text-primary" />
                    </h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
                        <X size={20} className="text-muted-foreground" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
                    {error && (
                        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm flex items-center gap-2">
                            <AlertCircle size={16} /> {error}
                        </div>
                    )}

                    {/* Identity / Motivation */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-foreground">Who do you want to become?</label>
                        <input
                            type="text"
                            placeholder="e.g. A healthy runner, A reader..."
                            className="w-full px-4 py-2.5 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-muted-foreground/50"
                            value={motivation}
                            onChange={(e) => setMotivation(e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground">This helps you build an identity-based habit.</p>
                    </div>

                    <div className="h-px bg-border/50" />

                    {/* Core Habit Info */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-foreground">What is the habit?</label>
                        <input
                            type="text"
                            required
                            placeholder="e.g. Read 1 page"
                            className="w-full px-4 py-2.5 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    {/* Habit Stacking Toggle */}
                    {!initialData && (
                        <div className="space-y-2">
                            <button
                                type="button"
                                onClick={() => setShowStacking(!showStacking)}
                                className="text-sm text-primary font-medium hover:underline flex items-center gap-1"
                            >
                                {showStacking ? 'Remove Habit Stacking' : '+ Add Habit Stacking (Psychology Trick)'}
                            </button>
                            <AnimatePresence>
                                {showStacking && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="text-sm p-3 bg-secondary/50 rounded-xl space-y-2"
                                    >
                                        <p className="font-medium text-foreground">After I...</p>
                                        <input
                                            type="text"
                                            placeholder="e.g. pour my morning coffee"
                                            className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm"
                                            value={stackingCue}
                                            onChange={(e) => setStackingCue(e.target.value)}
                                        />
                                        <p className="font-medium text-foreground">I will {title || "..."}</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    )}

                    {/* 2-Minute Rule / Duration */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-foreground flex items-center gap-2">
                                Duration <Clock size={14} className="text-muted-foreground" />
                            </label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    min="1"
                                    max="120"
                                    className="w-20 px-3 py-2.5 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary/20 outline-none"
                                    value={duration}
                                    onChange={(e) => setDuration(e.target.value)}
                                />
                                <span className="text-sm text-muted-foreground">mins</span>
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-foreground">Frequency</label>
                            <select
                                value={frequency}
                                onChange={(e) => setFrequency(e.target.value)}
                                className="w-full px-3 py-2.5 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary/20 outline-none"
                            >
                                <option value="DAILY">Daily</option>
                                <option value="WEEKLY">Weekly</option>
                            </select>
                        </div>
                    </div>

                    {/* 2 Minute Warning */}
                    {parseInt(duration) > 2 && (
                        <div className="p-3 bg-amber-500/10 text-amber-600 dark:text-amber-500 rounded-xl text-xs flex items-start gap-2">
                            <Sparkles size={14} className="mt-0.5 shrink-0" />
                            <p>
                                <strong>Psychology Tip:</strong> Make it so easy you can't say no.
                                Consider starting with just 2 minutes!
                            </p>
                        </div>
                    )}

                    <div className="pt-2">
                        <button
                            type="submit"
                            className="w-full py-3.5 px-4 bg-primary hover:bg-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/20 active:scale-95 transition-all text-base"
                        >
                            {initialData ? 'Update Habit' : 'Plant Seed'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}
