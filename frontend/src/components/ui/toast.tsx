import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';
import { useToastStore } from '../../store/toast';
import { cn } from '../../lib/utils';

const icons = {
  success: CheckCircle2,
  warning: AlertTriangle,
  error: AlertCircle,
  info: Info,
};

const toastColors = {
  success: 'bg-green-50 border-green-200 text-green-800 dark:bg-green-950/40 dark:border-green-900/60 dark:text-green-300',
  warning: 'bg-yellow-50 border-yellow-250 text-yellow-800 dark:bg-yellow-950/40 dark:border-yellow-900/60 dark:text-yellow-300',
  error: 'bg-red-50 border-red-200 text-red-800 dark:bg-red-950/40 dark:border-red-900/60 dark:text-red-300',
  info: 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-950/40 dark:border-blue-900/60 dark:text-blue-300',
};

const iconColors = {
  success: 'text-green-555 dark:text-green-400',
  warning: 'text-yellow-555 dark:text-yellow-450',
  error: 'text-red-555 dark:text-red-400',
  info: 'text-blue-555 dark:text-blue-400',
};

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-3 max-w-sm w-full">
      <AnimatePresence>
        {toasts.map((toast) => {
          const Icon = icons[toast.type];
          return (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
              transition={{ type: 'spring', damping: 22, stiffness: 220 }}
              className={cn(
                "flex items-start gap-3 border rounded-xl p-4 shadow-lg backdrop-blur-md",
                toastColors[toast.type]
              )}
            >
              <Icon className={cn("h-5 w-5 shrink-0 mt-0.5", iconColors[toast.type])} />
              <div className="flex-1 text-xs font-semibold leading-relaxed">
                {toast.message}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="shrink-0 rounded-lg p-0.5 hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
              >
                <X className="h-4 w-4 opacity-60 hover:opacity-100" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
