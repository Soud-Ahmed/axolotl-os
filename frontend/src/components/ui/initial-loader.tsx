import { motion } from 'framer-motion';

export function InitialLoader() {
  return (
    <motion.div 
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="relative flex flex-col items-center">
        {/* Glow backdrop */}
        <motion.div 
          className="absolute top-1/2 left-1/2 -z-10 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-[100px]"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1.5, opacity: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
        />

        {/* Logo Text */}
        <div className="overflow-hidden">
          <motion.h1 
            className="bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-5xl font-black tracking-[0.2em] text-transparent md:text-7xl"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            AXOLOTL
          </motion.h1>
        </div>

        <div className="overflow-hidden">
          <motion.p
            className="mt-2 text-sm font-light tracking-[0.5em] text-muted-foreground/80 md:text-base"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            OPERATING SYSTEM
          </motion.p>
        </div>

        {/* Progress Bar */}
        <div className="mt-12 h-[2px] w-48 overflow-hidden rounded-full bg-muted/30">
          <motion.div 
            className="h-full bg-primary"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />
        </div>

        {/* Status Text */}
        <motion.div
          className="mt-6 flex flex-col items-center gap-1 text-[10px] uppercase tracking-widest text-muted-foreground/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          <motion.span
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            Initializing Kernel...
          </motion.span>
        </motion.div>
      </div>
    </motion.div>
  );
}
