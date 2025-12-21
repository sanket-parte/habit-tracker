import { motion } from 'framer-motion';

export function XPBar({ xp, level }) {
    const xpNeeded = level * 100;
    const progress = Math.min((xp / xpNeeded) * 100, 100);

    return (
        <div className="w-full space-y-1">
            <div className="flex justify-between text-xs text-gray-500 font-medium">
                <span>Level {level}</span>
                <span>{xp} / {xpNeeded} XP</span>
            </div>
            <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-primary to-green-400 rounded-full"
                />
            </div>
        </div>
    );
}
