import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  Calendar, 
  User as UserIcon, 
  Tag, 
  Clock,
  Share2,
  Printer,
  ThumbsUp,
  MessageSquare,
  Loader2
} from 'lucide-react';
import { motion } from 'motion/react';
import apiClient from '../../services/apiClient';
import { format } from 'date-fns';
import Markdown from 'react-markdown';

export const ArticleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await apiClient.get(`/articles/${id}`);
        setArticle(res.data);
      } catch (err) {
        console.error('Failed to fetch article', err);
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-slate-400 font-bold">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
        Loading article...
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6 text-center px-8">
        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
          <Tag className="w-10 h-10" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-900 mb-2">Article Not Found</h2>
          <p className="text-slate-500 font-medium max-w-md">The article you are looking for might have been moved, deleted, or you may not have permission to view it.</p>
        </div>
        <button 
          onClick={() => navigate('/')}
          className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-8 py-12">
      <motion.button 
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-400 hover:text-blue-600 font-bold text-sm uppercase tracking-wider mb-12 transition-colors group"
      >
        <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        Back to search
      </motion.button>

      <article className="space-y-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="flex items-center gap-3">
            <span className="px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest">
              {article.category?.name || 'Uncategorized'}
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">KB-{article.id.slice(0, 8)}</span>
          </div>

          <h1 className="text-5xl font-black text-slate-900 tracking-tight leading-tight">
            {article.title}
          </h1>

          <div className="flex flex-wrap items-center gap-8 pt-4 border-b border-slate-100 pb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 font-black text-xs uppercase">
                {article.author.firstName[0]}{article.author.lastName[0]}
              </div>
              <div>
                <p className="text-sm font-black text-slate-900">{article.author.firstName} {article.author.lastName}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Technical Author</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-slate-400">
              <Calendar className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">
                {format(new Date(article.updatedAt), 'MMM dd, yyyy')}
              </span>
            </div>

            <div className="flex items-center gap-2 text-slate-400">
              <Clock className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">5 min read</span>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="prose prose-slate prose-lg max-w-none markdown-body"
        >
          <Markdown>{article.content}</Markdown>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="pt-12 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-8"
        >
          <div className="flex items-center gap-6">
            <button className="flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-colors">
              <ThumbsUp className="w-5 h-5" />
              <span className="text-sm font-bold">Helpful</span>
            </button>
            <button className="flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-colors">
              <MessageSquare className="w-5 h-5" />
              <span className="text-sm font-bold">Feedback</span>
            </button>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-3 bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
              <Share2 className="w-5 h-5" />
            </button>
            <button className="p-3 bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
              <Printer className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      </article>
    </div>
  );
};
