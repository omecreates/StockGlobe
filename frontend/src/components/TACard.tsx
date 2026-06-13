import { ArrowUpRight, ArrowDownRight, Minus, TrendingUp, Zap, Target } from "lucide-react";
import { motion } from "framer-motion";

interface TACardProps {
  recommendation: string;
  score: number;
}

export function TACard({ recommendation, score }: TACardProps) {
  const getRecColor = () => {
    if (recommendation.toLowerCase() === "buy") return "text-green-500 bg-green-500/10";
    if (recommendation.toLowerCase() === "sell") return "text-red-500 bg-red-500/10";
    return "text-yellow-500 bg-yellow-500/10";
  };

  const getRecIcon = () => {
    if (recommendation.toLowerCase() === "buy") return <TrendingUp className="h-6 w-6 text-green-500" />;
    if (recommendation.toLowerCase() === "sell") return <ArrowDownRight className="h-6 w-6 text-red-500" />;
    return <Minus className="h-6 w-6 text-yellow-500" />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-xl p-6 border border-border/50"
    >
      <h2 className="text-sm font-medium flex items-center gap-2 mb-4">
        <Target className="h-4 w-4 text-primary" />
        Technical Summary
      </h2>
      
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground mb-1">Recommendation</p>
          <div className="flex items-center gap-3">
            {getRecIcon()}
            <span className={`text-2xl font-bold uppercase tracking-wider ${getRecColor().split(" ")[0]}`}>
              {recommendation}
            </span>
          </div>
        </div>
        
        <div className="text-right">
          <p className="text-sm text-muted-foreground mb-1">Momentum Score</p>
          <div className="flex items-center justify-end gap-2">
            <Zap className={`h-4 w-4 ${score > 0 ? "text-green-500" : score < 0 ? "text-red-500" : "text-yellow-500"}`} />
            <span className="text-xl font-bold font-mono">{score > 0 ? `+${score}` : score}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
