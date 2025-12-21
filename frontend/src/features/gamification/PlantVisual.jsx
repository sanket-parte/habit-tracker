import { motion } from 'framer-motion';
import { Sprout, Flower, Trees, Leaf } from 'lucide-react';

export function PlantVisual({ level }) {
    // Simple visual progression based on level
    // Level 1-2: Sprout
    // Level 3-5: Leaf
    // Level 6-9: Flower
    // Level 10+: Trees

    let Icon = Sprout;
    let color = "text-green-500";
    let scale = 1;
    let label = "Seedling";

    if (level >= 3 && level < 6) {
        Icon = Leaf;
        color = "text-emerald-500";
        scale = 1.1;
        label = "Sapling";
    } else if (level >= 6 && level < 10) {
        Icon = Flower;
        color = "text-pink-500";
        scale = 1.2;
        label = "Blooming";
    } else if (level >= 10) {
        Icon = Trees;
        color = "text-green-700";
        scale = 1.3;
        label = "Forest";
    }

    return (
        <div className="flex flex-col items-center justify-center p-6 bg-green-50/50 dark:bg-green-900/10 rounded-2xl border border-green-100 dark:border-green-900/30">
            <motion.div
                initial={{ scale: 0, rotate: -10 }}
                animate={{ scale: scale, rotate: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className={`p-4 bg-white dark:bg-gray-800 rounded-full shadow-lg mb-3 ${color}`}
            >
                <Icon size={48} />
            </motion.div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wide">{label}</h3>
            <p className="text-xs text-gray-500">Keep growing!</p>
        </div>
    );
}
