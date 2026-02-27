import { Outlet, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Bell, User as UserIcon, LogOut, Search } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export const UserLayout = () => {
  const { user, logout } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="h-20 px-8 flex items-center justify-between border-b border-slate-100 sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
            <Search className="w-6 h-6 text-white rotate-90" />
          </div>
          <span className="text-xl font-black text-slate-900 tracking-tight">IT Support Hub</span>
        </div>

        <div className="flex items-center gap-4">
          <button className="p-2.5 bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>

          <button 
            onClick={logout}
            className="hidden md:flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>

          <div className="relative">
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="w-10 h-10 rounded-full overflow-hidden border-2 border-slate-100 hover:border-blue-500 transition-all"
            >
              <img 
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.firstName}`} 
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </button>

            <AnimatePresence>
              {isProfileOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setIsProfileOpen(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-3 w-64 bg-white border border-slate-100 rounded-2xl shadow-2xl z-50 overflow-hidden"
                  >
                    <div className="p-4 border-b border-slate-50 bg-slate-50/50">
                      <p className="font-bold text-slate-900">{user?.firstName} {user?.lastName}</p>
                      <p className="text-xs text-slate-500 font-medium">{user?.email}</p>
                    </div>
                    <div className="p-2">
                      {user?.role === 'ADMIN' && (
                        <Link 
                          to="/admin"
                          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-slate-600 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all"
                        >
                          <UserIcon className="w-4 h-4" />
                          Admin Console
                        </Link>
                      )}
                      <button 
                        onClick={logout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 rounded-xl transition-all"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="py-12 px-8 border-t border-slate-100 bg-slate-50/30">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-sm font-bold text-slate-400">
            © {new Date().getFullYear()} Corporate IT Knowledge Base
          </p>
          <div className="flex items-center gap-8">
            <a href="#" className="text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors">System Status</a>
            <a href="#" className="text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors">Privacy Policy</a>
            <a href="#" className="text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors">Help Desk</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
