import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getHabits, getMe, createHabit, completeHabit, deleteHabit, updateHabit } from '../../lib/api';
import { HabitCard } from './HabitCard';
import { XPBar } from '../gamification/XPBar';
import { PlantVisual } from '../gamification/PlantVisual';
import { CreateHabitModal } from './CreateHabitModal';
import { Plus } from 'lucide-react';

export function HabitList() {
    const { data: habits, isLoading: habitsLoading } = useQuery({ queryKey: ['habits'], queryFn: getHabits });
    const { data: user, isLoading: userLoading } = useQuery({ queryKey: ['user'], queryFn: getMe });
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingHabit, setEditingHabit] = useState(null);

    const queryClient = useQueryClient();

    const createMutation = useMutation({
        mutationFn: createHabit,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['habits'] });
        },
    });

    const completeMutation = useMutation({
        mutationFn: completeHabit,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['habits'] });
            queryClient.invalidateQueries({ queryKey: ['user'] }); // Refresh XP/Level
        },
        onError: (error) => {
            console.log(error);
        },
    });

    const deleteMutation = useMutation({
        mutationFn: deleteHabit,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['habits'] });
        },
    });

    const updateMutation = useMutation({
        mutationFn: updateHabit,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['habits'] });
        },
    });

    if (habitsLoading || userLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                <p className="text-muted-foreground animate-pulse">Loading your garden...</p>
            </div>
        )
    }

    return (
        <div className="animate-in fade-in duration-500 pb-32">
            <header className="px-6 py-8 flex justify-between items-end mb-2">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-emerald-600 bg-clip-text text-transparent">
                        {user?.username}'s Garden
                    </h1>
                    <p className="text-muted-foreground mt-1 text-sm font-medium">Let's grow together!</p>
                </div>
                <div className="w-28">
                    <XPBar xp={user?.xp || 0} level={user?.level || 1} />
                </div>
            </header>

            <div className="px-4 mb-8">
                <PlantVisual level={user?.level || 1} />
            </div>

            <div className="px-4 space-y-4">
                <h2 className="text-lg font-semibold px-2 flex items-center gap-2">
                    Your Habits
                    <span className="text-xs bg-secondary px-2 py-0.5 rounded-full text-secondary-foreground">{habits?.length || 0}</span>
                </h2>
                {habits?.map((habit, index) => (
                    <div key={habit.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 50}ms` }}>
                        <HabitCard
                            habit={habit}
                            onComplete={(id) => completeMutation.mutate(id)}
                            onDelete={(id) => deleteMutation.mutate(id)}
                            onEdit={(habit) => {
                                setEditingHabit(habit);
                                setIsCreateModalOpen(true);
                            }}
                            onArchive={(habit) => updateMutation.mutate({ id: habit.id, data: { is_archived: true } })}
                        />
                    </div>
                ))}

                {habits?.length === 0 && (
                    <div className="text-center py-16 opacity-50 flex flex-col items-center">
                        <div className="w-16 h-16 bg-secondary/50 rounded-full mb-4 flex items-center justify-center">
                            <Plus className="text-muted-foreground" size={24} />
                        </div>
                        <p className="font-medium">No habits yet</p>
                        <p className="text-sm text-muted-foreground">Plant your first seed today!</p>
                    </div>
                )}
            </div>

            {/* Floating Action Button */}
            <button
                onClick={() => {
                    setEditingHabit(null);
                    setIsCreateModalOpen(true);
                }}
                className="fixed bottom-24 right-6 w-16 h-16 bg-primary text-black rounded-full shadow-2xl shadow-primary/30 flex items-center justify-center hover:scale-105 active:scale-95 transition-all z-40 group"
            >
                <Plus size={32} className="text-primary-foreground group-hover:rotate-90 transition-transform duration-300" />
            </button>

            <CreateHabitModal
                isOpen={isCreateModalOpen}
                onClose={() => {
                    setIsCreateModalOpen(false);
                    setEditingHabit(null);
                }}
                initialData={editingHabit}
                onCreate={async (habitData) => {
                    if (editingHabit) {
                        await updateMutation.mutateAsync({ id: editingHabit.id, data: habitData });
                    } else {
                        await createMutation.mutateAsync(habitData);
                    }
                }}
            />
        </div>
    );
}
