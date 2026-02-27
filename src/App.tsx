/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { LayoutGrid } from 'lucide-react';
import { motion } from 'motion/react';
import { BrandingSection } from './components/BrandingSection';
import { RoleToggle } from './components/RoleToggle';
import { LoginForm } from './components/LoginForm';
import { useAuth } from './context/AuthContext';
import { useNavigate } from 'react-router-dom';
import apiClient from './services/apiClient';

export default function App() {
  const [role, setRole] = useState<'employee' | 'admin'>('employee');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await apiClient.post('/auth/login', { email, password });
      login(res.data.token, res.data.user);
      navigate('/admin');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex w-full bg-white overflow-hidden">
      <BrandingSection />

      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 md:p-12 lg:p-24 bg-slate-50/30">
        <div className="lg:hidden absolute top-8 left-8 flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-lg">
            <LayoutGrid className="w-6 h-6 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-900">Enterprise KB</span>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="mb-10">
            <h2 className="text-slate-900 text-4xl font-black tracking-tight mb-3">
              Welcome Back
            </h2>
            <p className="text-slate-500 text-lg font-medium">
              Please enter your credentials to access the internal knowledge base.
            </p>
          </div>

          <RoleToggle role={role} setRole={setRole} />

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-bold">
              {error}
            </div>
          )}

          <LoginForm 
            email={email} 
            setEmail={setEmail} 
            password={password} 
            setPassword={setPassword} 
            onSubmit={handleLogin} 
          />

          <div className="mt-16 pt-8 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            <p>© 2024 Enterprise IT Knowledge Base</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-blue-600 transition-colors">Help Desk</a>
              <a href="#" className="hover:text-blue-600 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-blue-600 transition-colors">Terms</a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
