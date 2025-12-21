import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export function CreateHabitModal({ isOpen, onClose, onCreate, initialData = null }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [frequency, setFrequency] = useState('DAILY');

    useEffect(() => {
        if (initialData) {
            setTitle(initialData.title);
            setDescription(initialData.description || '');
            setFrequency(initialData.frequency || 'DAILY');
        } else {
            setTitle('');
            setDescription('');
            setFrequency('DAILY');
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        await onCreate({ title, description, frequency });
        onClose();
        if (!initialData) {
            setTitle('');
            setDescription('');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-sm shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                        {initialData ? 'Edit Habit' : 'New Seed'}
                    </h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Habit Name
                        </label>
                        <input
                            type="text"
                            required
                            placeholder="e.g. Drink Water"
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-shadow"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Description (Optional)
                        </label>
                        <input
                            type="text"
                            placeholder="A short note..."
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-shadow"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Frequency
                        </label>
                        <select
                            value={frequency}
                            onChange={(e) => setFrequency(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-shadow"
                        >
                            <option value="DAILY">Daily</option>
                            <option value="WEEKLY">Weekly</option>
                        </select>
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            className="w-full py-2.5 px-4 bg-primary hover:bg-green-600 text-white font-medium rounded-lg shadow-lg shadow-green-500/20 active:scale-95 transition-all"
                        >
                            {initialData ? 'Update Habit' : 'Plant Seed'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
