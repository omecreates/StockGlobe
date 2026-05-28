/* eslint-disable prettier/prettier */
// src/components/ui/ToastContainer.tsx
import { AnimatePresence, motion } from "framer-motion";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";
import { useApp } from "@/store/appStore";
import { cn } from "@/lib/utils";
import { Key, ReactElement, JSXElementConstructor, ReactNode, ReactPortal } from "react";

const ICONS = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle,
};

const COLORS = {
  success: "text-[color:var(--signal-buy)] border-[color:var(--signal-buy)]/20 bg-[color:var(--signal-buy)]/5",
  error: "text-[color:var(--signal-sell)] border-[color:var(--signal-sell)]/20 bg-[color:var(--signal-sell)]/5",
  info: "text-[color:var(--primary)] border-[color:var(--primary)]/20 bg-[color:var(--primary)]/5",
  warning: "text-[color:var(--signal-hold)] border-[color:var(--signal-hold)]/20 bg-[color:var(--signal-hold)]/5",
};

export function ToastContainer() {
  const { state, removeToast } = useApp();

  return (
    <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-3 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {state.toasts.map((toast: { type: string | number; id: Key | null | undefined; title: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; message: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; }) => {
          const Icon = ICONS[toast.type];
          return (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, x: 60, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 60, scale: 0.9 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="pointer-events-auto"
            >
              <div
                className={cn(
                  "glass-strong flex w-[340px] items-start gap-3 rounded-2xl border p-4",
                  COLORS[toast.type],
                )}
              >
                <Icon className="mt-0.5 h-4 w-4 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-foreground">{toast.title}</div>
                  {toast.message && (
                    <div className="mt-0.5 text-xs text-muted-foreground">{toast.message}</div>
                  )}
                </div>
                <button
                  onClick={() => removeToast(toast.id)}
                  className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
