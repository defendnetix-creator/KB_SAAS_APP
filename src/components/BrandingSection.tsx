import { motion } from 'motion/react';
import { LayoutGrid, Shield } from 'lucide-react';

export const BrandingSection = () => {
  return (
    <div className="hidden lg:flex lg:w-1/2 relative bg-blue-600 items-center justify-center overflow-hidden">
      <div 
        className="absolute inset-0 z-0 opacity-20 mix-blend-overlay bg-cover bg-center"
        style={{ 
          backgroundImage: "url('https://picsum.photos/seed/enterprise/1200/1200?blur=2')"
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/90 via-blue-700/95 to-indigo-900/95 z-10" />
      
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-20 p-4 max-w-lg text-white"
      >
        <div className="mb-2">
          <motion.div 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="w-8 h-8 bg-white/20 backdrop-blur-md rounded-lg flex items-center justify-center mb-3 border border-white/20"
          >
            <LayoutGrid className="w-4 h-4 text-white" />
          </motion.div>
          
          <h1 className="text-2xl font-extrabold tracking-tight leading-[1.1] mb-2">
            Enterprise <br />
            <span className="text-blue-200">Knowledge Base</span>
          </h1>
          
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: 40 }}
            className="h-1 bg-blue-400 rounded-full mb-3" 
          />
          
          <p className="text-base text-blue-50 font-medium leading-relaxed opacity-90">
            The central hub for all IT troubleshooting workflows, documentation, and system insights.
          </p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex items-center gap-2 bg-white/10 backdrop-blur-md p-2 rounded-xl border border-white/10 shadow-2xl"
        >
          <div className="p-1 bg-blue-500/30 rounded-lg">
            <Shield className="w-4 h-4 text-blue-200" />
          </div>
          <p className="text-[10px] font-semibold tracking-wide text-blue-50">
            Secured with Enterprise-grade AES-256 Encryption
          </p>
        </motion.div>
      </motion.div>

      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-[-10%] left-[-10%] w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl" />
    </div>
  );
};
