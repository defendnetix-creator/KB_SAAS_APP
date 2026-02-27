import { motion } from 'motion/react';

interface RoleToggleProps {
  role: 'employee' | 'admin';
  setRole: (role: 'employee' | 'admin') => void;
}

export const RoleToggle = ({ role, setRole }: RoleToggleProps) => {
  return (
    <div className="mb-1 p-1.5 bg-slate-200/50 rounded-2xl flex items-center relative">
      <motion.div
        className="absolute h-[calc(100%-12px)] bg-white rounded-xl shadow-sm z-0"
        initial={false}
        animate={{
          width: 'calc(50% - 6px)',
          x: role === 'employee' ? 0 : 'calc(100% + 0px)',
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      />
      <button
        onClick={() => setRole('employee')}
        className={`flex-1 py-2 text-sm font-bold z-10 transition-colors duration-200 ${
          role === 'employee' ? 'text-slate-900' : 'text-slate-500'
        }`}
      >
        Employee Login
      </button>
      <button
        onClick={() => setRole('admin')}
        className={`flex-1 py-2 text-sm font-bold z-10 transition-colors duration-200 ${
          role === 'admin' ? 'text-slate-900' : 'text-slate-500'
        }`}
      >
        Admin Portal
      </button>
    </div>
  );
};
