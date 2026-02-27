import { useEffect, useState } from 'react';
import { FileText, Clock, Eye, Activity, TrendingUp, TrendingDown } from 'lucide-react';
import { motion } from 'motion/react';
import apiClient from '../../services/apiClient';

export const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalArticles: 0,
    pendingReviews: 14,
    totalViews: '45.2k',
    systemHealth: '99.9%'
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await apiClient.get('/articles');
        setStats(prev => ({ ...prev, totalArticles: res.data.length }));
      } catch (err) {
        console.error(err);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { label: 'Total Articles', value: stats.totalArticles, trend: '+12%', trendUp: true, icon: FileText, color: 'blue', bg: 'bg-blue-50', text: 'text-blue-600' },
    { label: 'Pending Reviews', value: stats.pendingReviews, badge: 'HIGH PRIORITY', icon: Clock, color: 'orange', bg: 'bg-orange-50', text: 'text-orange-600' },
    { label: 'Total Views', value: stats.totalViews, trend: '+5%', trendUp: true, icon: Eye, color: 'indigo', bg: 'bg-indigo-50', text: 'text-indigo-600' },
    { label: 'System Health', value: stats.systemHealth, badge: 'STABLE', icon: Activity, color: 'emerald', bg: 'bg-emerald-50', text: 'text-emerald-600' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">System Overview</h2>
        <p className="text-slate-500 font-medium">Monitoring real-time health across Network, Servers, and Office 365 services.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2 rounded-xl ${card.bg}`}>
                <card.icon className={`w-6 h-6 ${card.text}`} />
              </div>
              {card.trend && (
                <div className={`flex items-center gap-1 text-xs font-bold ${card.trendUp ? 'text-emerald-600' : 'text-red-600'}`}>
                  {card.trendUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {card.trend}
                </div>
              )}
              {card.badge && (
                <span className={`text-[10px] font-black px-2 py-1 rounded-md ${card.bg} ${card.text} uppercase tracking-wider`}>
                  {card.badge}
                </span>
              )}
            </div>
            <p className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">{card.label}</p>
            <h3 className="text-3xl font-black text-slate-900">{card.value}</h3>
            <p className="text-xs text-slate-400 font-bold mt-2">Vs last 30 days</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-black text-slate-900">Content Performance</h3>
            <select className="bg-slate-50 border-slate-200 rounded-lg text-sm font-bold px-3 py-2 outline-none">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-64 flex items-end gap-2">
            {/* Placeholder for Chart */}
            <div className="flex-1 bg-blue-50 rounded-t-lg h-[40%]"></div>
            <div className="flex-1 bg-blue-100 rounded-t-lg h-[60%]"></div>
            <div className="flex-1 bg-blue-200 rounded-t-lg h-[45%]"></div>
            <div className="flex-1 bg-blue-300 rounded-t-lg h-[80%]"></div>
            <div className="flex-1 bg-blue-400 rounded-t-lg h-[55%]"></div>
            <div className="flex-1 bg-blue-500 rounded-t-lg h-[90%]"></div>
            <div className="flex-1 bg-blue-600 rounded-t-lg h-[70%]"></div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-black text-slate-900">Recent Activity</h3>
            <button className="text-blue-600 text-xs font-black uppercase tracking-wider hover:underline">View All</button>
          </div>
          <div className="space-y-6">
            {[
              { user: 'John Doe', action: "updated 'O365 Outlook Sync'", time: '5 minutes ago', bg: 'bg-blue-50', dot: 'bg-blue-500' },
              { user: 'Sarah Chen', action: "submitted 'VPN Tunneling Issues'", time: '12 minutes ago', bg: 'bg-emerald-50', dot: 'bg-emerald-500' },
              { user: 'Admin System', action: "archived 'Legacy Server 2008 R2'", time: '1 hour ago', bg: 'bg-red-50', dot: 'bg-red-500' },
            ].map((item, i) => (
              <div key={i} className="flex gap-4">
                <div className={`w-10 h-10 rounded-full ${item.bg} flex items-center justify-center flex-shrink-0`}>
                  <div className={`w-2 h-2 rounded-full ${item.dot}`}></div>
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">
                    {item.user} <span className="text-slate-500 font-medium">{item.action}</span>
                  </p>
                  <p className="text-xs text-slate-400 font-bold mt-1">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
