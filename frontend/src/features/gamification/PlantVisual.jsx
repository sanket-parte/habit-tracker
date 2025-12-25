import { motion } from 'framer-motion';
import { Sprout, Flower, Trees, Leaf } from 'lucide-react';
import { cn } from '../../lib/utils';

export function PlantVisual({ level }) {
    // Simple visual progression based on level
    // Level 1-2: Sprout
    // Level 3-5: Leaf
    // Level 6-9: Flower
    // Level 10+: Trees

    let Icon = Sprout;
    let colorClass = "text-primary bg-primary/10";
    let label = "Seedling";

    if (level >= 3 && level < 6) {
        Icon = Leaf;
        colorClass = "text-emerald-500 bg-emerald-500/10";
        label = "Sapling";
    } else if (level >= 6 && level < 10) {
        Icon = Flower;
        colorClass = "text-pink-500 bg-pink-500/10";
        label = "Blooming";
    } else if (level >= 10) {
        Icon = Trees;
        colorClass = "text-green-600 bg-green-600/10";
        label = "Forest";
    }

    return (
        <div className="relative overflow-hidden flex flex-col items-center justify-center p-6 rounded-2xl border border-border/50 bg-card/40 backdrop-blur-sm shadow-sm group">
            {/* Ambient Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-50" />

            <motion.div
                initial={{ scale: 0, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                key={label} // Trigger animation on level change
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className={cn(
                    "relative p-5 rounded-full mb-3 ring-4 ring-white/50 dark:ring-white/5 shadow-xl backdrop-blur-md",
                    colorClass
                )}
            >
                <Icon size={48} strokeWidth={1.5} />
            </motion.div>

            <div className="relative text-center">
                <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">{label}</h3>
                <p className="text-xs text-muted-foreground font-medium mt-0.5">Keep growing your garden!</p>
            </div>
        </div>
    );
}
