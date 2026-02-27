import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Search, 
  Eye, 
  Edit2, 
  Trash2, 
  ChevronLeft, 
  ChevronRight,
  Plus,
  Loader2
} from 'lucide-react';
import { motion } from 'motion/react';
import apiClient from '../../services/apiClient';
import { format } from 'date-fns';
import { ArticleModal } from '../../components/ArticleModal';
import { PreviewModal } from '../../components/PreviewModal';
import { ConfirmationModal } from '../../components/ConfirmationModal';
import toast from 'react-hot-toast';
import debounce from 'lodash/debounce';

export const ArticlesManagement = () => {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();

  const fetchArticles = async (query = '') => {
    setLoading(true);
    try {
      const res = await apiClient.get(`/articles?search=${query}`);
      setArticles(res.data);
    } catch (err) {
      toast.error('Failed to fetch articles');
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetch = useMemo(
    () => debounce((query: string) => fetchArticles(query), 300),
    []
  );

  useEffect(() => {
    return () => {
      debouncedFetch.cancel();
    };
  }, [debouncedFetch]);

  useEffect(() => {
    fetchArticles();
  }, []);

  const action = searchParams.get('action');
  useEffect(() => {
    if (action === 'new') {
      setIsModalOpen(true);
      setSearchParams(prev => {
        const next = new URLSearchParams(prev);
        next.delete('action');
        return next;
      }, { replace: true });
    }
  }, [action, setSearchParams]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    debouncedFetch(value);
  };

  const handleEdit = (article: any) => {
    setSelectedArticle(article);
    setIsModalOpen(true);
  };

  const handlePreview = (article: any) => {
    setSelectedArticle(article);
    setIsPreviewOpen(true);
  };

  const handleDeleteClick = (article: any) => {
    setSelectedArticle(article);
    setIsDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedArticle) return;
    setLoading(true);
    try {
      await apiClient.delete(`/articles/${selectedArticle.id}`);
      toast.success('Article deleted successfully');
      fetchArticles(searchQuery);
      setIsDeleteOpen(false);
    } catch (err) {
      toast.error('Failed to delete article');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PUBLISHED': return 'bg-emerald-50 text-emerald-600';
      case 'DRAFT': return 'bg-blue-50 text-blue-600';
      case 'ARCHIVED': return 'bg-orange-50 text-orange-600';
      default: return 'bg-slate-50 text-slate-600';
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Articles Management</h2>
          <p className="text-slate-500 font-medium">Review, edit, and organize internal IT knowledge base articles.</p>
        </div>
        <button 
          onClick={() => {
            setSelectedArticle(null);
            setIsModalOpen(true);
          }}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all"
        >
          <Plus className="w-5 h-5" />
          Create New Article
        </button>
      </div>

      <ArticleModal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          setSelectedArticle(null);
        }} 
        onSuccess={() => fetchArticles(searchQuery)} 
        articleId={selectedArticle?.id}
      />

      <PreviewModal 
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        article={selectedArticle}
      />

      <ConfirmationModal 
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Article"
        message={`Are you sure you want to delete "${selectedArticle?.title}"? This action cannot be undone.`}
        loading={loading}
      />

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search by title, author, or keyword..."
              className="w-full h-12 pl-12 pr-4 bg-slate-50 border-transparent focus:bg-white focus:border-blue-500 rounded-xl text-slate-900 placeholder:text-slate-500 transition-all outline-none"
            />
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <select className="flex-1 md:flex-none bg-slate-50 border-slate-200 rounded-xl text-sm font-bold px-4 py-3 outline-none">
              <option>All Categories</option>
            </select>
            <select className="flex-1 md:flex-none bg-slate-50 border-slate-200 rounded-xl text-sm font-bold px-4 py-3 outline-none">
              <option>All Status</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-wider">Article Title</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-wider">Author</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-wider">Last Updated</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading && articles.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400 font-bold">
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                      Loading articles...
                    </div>
                  </td>
                </tr>
              ) : articles.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400 font-bold">No articles found.</td>
                </tr>
              ) : (
                articles.map((article) => (
                  <tr key={article.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-900">{article.title}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">ID: KB-{article.id.slice(0, 4)}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[10px] font-black uppercase tracking-wider">
                        {article.category?.name || 'Uncategorized'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center text-[10px] font-black text-slate-500 uppercase">
                          {article.author.firstName[0]}{article.author.lastName[0]}
                        </div>
                        <p className="text-sm font-bold text-slate-700">{article.author.firstName} {article.author.lastName}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-slate-500">
                      {format(new Date(article.updatedAt), 'MMM dd, yyyy')}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${getStatusColor(article.status)}`}>
                        {article.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => handlePreview(article)}
                          className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleEdit(article)}
                          className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteClick(article)}
                          className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-6 border-t border-slate-100 flex justify-between items-center">
          <p className="text-sm font-bold text-slate-400">Showing 1 to {articles.length} of {articles.length} articles</p>
          <div className="flex gap-2">
            <button className="p-2 border border-slate-200 rounded-lg text-slate-400 hover:bg-slate-50"><ChevronLeft className="w-4 h-4" /></button>
            <button className="w-8 h-8 bg-blue-600 text-white rounded-lg text-xs font-bold">1</button>
            <button className="p-2 border border-slate-200 rounded-lg text-slate-400 hover:bg-slate-50"><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>
      </div>
    </div>
  );
};
