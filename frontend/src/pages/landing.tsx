import { Link } from 'react-router-dom';
import { motion, Variants } from 'framer-motion';
import { useAuthStore } from '../store/auth';
import { 
  ArrowRight,
  Database,
  Layout,
  Zap,
  Globe,
  Users,
  CheckCircle2,
  Code2,
  ShieldCheck,
  Star,
  PlayCircle
} from 'lucide-react';

export function LandingPage() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  // Common animation variants for scroll reveal
  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };
  
  const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] text-gray-100 font-sans overflow-x-hidden selection:bg-white/20 selection:text-white">
      {/* Ultra-subtle grid background */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
      
      {/* Top radial highlight */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] opacity-20 pointer-events-none" 
           style={{ background: 'radial-gradient(circle at top center, rgba(120, 119, 198, 0.4) 0%, transparent 70%)' }} />

      {/* Header */}
      <header className="fixed top-0 inset-x-0 z-50 border-b border-white/[0.08] bg-black/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <img src="/logo.png" alt="Axolotl Logo" className="h-6 w-auto object-contain" />
            <span className="text-sm font-medium tracking-tight text-[#EDEDED]">
              Axolotl-OS
            </span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6 text-[13px] font-medium text-[#8A8F98]">
            <a href="#how-it-works" className="hover:text-[#EDEDED] transition-colors">How it works</a>
            <a href="#features" className="hover:text-[#EDEDED] transition-colors">Features</a>
            <a href="#testimonials" className="hover:text-[#EDEDED] transition-colors">Customers</a>
            <a href="#pricing" className="hover:text-[#EDEDED] transition-colors">Pricing</a>
          </nav>

          <div className="flex items-center gap-4">
            <Link to="/login" className="text-[13px] font-medium text-[#8A8F98] hover:text-[#EDEDED] transition-colors">
              Log in
            </Link>
            <Link to={isAuthenticated ? "/dashboard" : "/register"}>
              <button className="h-8 px-4 rounded-full bg-white text-black text-[13px] font-medium hover:bg-[#EDEDED] transition-colors flex items-center gap-1.5">
                {isAuthenticated ? "Dashboard" : "Sign up"}
              </button>
            </Link>
          </div>
        </div>
      </header>

      <main className="relative z-10 pt-32 flex flex-col items-center">
        
        {/* 1. Hero Section */}
        <section className="w-full max-w-5xl mx-auto px-6 flex flex-col items-center text-center mt-12 md:mt-24">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/[0.08] bg-white/[0.02] text-[13px] font-medium text-[#8A8F98] mb-8 hover:bg-white/[0.04] cursor-pointer transition-colors"
          >
            <span className="flex h-2 w-2 rounded-full bg-[#5E6AD2]" />
            Axolotl-OS 2.0 is now live <ArrowRight className="h-3 w-3 ml-1" />
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
            className="text-5xl md:text-7xl lg:text-[80px] font-semibold tracking-tighter text-[#EDEDED] leading-[1.05] max-w-4xl"
          >
            The operating system <br className="hidden md:block" /> for modern web media.
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
            className="mt-8 text-lg md:text-xl text-[#8A8F98] max-w-2xl leading-relaxed tracking-tight"
          >
            Streamline your media workflows, collaborate in real-time, and manage assets with unparalleled speed. Built for ambitious creators and forward-thinking enterprises.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
            className="mt-10 flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
          >
            <Link to={isAuthenticated ? "/dashboard" : "/register"} className="w-full sm:w-auto">
              <button className="w-full sm:w-auto h-12 px-6 rounded-full bg-white text-black text-[15px] font-medium hover:bg-[#EDEDED] transition-colors flex items-center justify-center gap-2 shadow-[0_0_40px_rgba(255,255,255,0.1)]">
                Get started <ArrowRight className="h-4 w-4" />
              </button>
            </Link>
            <button className="w-full sm:w-auto h-12 px-6 rounded-full bg-white/[0.05] border border-white/[0.08] text-[#EDEDED] text-[15px] font-medium hover:bg-white/[0.08] transition-colors flex items-center justify-center">
              Documentation
            </button>
          </motion.div>
        </section>

        {/* 2. Social Proof / Trusted By */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="w-full max-w-5xl mx-auto px-6 mt-20 text-center"
        >
          <p className="text-[12px] font-medium text-[#8A8F98] uppercase tracking-widest mb-8">Trusted by innovative teams worldwide</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-40 grayscale">
            {/* Realistic mid-market and indie studio names */}
            <div className="text-xl font-bold tracking-tighter flex items-center gap-1"><div className="w-5 h-5 bg-white clip-polygon-[50%_0,100%_100%,0_100%]" /> Vora Media</div>
            <div className="text-xl font-black tracking-tight">PixelForge</div>
            <div className="flex items-center gap-1 font-bold text-lg text-red-500">KINETIC</div>
            <div className="text-xl font-bold tracking-tight text-[#95BF47]">Lumina</div>
            <div className="text-xl font-black uppercase tracking-tighter">Echo Studios</div>
          </div>
        </motion.section>

        {/* 3. Dashboard Preview Mockup */}
        <motion.section 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="w-full max-w-6xl mx-auto px-6 mt-32"
        >
          <div className="w-full aspect-[16/9] md:aspect-[21/9] rounded-2xl md:rounded-[32px] bg-[#0A0A0A] border border-white/[0.08] shadow-[0_30px_100px_rgba(0,0,0,0.8)] overflow-hidden relative flex flex-col">
            <div className="h-12 border-b border-white/[0.08] flex items-center px-4 gap-2 shrink-0 bg-[#0A0A0A]">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/80"/>
                <div className="w-3 h-3 rounded-full bg-yellow-500/80"/>
                <div className="w-3 h-3 rounded-full bg-green-500/80"/>
              </div>
            </div>
            <div className="flex-1 flex overflow-hidden">
               <div className="w-1/4 border-r border-white/[0.08] p-4 hidden md:flex flex-col gap-1 bg-[#050505]">
                  <div className="flex items-center gap-2 mb-6 px-2">
                     <div className="h-6 w-6 rounded bg-gradient-to-br from-[#5E6AD2] to-purple-500 flex items-center justify-center text-[10px] font-bold text-white">AX</div>
                     <span className="text-sm font-semibold text-[#EDEDED]">Workspace</span>
                  </div>
                  <div className="flex items-center gap-3 px-2 py-1.5 rounded bg-white/[0.05] text-[#EDEDED] text-xs font-medium">
                     <Layout className="h-3.5 w-3.5 text-[#5E6AD2]" /> Dashboard
                  </div>
                  <div className="flex items-center gap-3 px-2 py-1.5 rounded text-[#8A8F98] text-xs font-medium">
                     <Database className="h-3.5 w-3.5" /> Media Library
                  </div>
                  <div className="flex items-center gap-3 px-2 py-1.5 rounded text-[#8A8F98] text-xs font-medium">
                     <Users className="h-3.5 w-3.5" /> Team Members
                  </div>
               </div>
               <div className="flex-1 p-6 md:p-8 flex flex-col gap-6 overflow-hidden bg-[#0A0A0A]">
                  <div className="flex justify-between items-center">
                     <h3 className="text-lg font-semibold text-[#EDEDED]">Overview</h3>
                     <div className="h-6 px-3 rounded-full bg-white/[0.05] border border-white/[0.08] text-[10px] flex items-center text-[#8A8F98]">This Week v</div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                     <div className="h-24 bg-gradient-to-br from-[#5E6AD2]/10 to-transparent border border-[#5E6AD2]/20 rounded-xl p-4 flex flex-col justify-between">
                        <span className="text-[11px] text-[#8A8F98]">Total Assets</span>
                        <span className="text-2xl font-bold text-[#EDEDED]">1,248</span>
                     </div>
                     <div className="h-24 bg-white/[0.02] border border-white/[0.05] rounded-xl p-4 flex flex-col justify-between">
                        <span className="text-[11px] text-[#8A8F98]">Storage Used</span>
                        <span className="text-2xl font-bold text-[#EDEDED]">842 GB</span>
                     </div>
                     <div className="h-24 bg-white/[0.02] border border-white/[0.05] rounded-xl p-4 flex flex-col justify-between">
                        <span className="text-[11px] text-[#8A8F98]">Active Collaborators</span>
                        <span className="text-2xl font-bold text-[#EDEDED]">12</span>
                     </div>
                  </div>
                  <div className="flex-1 bg-white/[0.02] border border-white/[0.05] rounded-xl p-5 flex flex-col gap-4">
                      <span className="text-[11px] font-medium text-[#EDEDED] mb-1">Recent Activity</span>
                      <div className="flex items-center gap-3 py-2 border-b border-white/[0.05]">
                         <div className="h-8 w-8 rounded-full bg-[#5E6AD2]/10 flex items-center justify-center"><Zap className="h-3.5 w-3.5 text-[#5E6AD2]" /></div>
                         <div className="flex-1"><div className="h-2 w-1/3 bg-white/[0.08] rounded mb-1.5"/><div className="h-1.5 w-1/4 bg-white/[0.04] rounded"/></div>
                         <div className="text-[11px] text-[#8A8F98]">2m ago</div>
                      </div>
                      <div className="flex items-center gap-3 py-2 border-b border-white/[0.05]">
                         <div className="h-8 w-8 rounded-full bg-purple-500/10 flex items-center justify-center"><Globe className="h-3.5 w-3.5 text-purple-400" /></div>
                         <div className="flex-1"><div className="h-2 w-2/5 bg-white/[0.08] rounded mb-1.5"/><div className="h-1.5 w-1/5 bg-white/[0.04] rounded"/></div>
                         <div className="text-[11px] text-[#8A8F98]">1h ago</div>
                      </div>
                      <div className="flex items-center gap-3 py-2">
                         <div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center"><Users className="h-3.5 w-3.5 text-blue-400" /></div>
                         <div className="flex-1"><div className="h-2 w-1/4 bg-white/[0.08] rounded mb-1.5"/><div className="h-1.5 w-1/3 bg-white/[0.04] rounded"/></div>
                         <div className="text-[11px] text-[#8A8F98]">3h ago</div>
                      </div>
                  </div>
               </div>
            </div>
            <div className="absolute bottom-0 inset-x-0 h-1/2 bg-gradient-to-t from-[#5E6AD2]/5 to-transparent pointer-events-none" />
          </div>
        </motion.section>

        {/* 4. How It Works (Workflow) */}
        <section id="how-it-works" className="w-full max-w-6xl mx-auto px-6 mt-40">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-semibold tracking-tighter text-[#EDEDED] mb-6">Designed for velocity.</h2>
            <p className="text-[#8A8F98] text-lg md:text-xl max-w-2xl mx-auto leading-relaxed tracking-tight">
              Axolotl-OS integrates every step of your media pipeline into one seamless, blazingly fast environment.
            </p>
          </div>

          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid md:grid-cols-3 gap-8"
          >
            {[
              { icon: <Database className="h-6 w-6 text-[#5E6AD2]"/>, title: "1. Ingest & Organize", desc: "Upload terabytes of media instantly. Our global CDN handles encoding and organization automatically." },
              { icon: <Code2 className="h-6 w-6 text-[#5E6AD2]"/>, title: "2. Edit & Collaborate", desc: "Work together in real-time. Comments, annotations, and edits sync with sub-millisecond latency." },
              { icon: <PlayCircle className="h-6 w-6 text-[#5E6AD2]"/>, title: "3. Publish Anywhere", desc: "Deploy your media seamlessly to web platforms, custom apps, or through our headless GraphQL API." }
            ].map((step, i) => (
              <motion.div key={i} variants={fadeUp} className="flex flex-col items-center text-center p-6">
                <div className="h-16 w-16 rounded-2xl bg-white/[0.02] border border-white/[0.08] flex items-center justify-center mb-6 shadow-inner">
                  {step.icon}
                </div>
                <h3 className="text-lg font-semibold text-[#EDEDED] mb-3">{step.title}</h3>
                <p className="text-[#8A8F98] text-sm leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* 5. Deep-Dive Alternating Features */}
        <section className="w-full max-w-6xl mx-auto px-6 mt-40 space-y-32">
          {/* Feature Block 1 */}
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}
            className="flex flex-col md:flex-row items-center gap-12"
          >
            <div className="flex-1 w-full aspect-[4/3] rounded-2xl bg-gradient-to-br from-[#111] to-[#050505] border border-white/[0.08] flex items-center justify-center relative overflow-hidden group">
               <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay" />
               
               {/* CSS-based concentric rings & pulsing shield */}
               <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                 <div className="h-[300px] w-[300px] rounded-full border border-[#5E6AD2]/10 absolute animate-[spin_15s_linear_infinite]" />
                 <div className="h-[200px] w-[200px] rounded-full border border-[#5E6AD2]/20 absolute animate-[spin_10s_linear_infinite_reverse]" />
                 <div className="h-[100px] w-[100px] rounded-full border border-[#5E6AD2]/30 absolute animate-pulse" />
               </div>
               
               <div className="h-40 w-40 rounded-full bg-[#5E6AD2]/20 blur-[80px] absolute" />
               <ShieldCheck className="h-20 w-20 text-white/[0.8] z-10 drop-shadow-2xl group-hover:scale-110 transition-transform duration-500" />
            </div>
            <div className="flex-1 flex flex-col gap-6">
               <div className="inline-flex px-3 py-1 rounded-full border border-white/[0.08] bg-white/[0.02] text-xs font-medium text-[#8A8F98] w-fit">Enterprise Security</div>
               <h3 className="text-3xl font-semibold tracking-tighter text-[#EDEDED]">Ironclad protection for your intellectual property.</h3>
               <p className="text-[#8A8F98] text-lg leading-relaxed">Implement granular Row-Level Security (RLS) policies. Ensure your unreleased assets, client projects, and internal media never leak. Built on top of SOC2 compliant infrastructure.</p>
               <ul className="space-y-3 mt-2">
                 {['End-to-end encryption at rest', 'Granular role-based access control (RBAC)', 'Comprehensive audit logs'].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-[#8A8F98]">
                      <CheckCircle2 className="h-4 w-4 text-[#5E6AD2]" /> {item}
                    </li>
                 ))}
               </ul>
            </div>
          </motion.div>

          {/* Feature Block 2 */}
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}
            className="flex flex-col md:flex-row-reverse items-center gap-12"
          >
            <div className="flex-1 w-full aspect-[4/3] rounded-2xl bg-gradient-to-br from-[#111] to-[#050505] border border-white/[0.08] flex items-center justify-center relative overflow-hidden group">
               <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay" />
               
               {/* CSS-based glowing nodes and globe */}
               <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-50">
                  <div className="absolute top-1/4 left-1/4 h-2 w-2 rounded-full bg-purple-500 shadow-[0_0_15px_#A855F7] animate-pulse" />
                  <div className="absolute bottom-1/3 right-1/4 h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_15px_#22D3EE] animate-pulse delay-150" />
                  <div className="absolute top-1/2 right-1/3 h-1.5 w-1.5 rounded-full bg-purple-400 shadow-[0_0_10px_#A855F7] animate-pulse delay-300" />
                  
                  {/* Connecting dashed line */}
                  <svg className="absolute inset-0 h-full w-full opacity-30" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <line x1="25" y1="25" x2="66" y2="50" stroke="url(#gradient)" strokeWidth="0.5" strokeDasharray="2 2" className="animate-[dash_20s_linear_infinite]" />
                    <line x1="66" y1="50" x2="75" y2="66" stroke="url(#gradient)" strokeWidth="0.5" strokeDasharray="2 2" />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#A855F7" />
                        <stop offset="100%" stopColor="#22D3EE" />
                      </linearGradient>
                    </defs>
                  </svg>
               </div>

               <div className="h-40 w-40 rounded-full bg-purple-500/20 blur-[80px] absolute" />
               <Globe className="h-20 w-20 text-white/[0.8] z-10 drop-shadow-2xl group-hover:rotate-12 transition-transform duration-700" />
            </div>
            <div className="flex-1 flex flex-col gap-6">
               <div className="inline-flex px-3 py-1 rounded-full border border-white/[0.08] bg-white/[0.02] text-xs font-medium text-[#8A8F98] w-fit">Global Edge Network</div>
               <h3 className="text-3xl font-semibold tracking-tighter text-[#EDEDED]">Deploy assets instantly, worldwide.</h3>
               <p className="text-[#8A8F98] text-lg leading-relaxed">Our advanced CDN automatically caches and serves your heavy media files closest to your users. Sub-millisecond TTFB means your web platforms feel natively fast.</p>
               <ul className="space-y-3 mt-2">
                 {['Automated image & video optimization', '250+ global edge locations', 'Intelligent cache invalidation'].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-[#8A8F98]">
                      <CheckCircle2 className="h-4 w-4 text-purple-400" /> {item}
                    </li>
                 ))}
               </ul>
            </div>
          </motion.div>
        </section>

        {/* 6. Bento Grid Features (Original but enhanced) */}
        <section id="features" className="w-full max-w-6xl mx-auto px-6 mt-40">
          <div className="mb-12">
            <h2 className="text-3xl font-semibold tracking-tighter text-[#EDEDED] mb-4">Everything else you need.</h2>
            <p className="text-[#8A8F98] text-lg max-w-xl leading-relaxed tracking-tight">A complete suite of tools beautifully designed and aggressively optimized.</p>
          </div>

          <motion.div 
            variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}
            className="grid md:grid-cols-3 gap-4"
          >
            <motion.div variants={fadeUp} className="md:col-span-2 rounded-2xl bg-[#0A0A0A] border border-white/[0.08] p-8 flex flex-col justify-end min-h-[300px] relative overflow-hidden group hover:border-white/[0.15] transition-colors">
              <div className="absolute top-0 right-0 w-full h-full flex items-start justify-end p-6 opacity-20 group-hover:opacity-40 transition-opacity duration-700 pointer-events-none">
                 <div className="relative w-64 h-64 translate-x-12 -translate-y-8">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="absolute inset-0 border border-[#5E6AD2]/30 rounded-xl" style={{ transform: `scale(${1 - i * 0.15}) rotate(${i * 5}deg)`, opacity: 1 - i * 0.2 }} />
                    ))}
                 </div>
              </div>
              <div className="relative z-10">
                <div className="h-10 w-10 rounded-xl bg-white/[0.05] border border-white/[0.1] flex items-center justify-center mb-6"><Database className="h-5 w-5 text-[#EDEDED]" /></div>
                <h3 className="text-xl font-semibold text-[#EDEDED] mb-2 tracking-tight">Unified Asset Library</h3>
                <p className="text-[#8A8F98] text-sm leading-relaxed max-w-md">Store, organize, and retrieve your media instantly. Built on Edge infrastructure for sub-millisecond response times.</p>
              </div>
            </motion.div>
            <motion.div variants={fadeUp} className="rounded-2xl bg-[#0A0A0A] border border-white/[0.08] p-8 flex flex-col justify-end min-h-[300px] relative overflow-hidden group hover:border-white/[0.15] transition-colors">
              <div className="absolute top-8 right-8 text-white/[0.05] group-hover:text-white/[0.1] transition-colors font-mono text-6xl font-black pointer-events-none">
                {'</>'}
              </div>
              <div className="relative z-10">
                <div className="h-10 w-10 rounded-xl bg-white/[0.05] border border-white/[0.1] flex items-center justify-center mb-6"><Layout className="h-5 w-5 text-[#EDEDED]" /></div>
                <h3 className="text-xl font-semibold text-[#EDEDED] mb-2 tracking-tight">Headless CMS</h3>
                <p className="text-[#8A8F98] text-sm leading-relaxed">Markdown-native authoring with instant previews.</p>
              </div>
            </motion.div>
            <motion.div variants={fadeUp} className="rounded-2xl bg-[#0A0A0A] border border-white/[0.08] p-8 flex flex-col justify-end min-h-[300px] relative overflow-hidden group hover:border-white/[0.15] transition-colors">
               <div className="absolute top-10 right-0 left-8 h-32 rounded-tl-xl border-t border-l border-white/[0.05] bg-[#000] p-6 opacity-30 group-hover:opacity-60 transition-opacity flex flex-col gap-2 overflow-hidden pointer-events-none font-mono text-xs text-green-500/50">
                  <div>POST /api/v1/media</div>
                  <div className="text-purple-500/50">{'{\n  "url": "asset.mp4"\n}'}</div>
               </div>
              <div className="relative z-10">
                <h3 className="text-xl font-semibold text-[#EDEDED] mb-2 tracking-tight">API First</h3>
                <p className="text-[#8A8F98] text-sm leading-relaxed">Extensive GraphQL and REST endpoints.</p>
              </div>
            </motion.div>
            <motion.div variants={fadeUp} className="md:col-span-2 rounded-2xl bg-[#0A0A0A] border border-white/[0.08] p-8 flex flex-col justify-end min-h-[300px] relative overflow-hidden group">
               <div className="absolute inset-0 bg-gradient-to-br from-[#5E6AD2]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
               <div className="absolute top-0 right-0 w-1/2 h-full flex items-center justify-center opacity-30 group-hover:opacity-60 transition-all duration-700 pointer-events-none">
                  <div className="relative w-48 h-48">
                     <div className="absolute top-0 left-1/2 w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_10px_#60A5FA] animate-pulse" />
                     <div className="absolute bottom-0 left-0 w-2 h-2 rounded-full bg-purple-400 shadow-[0_0_10px_#C084FC] animate-pulse delay-100" />
                     <div className="absolute bottom-1/4 right-0 w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_10px_#22D3EE] animate-pulse delay-200" />
                     <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
                        <line x1="50" y1="0" x2="0" y2="100" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                        <line x1="0" y1="100" x2="100" y2="75" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                        <line x1="100" y1="75" x2="50" y2="0" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                     </svg>
                  </div>
               </div>
              <div className="relative z-10 w-1/2">
                <div className="h-10 w-10 rounded-xl bg-[#5E6AD2]/10 border border-[#5E6AD2]/20 flex items-center justify-center mb-6"><Zap className="h-5 w-5 text-[#5E6AD2]" /></div>
                <h3 className="text-xl font-semibold text-[#EDEDED] mb-2 tracking-tight">Real-time Collaboration</h3>
                <p className="text-[#8A8F98] text-sm leading-relaxed z-10">Work alongside your team simultaneously. See cursors, edits, and kanban updates happen in real-time.</p>
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* 7. Testimonials / Community */}
        <section id="testimonials" className="w-full max-w-6xl mx-auto px-6 mt-40">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-semibold tracking-tighter text-[#EDEDED] mb-4">Loved by creators.</h2>
            <p className="text-[#8A8F98] text-lg max-w-xl mx-auto leading-relaxed tracking-tight">Don't just take our word for it. See what industry leaders are saying.</p>
          </div>
          
          <motion.div 
            variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}
            className="grid md:grid-cols-3 gap-6"
          >
            {[
              { text: "Moving our small agency's workflow to Axolotl-OS was the best decision we made this year. Asset organization used to be a nightmare, but now everything is perfectly centralized.", author: "Marcus Thorne", role: "Creative Director at Echo Studios" },
              { text: "As a freelance web developer, integrating media has always been a pain. The headless CMS and API provided here saved me dozens of hours on my latest client project.", author: "Sarah Lin", role: "Independent Developer" },
              { text: "We manage confidential video assets for a few high-profile indie clients. The Row-Level Security ensures that our client data never accidentally leaks. Highly recommended.", author: "James Peterson", role: "Co-founder, Vora Media" }
            ].map((review, i) => (
              <motion.div key={i} variants={fadeUp} className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] transition-colors flex flex-col gap-4">
                 <div className="flex gap-1 text-yellow-500">
                   {[...Array(5)].map((_, j) => <Star key={j} className="h-4 w-4 fill-current" />)}
                 </div>
                 <p className="text-[#EDEDED] text-sm leading-relaxed flex-1">"{review.text}"</p>
                 <div className="flex items-center gap-3 mt-4 pt-4 border-t border-white/[0.05]">
                    <div className="h-8 w-8 rounded-full bg-white/[0.1]" />
                    <div>
                      <p className="text-xs font-semibold text-white">{review.author}</p>
                      <p className="text-[10px] text-[#8A8F98]">{review.role}</p>
                    </div>
                 </div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* 8. Final CTA */}
        <motion.section 
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}
          className="w-full max-w-5xl mx-auto px-6 mt-40 mb-20"
        >
          <div className="w-full rounded-3xl bg-gradient-to-br from-[#1A1D36] to-[#0A0A0A] border border-[#5E6AD2]/20 p-12 md:p-20 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg h-full bg-[#5E6AD2]/10 blur-[100px] pointer-events-none" />
            
            <div className="relative z-10 flex flex-col items-center">
              <h2 className="text-4xl md:text-5xl font-semibold tracking-tighter text-white mb-6">Ready to build the future?</h2>
              <p className="text-[#8A8F98] text-lg max-w-xl mx-auto mb-10">Join thousands of creators managing their workflows on Axolotl-OS today.</p>
              <Link to={isAuthenticated ? "/dashboard" : "/register"}>
                <button className="h-14 px-8 rounded-full bg-white text-black text-[15px] font-bold hover:bg-[#EDEDED] transition-transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 shadow-[0_0_40px_rgba(255,255,255,0.15)]">
                  Start building for free <ArrowRight className="h-4 w-4" />
                </button>
              </Link>
            </div>
          </div>
        </motion.section>

      </main>

      <footer className="border-t border-white/[0.08] py-12 relative z-10 bg-[#000000]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="Axolotl Logo" className="h-5 w-auto object-contain grayscale opacity-70" />
            <span className="text-[13px] font-medium text-[#8A8F98]">© {new Date().getFullYear()} Axolotl Web Media</span>
          </div>
          <div className="flex gap-6 text-[13px] text-[#8A8F98]">
            <a href="#" className="hover:text-white transition-colors">Twitter</a>
            <a href="#" className="hover:text-white transition-colors">GitHub</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
