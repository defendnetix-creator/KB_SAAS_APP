import React, { useState, useEffect } from 'react';
import { X, Save, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import apiClient from '../services/apiClient';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import toast from 'react-hot-toast';

interface ArticleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  articleId?: string | null;
}

export const ArticleModal: React.FC<ArticleModalProps> = ({ isOpen, onClose, onSuccess, articleId }) => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    categoryId: '',
    status: 'PUBLISHED'
  });

  useEffect(() => {
    if (isOpen) {
      const fetchCategories = async () => {
        try {
          const res = await apiClient.get('/categories');
          setCategories(res.data);
          if (res.data.length > 0 && !formData.categoryId && !articleId) {
            setFormData(prev => ({ ...prev, categoryId: res.data[0].id }));
          }
        } catch (err) {
          console.error('Failed to fetch categories', err);
        }
      };
      fetchCategories();

      if (articleId) {
        const fetchArticle = async () => {
          setFetching(true);
          try {
            const res = await apiClient.get(`/articles/${articleId}`);
            setFormData({
              title: res.data.title,
              content: res.data.content,
              categoryId: res.data.categoryId,
              status: res.data.status
            });
          } catch (err) {
            toast.error('Failed to fetch article details');
            onClose();
          } finally {
            setFetching(false);
          }
        };
        fetchArticle();
      } else {
        setFormData({ title: '', content: '', categoryId: '', status: 'PUBLISHED' });
      }
    }
  }, [isOpen, articleId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.categoryId) return toast.error('Please select a category');
    
    setLoading(true);
    try {
      if (articleId) {
        await apiClient.put(`/articles/${articleId}`, formData);
        toast.success('Article updated successfully');
      } else {
        await apiClient.post('/articles', formData);
        toast.success('Article created successfully');
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

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['link', 'code-block'],
      ['clean']
    ],
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white w-full max-w-4xl h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col"
          >
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div>
                <h3 className="text-xl font-black text-slate-900">{articleId ? 'Edit Article' : 'Create New Article'}</h3>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {articleId ? 'Update existing knowledge base entry' : 'Draft a new knowledge base entry'}
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
              <div className="flex-1 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Article Title</label>
                  <input
                    required
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., How to configure VPN on macOS"
                    className="w-full h-12 px-4 bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 rounded-xl text-slate-900 placeholder:text-slate-400 transition-all outline-none font-bold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Category</label>
                    <select
                      required
                      value={formData.categoryId}
                      onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                      className="w-full h-12 px-4 bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 rounded-xl text-slate-900 transition-all outline-none font-bold"
                    >
                      <option value="" disabled>Select a category</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Initial Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full h-12 px-4 bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 rounded-xl text-slate-900 transition-all outline-none font-bold"
                    >
                      <option value="PUBLISHED">Published</option>
                      <option value="DRAFT">Draft</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2 flex-1 flex flex-col min-h-[300px]">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Content</label>
                  <div className="flex-1 bg-slate-50 rounded-xl border border-slate-200 overflow-hidden flex flex-col">
                    <ReactQuill 
                      theme="snow"
                      value={formData.content}
                      onChange={(content) => setFormData({ ...formData, content })}
                      modules={modules}
                      className="flex-1 h-full overflow-y-auto"
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4 sticky bottom-0 bg-white pb-4">
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
                    {articleId ? 'Update Article' : 'Save Article'}
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
