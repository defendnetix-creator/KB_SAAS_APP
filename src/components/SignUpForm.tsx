import React, { useState } from 'react';
import { motion } from 'motion/react';
import { AtSign, Lock, Eye, EyeOff, ChevronRight, User, RefreshCw } from 'lucide-react';

interface SignUpFormProps {
  email: string;
  setEmail: (val: string) => void;
  password: string;
  setPassword: (val: string) => void;
  firstName: string;
  setFirstName: (val: string) => void;
  lastName: string;
  setLastName: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading?: boolean;
}

export const SignUpForm = ({ 
  email, setEmail, 
  password, setPassword, 
  firstName, setFirstName,
  lastName, setLastName,
  onSubmit,
  loading
}: SignUpFormProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="w-full">
      <form className="space-y-3" onSubmit={onSubmit}>
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-2">
            <label className="text-slate-900 text-sm font-bold flex items-center gap-2 ml-1">
              <User className="w-4 h-4 text-slate-400" />
              First Name
            </label>
            <input 
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="John"
              required
              disabled={loading}
              className="w-full h-12 px-5 bg-white border border-slate-200 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all duration-200 font-medium disabled:opacity-50"
            />
          </div>
          <div className="space-y-2">
            <label className="text-slate-900 text-sm font-bold flex items-center gap-2 ml-1">
              <User className="w-4 h-4 text-slate-400" />
              Last Name
            </label>
            <input 
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Doe"
              required
              disabled={loading}
              className="w-full h-12 px-5 bg-white border border-slate-200 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all duration-200 font-medium disabled:opacity-50"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-slate-900 text-sm font-bold flex items-center gap-2 ml-1">
            <AtSign className="w-4 h-4 text-slate-400" />
            Email Address
          </label>
          <input 
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="j.doe@company.com"
            required
            disabled={loading}
            className="w-full h-12 px-5 bg-white border border-slate-200 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all duration-200 font-medium disabled:opacity-50"
          />
        </div>

        <div className="space-y-2">
          <label className="text-slate-900 text-sm font-bold flex items-center gap-2 ml-1">
            <Lock className="w-4 h-4 text-slate-400" />
            Password
          </label>
          <div className="relative group">
            <input 
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={loading}
              className="w-full h-12 px-5 bg-white border border-slate-200 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all duration-200 font-medium disabled:opacity-50"
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <motion.button 
          whileHover={{ scale: loading ? 1 : 1.01 }}
          whileTap={{ scale: loading ? 1 : 0.99 }}
          disabled={loading}
          className="w-full h-12 bg-blue-600 text-white rounded-2xl font-bold text-lg shadow-lg shadow-blue-600/25 hover:bg-blue-700 transition-all duration-200 flex items-center justify-center gap-2 mt-1 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? (
            <RefreshCw className="w-5 h-5 animate-spin" />
          ) : (
            <>
              Create Account
              <ChevronRight className="w-5 h-5" />
            </>
          )}
        </motion.button>
      </form>
    </div>
  );
};
