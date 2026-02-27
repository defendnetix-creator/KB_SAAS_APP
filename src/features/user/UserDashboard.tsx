import { useState, useEffect, useMemo } from 'react';
import { Search, FileText, History, Pin, Server, Network, Cloud, HardDrive, Headphones, ArrowRight, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import apiClient from '../../services/apiClient';
import { Link, useNavigate } from 'react-router-dom';
import debounce from 'lodash/debounce';

export const UserDashboard = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const fetchArticles = async (query = '') => {
    try {
      const res = await apiClient.get(`/articles?search=${query}`);
      setArticles(res.data);
    } catch (err) {
      console.error('Failed to fetch articles', err);
    }
  };

  const debouncedFetch = useMemo(
    () => debounce((query: string) => fetchArticles(query), 300),
    []
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const catRes = await apiClient.get('/categories');
        setCategories(catRes.data);
        await fetchArticles();
      } catch (err) {
        console.error('Failed to fetch data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    return () => debouncedFetch.cancel();
  }, [debouncedFetch]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    debouncedFetch(value);
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'server': return Server;
      case 'network': return Network;
      case 'cloud': return Cloud;
      case 'hardware': return HardDrive;
      default: return FileText;
    }
  };

  return (
    <div className="pb-20">
      {/* Hero Section */}
      <section className="py-20 px-8 bg-gradient-to-b from-slate-50/50 to-white">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-black text-slate-900 tracking-tight"
          >
            How can we help you today?
          </motion.h1>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="relative max-w-2xl mx-auto"
          >
            <div className="relative group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
              <input 
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search for IT solutions..."
                className="w-full h-16 pl-16 pr-32 bg-white border-2 border-slate-100 focus:border-blue-500 rounded-2xl shadow-xl shadow-slate-200/50 text-lg font-medium outline-none transition-all"
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 bg-blue-600 text-white px-8 py-3 rounded-xl font-black text-sm uppercase tracking-wider hover:bg-blue-700 transition-all">
                Search
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-8 space-y-20">
        {/* Search Results / Recent Articles */}
        {searchQuery && (
          <section className="space-y-6">
            <div className="flex items-center gap-2 text-blue-600">
              <Search className="w-5 h-5" />
              <h2 className="text-lg font-black uppercase tracking-wider">Search Results</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {articles.length === 0 ? (
                <div className="col-span-full py-12 text-center text-slate-400 font-bold">No articles found matching your search.</div>
              ) : (
                articles.map((article) => (
                  <Link 
                    key={article.id} 
                    to={`/kb/${article.id}`}
                    className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:border-blue-500 transition-all group"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-wider">
                        {article.category?.name || 'Uncategorized'}
                      </span>
                      <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                    </div>
                    <h3 className="text-xl font-black text-slate-900 mb-2">{article.title}</h3>
                    <p className="text-sm text-slate-500 font-medium line-clamp-2">{article.content.replace(/[#*`]/g, '').slice(0, 120)}...</p>
                  </Link>
                ))
              )}
            </div>
          </section>
        )}

        {/* Overview Cards */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 text-blue-600">
            <div className="w-5 h-5 bg-blue-600 rounded flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
            <h2 className="text-lg font-black uppercase tracking-wider">My Overview</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm"
            >
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Total Articles Available</p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-slate-900">{articles.length}</span>
                <span className="text-sm font-bold text-blue-600">Resources</span>
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4"
            >
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Recent Articles</p>
              <div className="space-y-3">
                {articles.slice(0, 2).map(article => (
                  <Link key={article.id} to={`/kb/${article.id}`} className="flex items-center gap-2 text-slate-600 hover:text-blue-600 cursor-pointer transition-colors group">
                    <History className="w-4 h-4 text-slate-300 group-hover:text-blue-400" />
                    <span className="text-sm font-bold truncate">{article.title}</span>
                  </Link>
                ))}
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4"
            >
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Popular Guides</p>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-slate-600 hover:text-blue-600 cursor-pointer transition-colors group">
                  <Pin className="w-4 h-4 text-slate-300 group-hover:text-blue-400" />
                  <span className="text-sm font-bold">Password Reset Policy</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600 hover:text-blue-600 cursor-pointer transition-colors group">
                  <Pin className="w-4 h-4 text-slate-300 group-hover:text-blue-400" />
                  <span className="text-sm font-bold">Remote Desktop</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Browse Categories */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 text-blue-600">
            <div className="grid grid-cols-2 gap-0.5">
              <div className="w-2 h-2 bg-blue-600 rounded-sm"></div>
              <div className="w-2 h-2 bg-blue-600 rounded-sm"></div>
              <div className="w-2 h-2 bg-blue-600 rounded-sm"></div>
              <div className="w-2 h-2 bg-blue-600 rounded-sm"></div>
            </div>
            <h2 className="text-lg font-black uppercase tracking-wider">Browse by Category</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
              [1, 2, 3, 4].map(i => (
                <div key={i} className="h-64 bg-slate-50 rounded-3xl animate-pulse"></div>
              ))
            ) : (
              categories.map((category) => {
                const Icon = getIcon(category.icon);
                return (
                  <motion.div
                    key={category.id}
                    whileHover={{ y: -8, boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                    onClick={() => {
                      setSearchQuery(category.name);
                      fetchArticles(category.name);
                    }}
                    className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm text-center group transition-all cursor-pointer"
                  >
                    <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mx-auto mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                      <Icon className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-black text-slate-900 mb-1">{category.name}</h3>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                      {category._count?.articles || 0} Articles
                    </p>
                  </motion.div>
                );
              })
            )}
          </div>
        </section>

        {/* Contact CTA */}
        <section>
          <div className="bg-blue-50 rounded-[2rem] p-12 flex flex-col md:flex-row items-center justify-between gap-8 border border-blue-100">
            <div className="flex items-center gap-8">
              <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center shadow-xl shadow-blue-600/30">
                <Headphones className="w-10 h-10 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-900 mb-2">Can't find what you're looking for?</h3>
                <p className="text-slate-600 font-medium">Our support team is available 24/7 to help you with any technical issues.</p>
              </div>
            </div>
            <button className="bg-blue-600 text-white px-10 py-5 rounded-2xl font-black text-lg shadow-xl shadow-blue-600/20 hover:bg-blue-700 hover:scale-105 transition-all whitespace-nowrap">
              Contact IT Support
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};
