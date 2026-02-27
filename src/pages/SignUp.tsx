import React, { useState } from 'react';
import { LayoutGrid } from 'lucide-react';
import { motion } from 'motion/react';
import { BrandingSection } from '../components/BrandingSection';
import { SignUpForm } from '../components/SignUpForm';
import { RoleToggle } from '../components/RoleToggle';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabaseClient';
import toast from 'react-hot-toast';

export const SignUp = () => {
  const [role, setRole] = useState<'employee' | 'admin'>('employee');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            firstName,
            lastName,
            role: role === 'admin' ? 'ADMIN' : 'USER',
          }
        }
      });

      if (authError) throw authError;

      if (data.user) {
        if (data.session) {
          const user = {
            id: data.user.id,
            email: data.user.email!,
            firstName: data.user.user_metadata?.firstName || firstName,
            lastName: data.user.user_metadata?.lastName || lastName,
            role: (data.user.user_metadata?.role as 'ADMIN' | 'USER') || 'USER',
            organization: {
              id: 'org-1',
              name: 'Enterprise Corp'
            }
          };
          login(data.session.access_token, user);
          toast.success('Account created and logged in!');
          
          if (role === 'admin' && user.role === 'ADMIN') {
            navigate('/admin');
          } else {
            navigate('/');
          }
        } else {
          toast.success('Account created! Please check your email or sign in.');
          navigate('/login');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
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
              {role === 'admin' ? 'Admin Registration' : 'Join the Hub'}
            </h2>
            <p className="text-slate-500 text-lg font-medium">
              {role === 'admin' 
                ? 'Create an administrator account to manage resources.' 
                : 'Create your account to access the internal knowledge base.'}
            </p>
          </div>

          <RoleToggle role={role} setRole={setRole} />

          {error && (
            <div className="mb-1 p-2 bg-red-50 border border-red-100 text-red-600 rounded-xl text-xs font-bold">
              {error}
            </div>
          )}

          <SignUpForm 
            email={email} 
            setEmail={setEmail} 
            password={password} 
            setPassword={setPassword} 
            firstName={firstName}
            setFirstName={setFirstName}
            lastName={lastName}
            setLastName={setLastName}
            onSubmit={handleSignUp} 
            loading={loading}
          />

          <p className="mt-2 text-center text-sm font-bold text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:underline">
              Sign In
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
