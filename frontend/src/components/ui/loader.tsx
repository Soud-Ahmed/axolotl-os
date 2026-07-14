import { motion } from 'framer-motion';

export function Loader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/40 backdrop-blur-sm">
      <motion.div 
        className="flex flex-col items-center gap-3 rounded-2xl bg-white px-8 py-5 shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
      >
        {/* Sleek logo dot */}
        <div className="flex items-center gap-2">
          <motion.div 
            className="h-2 w-2 rounded-full bg-blue-600"
            animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
          <span className="text-xs font-semibold tracking-widest text-gray-800">AXOLOTL</span>
        </div>

        {/* Minimal endless progress bar */}
        <div className="h-[2px] w-32 overflow-hidden rounded-full bg-gray-100">
          <motion.div
            className="h-full w-1/2 bg-blue-500 rounded-full"
            animate={{ x: ["-100%", "200%"] }}
            transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    </div>
  );
}
