import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { 
  Github, 
  Linkedin, 
  Mail, 
  FileText, 
  GraduationCap, 
  Brain, 
  Code, 
  Cpu, 
  ChevronRight 
} from "lucide-react";
import { FloatingNav } from "@/components/layout/FloatingNav";
import { Footer } from "@/components/layout/Footer";
import { CursorGlow } from "@/components/layout/CursorGlow";
import { SmoothScrollProvider } from "@/components/layout/SmoothScrollProvider";

export const Route = createFileRoute("/about")({
  component: About,
  head: () => ({
    meta: [
      { title: "PD Shaheed Ali - Full-Stack Developer & AI Enthusiast" },
      { name: "description", content: "Developer portfolio of PD Shaheed Ali, creator of StockGlobe." }
    ]
  })
});

function About() {
  return (
    <SmoothScrollProvider>
      <CursorGlow />
      <FloatingNav />
      <main className="relative min-h-screen bg-[#0a0e1f] pt-32 pb-16">
        
        {/* Background Effects */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-1/4 -right-1/4 w-1/2 h-1/2 rounded-full bg-primary/20 blur-[150px]" />
          <div className="absolute -bottom-1/4 -left-1/4 w-1/2 h-1/2 rounded-full bg-[color:var(--signal-buy)]/10 blur-[150px]" />
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay" />
        </div>

        <div className="relative z-10 mx-auto max-w-5xl px-6">
          {/* Header Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-center text-center mb-20"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary mb-6">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
              </span>
              Available for Opportunities
            </div>
            
            <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tight text-white mb-6">
              PD Shaheed Ali
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground font-light mb-8 max-w-2xl">
              Full-Stack Developer <span className="text-primary/50 px-2">|</span> AI & ML Enthusiast
            </p>
            <p className="text-lg text-foreground/80 max-w-3xl leading-relaxed">
              Passionate about building intelligent applications that combine Artificial Intelligence, 
              Machine Learning, Data Visualization, and Modern Web Technologies.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Left Column: Info & Contact */}
            <div className="md:col-span-1 space-y-8">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="rounded-2xl border border-white/10 bg-card/40 backdrop-blur-xl p-8 shadow-2xl relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-6">Profile</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-foreground/90">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <GraduationCap size={20} />
                    </div>
                    <div>
                      <p className="font-medium text-white">VIT Chennai</p>
                      <p className="text-xs text-muted-foreground">Student</p>
                    </div>
                  </div>
                </div>

                <hr className="my-6 border-white/5" />
                
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-6">Connect</h3>
                <div className="flex flex-col gap-3">
                  {[
                    { icon: Github, label: "GitHub", href: "https://github.com/omecreates" },
                    { icon: Linkedin, label: "LinkedIn", href: "https://www.linkedin.com/in/pdshahidali/" },
                    { icon: Mail, label: "Email", href: "mailto:phenomenalonep28@gmail.com" },
                    { icon: FileText, label: "Personal Portfolio", href: "https://pdshaheedali.vercel.app/" }
                  ].map((link, i) => (
                    <a 
                      key={i} 
                      href={link.href}
                      className="flex items-center justify-between p-3 rounded-lg border border-white/5 bg-white/5 hover:bg-white/10 transition-colors group/link text-sm font-medium text-foreground/80 hover:text-white"
                    >
                      <span className="flex items-center gap-3">
                        <link.icon size={16} className="text-muted-foreground group-hover/link:text-primary transition-colors" />
                        {link.label}
                      </span>
                      <ChevronRight size={14} className="opacity-0 -translate-x-2 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all text-primary" />
                    </a>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Right Column: Skills & Experience */}
            <div className="md:col-span-2 space-y-8">
              
              {/* Featured Project */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="rounded-2xl border border-primary/20 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-xl p-8 shadow-2xl relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                  <Brain size={120} />
                </div>
                
                <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--signal-buy)]/30 bg-[color:var(--signal-buy)]/10 px-3 py-1 text-[10px] uppercase tracking-wider text-[color:var(--signal-buy)] mb-4">
                  Featured Project
                </div>
                
                <h2 className="text-3xl font-display font-semibold text-white mb-4">StockGlobe</h2>
                <p className="text-foreground/80 leading-relaxed max-w-lg mb-6">
                  An AI-powered stock market intelligence platform featuring predictive analytics, 
                  sentiment analysis, interactive visualizations, and modern full-stack architecture.
                </p>
                
                <div className="flex flex-wrap gap-2 mt-6">
                  {["Predictive Analytics", "Sentiment Analysis", "Full-Stack Architecture"].map(tag => (
                    <span key={tag} className="px-3 py-1 text-xs rounded-md bg-white/5 border border-white/10 text-muted-foreground">
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>

              {/* Skills Grid */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="grid sm:grid-cols-2 gap-4"
              >
                <div className="rounded-2xl border border-white/10 bg-card/40 backdrop-blur-xl p-6 shadow-xl">
                  <div className="flex items-center gap-3 mb-6">
                    <Code className="text-primary" size={24} />
                    <h3 className="text-lg font-semibold text-white">Frontend & Web</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {["React", "TypeScript", "Tailwind CSS", "Framer Motion"].map(skill => (
                      <span key={skill} className="px-3 py-1.5 text-xs font-medium rounded-lg bg-primary/10 text-primary border border-primary/20">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-card/40 backdrop-blur-xl p-6 shadow-xl">
                  <div className="flex items-center gap-3 mb-6">
                    <Cpu className="text-[color:var(--signal-buy)]" size={24} />
                    <h3 className="text-lg font-semibold text-white">Backend & AI/ML</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {["Python", "FastAPI", "REST APIs", "Machine Learning", "Scikit-Learn", "Data Analytics"].map(skill => (
                      <span key={skill} className="px-3 py-1.5 text-xs font-medium rounded-lg bg-[color:var(--signal-buy)]/10 text-[color:var(--signal-buy)] border border-[color:var(--signal-buy)]/20">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Experience Highlights */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="rounded-2xl border border-white/10 bg-card/40 backdrop-blur-xl p-8 shadow-2xl"
              >
                <h3 className="text-xl font-semibold text-white mb-6">Experience Highlights</h3>
                <div className="space-y-6">
                  {[
                    { title: "Neuroinformatics Research Experience", role: "Researcher", active: false },
                    { title: "Full-Stack Development Projects", role: "Developer", active: true },
                    { title: "AI/ML Projects", role: "Engineer", active: true },
                  ].map((exp, i) => (
                    <div key={i} className="flex gap-4 relative">
                      <div className="mt-1 flex flex-col items-center">
                        <div className={`w-3 h-3 rounded-full ${exp.active ? 'bg-primary shadow-[0_0_10px_rgba(var(--primary),0.5)]' : 'bg-white/20'}`} />
                        {i !== 2 && <div className="w-px h-full bg-white/10 my-2" />}
                      </div>
                      <div className="pb-4">
                        <h4 className="text-base font-medium text-white">{exp.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{exp.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
              
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </SmoothScrollProvider>
  );
}
