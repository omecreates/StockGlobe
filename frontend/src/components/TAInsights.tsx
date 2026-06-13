import { Lightbulb } from "lucide-react";
import { motion } from "framer-motion";

interface TAInsightsProps {
  insights: string[];
}

export function TAInsights({ insights }: TAInsightsProps) {
  if (!insights || insights.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="glass rounded-xl p-6 border border-border/50"
    >
      <h2 className="text-sm font-medium flex items-center gap-2 mb-4">
        <Lightbulb className="h-4 w-4 text-yellow-400" />
        AI Technical Insights
      </h2>
      
      <div className="space-y-3">
        {insights.map((insight, i) => (
          <div
            key={i}
            className="flex gap-3 rounded-lg bg-white/[0.03] px-4 py-3 items-start border border-white/[0.05]"
          >
            <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 shrink-0" />
            <p className="text-sm text-muted-foreground leading-relaxed">{insight}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
