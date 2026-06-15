import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, User, Send, Sparkles } from "lucide-react";
import { AnimatedReveal } from "@/components/ui/AnimatedReveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GlassCard } from "@/components/ui/GlassCard";
import { NeonButton } from "@/components/ui/NeonButton";
import { cn } from "@/lib/utils";

const INITIAL_MESSAGES = [
  { role: "assistant", text: "Hello. I am the StockGlobe AI. I process 14B parameters of market data in real-time. Ask me anything about the current market." }
];

export function AIAssistantSection() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage = { role: "user", text: inputValue };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputValue("");
    setIsTyping(true);

    try {
      const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const response = await fetch(`${API_BASE}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setMessages(prev => [...prev, { role: "assistant", text: data.reply }]);
      } else {
        setMessages(prev => [...prev, { role: "assistant", text: "Sorry, I am currently experiencing higher than normal network latency. Please try again." }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: "assistant", text: "Sorry, I am unable to reach the server. Please check your connection." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <section id="ai-assistant" className="relative py-24 md:py-32">
      <AnimatedReveal variant="scaleIn" className="mx-auto max-w-4xl px-6">
        <SectionHeading
          eyebrow="Conversational Alpha"
          title={<>Ask the <span className="text-primary font-semibold">Engine.</span></>}
          description="Interact directly with our proprietary AI model to test its market comprehension."
        />

        <GlassCard className="mt-14 overflow-hidden border border-white/10 shadow-2xl flex flex-col h-[500px] bg-background/50">
          <div className="bg-white/5 border-b border-white/10 p-4 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
              <Sparkles className="w-4 h-4 text-primary" />
            </div>
            <div>
              <div className="text-sm font-semibold font-display">StockGlobe Intelligence</div>
              <div className="text-[10px] text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Online
              </div>
            </div>
          </div>

          <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-4 custom-scrollbar">
            <AnimatePresence>
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className={cn(
                    "flex gap-3 max-w-[85%]",
                    msg.role === "user" ? "ml-auto flex-row-reverse" : ""
                  )}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center shrink-0 border",
                    msg.role === "user" 
                      ? "bg-white/10 border-white/20" 
                      : "bg-primary/20 border-primary/30"
                  )}>
                    {msg.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-primary" />}
                  </div>
                  <div className={cn(
                    "p-4 rounded-2xl text-sm leading-relaxed",
                    msg.role === "user" 
                      ? "bg-white/10 text-white rounded-tr-sm" 
                      : "bg-primary/10 border border-primary/20 text-primary-100 rounded-tl-sm"
                  )}>
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3 max-w-[85%]"
                >
                  <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 border bg-primary/20 border-primary/30">
                    <Bot className="w-4 h-4 text-primary" />
                  </div>
                  <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20 rounded-tl-sm flex items-center gap-1.5">
                    <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.2 }} className="w-2 h-2 rounded-full bg-primary" />
                    <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0.2 }} className="w-2 h-2 rounded-full bg-primary" />
                    <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0.4 }} className="w-2 h-2 rounded-full bg-primary" />
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </AnimatePresence>
          </div>

          <div className="p-4 bg-white/5 border-t border-white/10">
            <form onSubmit={handleSend} className="relative flex items-center">
              <input
                type="text"
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                placeholder="Ask about market conditions..."
                className="w-full bg-black/50 border border-white/10 rounded-full pl-5 pr-12 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-primary transition-colors"
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isTyping}
                className="absolute right-2 p-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </GlassCard>
      </AnimatedReveal>
    </section>
  );
}
