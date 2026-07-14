import { motion } from 'framer-motion';

export function Loader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md">
      <div className="relative flex flex-col items-center justify-center">
        {/* Glow effect */}
        <div className="absolute inset-0 -z-10 h-[100px] w-[100px] animate-pulse rounded-full bg-primary/20 blur-3xl filter" />
        
        <div className="relative flex h-16 w-16 items-center justify-center">
          {/* Outer rotating ring */}
          <motion.div
            className="absolute inset-0 rounded-full border-t-2 border-r-2 border-primary"
            animate={{ rotate: 360 }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "linear",
            }}
          />
          
          {/* Inner rotating ring (reverse) */}
          <motion.div
            className="absolute inset-2 rounded-full border-b-2 border-l-2 border-secondary"
            animate={{ rotate: -360 }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear",
            }}
          />
          
          {/* Center pulsing dot */}
          <motion.div
            className="h-2 w-2 rounded-full bg-primary"
            animate={{ 
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>
        
        <motion.p
          className="mt-4 text-sm font-medium tracking-widest text-muted-foreground"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          LOADING
        </motion.p>
      </div>
    </div>
  );
}
