import React, { useState, useEffect } from 'react';
import { X, Save, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import apiClient from '../services/apiClient';
import toast from 'react-hot-toast';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  categoryId?: string | null;
}

export const CategoryModal: React.FC<CategoryModalProps> = ({ isOpen, onClose, onSuccess, categoryId }) => {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: 'server',
    status: 'ACTIVE'
  });

  useEffect(() => {
    if (isOpen) {
      if (categoryId) {
        const fetchCategory = async () => {
          setFetching(true);
          try {
            const res = await apiClient.get('/categories');
            const cat = res.data.find((c: any) => c.id === categoryId);
            if (cat) {
              setFormData({
                name: cat.name,
                description: cat.description || '',
                icon: cat.icon || 'server',
                status: cat.status
              });
            }
          } catch (err) {
            toast.error('Failed to fetch category details');
            onClose();
          } finally {
            setFetching(false);
          }
        };
        fetchCategory();
      } else {
        setFormData({ name: '', description: '', icon: 'server', status: 'ACTIVE' });
      }
    }
  }, [isOpen, categoryId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (categoryId) {
        await apiClient.put(`/categories/${categoryId}`, formData);
        toast.success('Category updated successfully');
      } else {
        await apiClient.post('/categories', formData);
        toast.success('Category created successfully');
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      const message = err.response?.data?.message || 'Operation failed. Please try again.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const icons = ['server', 'network', 'cloud', 'security', 'mobile', 'hard-drive'];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div>
                <h3 className="text-xl font-black text-slate-900">{categoryId ? 'Edit Category' : 'Add New Category'}</h3>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {categoryId ? 'Update structural node' : 'Define a new structural node'}
                </p>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {fetching ? (
              <div className="p-12 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Category Name</label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Network Infrastructure"
                    className="w-full h-12 px-4 bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 rounded-xl text-slate-900 placeholder:text-slate-400 transition-all outline-none font-bold"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Icon Selection</label>
                  <div className="grid grid-cols-6 gap-2">
                    {icons.map(icon => (
                      <button
                        key={icon}
                        type="button"
                        onClick={() => setFormData({ ...formData, icon })}
                        className={`p-3 rounded-xl border transition-all ${
                          formData.icon === icon 
                            ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/20' 
                            : 'bg-slate-50 border-slate-200 text-slate-400 hover:border-blue-500 hover:text-blue-500'
                        }`}
                      >
                        <span className="text-[8px] font-black uppercase tracking-tighter">{icon.slice(0, 3)}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    placeholder="Briefly describe this category..."
                    className="w-full p-4 bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 rounded-xl text-slate-900 placeholder:text-slate-400 transition-all outline-none font-medium resize-none"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 h-12 rounded-xl font-bold text-slate-500 hover:bg-slate-50 transition-all border border-slate-200"
                  >
                    Cancel
                  </button>
                  <button
                    disabled={loading}
                    type="submit"
                    className="flex-[2] h-12 bg-blue-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all disabled:opacity-50"
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Save className="w-5 h-5" />
                    )}
                    {categoryId ? 'Update Category' : 'Save Category'}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
