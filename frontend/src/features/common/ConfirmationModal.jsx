import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

export function ConfirmationModal({ isOpen, onClose, onConfirm, title, message, confirmText = "Confirm", confirmStyle = "danger" }) {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    onClick={onClose}
                />
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    className="relative w-full max-w-sm bg-card dark:bg-slate-900 border border-border rounded-xl shadow-2xl p-6 overflow-hidden"
                >
                    <div className="flex flex-col items-center text-center">
                        <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center justify-center mb-4">
                            <AlertTriangle size={24} />
                        </div>
                        <h3 className="text-lg font-bold text-foreground mb-2">{title}</h3>
                        <p className="text-muted-foreground text-sm mb-6">{message}</p>

                        <div className="flex gap-3 w-full">
                            <button
                                onClick={onClose}
                                className="flex-1 py-2.5 px-4 rounded-lg bg-secondary text-secondary-foreground font-medium hover:bg-secondary/80 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => { onConfirm(); onClose(); }}
                                className={`flex-1 py-2.5 px-4 rounded-lg font-medium text-white shadow-lg transition-all hover:scale-105 active:scale-95 ${confirmStyle === 'danger'
                                        ? 'bg-gradient-to-r from-red-500 to-orange-500 shadow-red-500/20'
                                        : 'bg-gradient-to-r from-blue-500 to-indigo-500 shadow-blue-500/20'
                                    }`}
                            >
                                {confirmText}
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
