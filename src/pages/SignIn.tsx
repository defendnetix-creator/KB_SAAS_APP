import React, { useState } from 'react';
import { LayoutGrid } from 'lucide-react';
import { motion } from 'motion/react';
import { BrandingSection } from '../components/BrandingSection';
import { LoginForm } from '../components/LoginForm';
import { RoleToggle } from '../components/RoleToggle';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export const SignIn = () => {
  const [role, setRole] = useState<'employee' | 'admin'>('employee');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      if (data.user && data.session) {
        const userRole = (data.user.user_metadata?.role as 'ADMIN' | 'USER') || 'USER';
        console.log('Login successful. Detected role from Supabase metadata:', userRole);
        
        const user = {
          id: data.user.id,
          email: data.user.email!,
          firstName: data.user.user_metadata?.firstName || 'User',
          lastName: data.user.user_metadata?.lastName || '',
          role: userRole,
          organization: {
            id: 'org-1',
            name: 'Enterprise Corp'
          }
        };
        
        login(data.session.access_token, user);

        // Role-based navigation
        if (role === 'admin' && userRole === 'ADMIN') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Invalid login credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex w-full bg-white overflow-x-hidden">
      <BrandingSection />

      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 md:p-8 lg:p-10 bg-slate-50/30 min-h-screen overflow-y-auto">
        <div className="lg:hidden flex items-center gap-3 mb-8 self-start">
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
          <div className="mb-1">
            <h2 className="text-slate-900 text-3xl font-black tracking-tight mb-1">
              {role === 'admin' ? 'Admin Portal' : 'Welcome Back'}
            </h2>
            <p className="text-slate-500 text-lg font-medium">
              {role === 'admin' 
                ? 'Access the management console to update the knowledge base.' 
                : 'Please enter your credentials to access the internal knowledge base.'}
            </p>
          </div>

          <RoleToggle role={role} setRole={setRole} />

          {error && (
            <div className="mb-1 p-2 bg-red-50 border border-red-100 text-red-600 rounded-xl text-xs font-bold">
              {error}
            </div>
          )}

          <LoginForm 
            email={email} 
            setEmail={setEmail} 
            password={password} 
            setPassword={setPassword} 
            onSubmit={handleSignIn} 
            loading={loading}
          />

          <p className="mt-2 text-center text-sm font-bold text-slate-500">
            Don't have an account?{' '}
            <Link to="/signup" className="text-blue-600 hover:underline">
              Sign Up
            </Link>
          </p>

          <div className="mt-1 pt-1 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
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
};
