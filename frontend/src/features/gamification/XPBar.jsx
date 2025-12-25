import { motion } from 'framer-motion';

export function XPBar({ xp, level }) {
    const xpNeeded = level * 100;
    const progress = Math.min((xp / xpNeeded) * 100, 100);

    return (
        <div className="w-full space-y-1.5">
            <div className="flex justify-between text-xs font-semibold text-muted-foreground">
                <span className="tracking-wide uppercase">Level {level}</span>
                <span>{xp} / {xpNeeded} XP</span>
            </div>
            <div className="h-2.5 bg-secondary rounded-full overflow-hidden ring-1 ring-border/50">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.8, ease: "circOut" }}
                    className="h-full bg-gradient-to-r from-primary to-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.4)]"
                />
            </div>
        </div>
    );
}
