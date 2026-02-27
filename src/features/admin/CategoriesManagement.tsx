import { useEffect, useState } from 'react';
import { 
  Plus, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  Server, 
  Network, 
  Cloud, 
  ShieldCheck, 
  Smartphone,
  HardDrive,
  FileText,
  Loader2
} from 'lucide-react';
import { motion } from 'motion/react';
import apiClient from '../../services/apiClient';
import { CategoryModal } from '../../components/CategoryModal';
import { ConfirmationModal } from '../../components/ConfirmationModal';
import toast from 'react-hot-toast';

export const CategoriesManagement = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/categories');
      setCategories(res.data);
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to fetch categories';
      toast.error(message);
      if (err.response?.data?.error) {
        console.error('Category fetch error:', err.response.data.error);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleEdit = (category: any) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (category: any) => {
    setSelectedCategory(category);
    setIsDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedCategory) return;
    setLoading(true);
    try {
      await apiClient.delete(`/categories/${selectedCategory.id}`);
      toast.success('Category deleted successfully');
      fetchCategories();
      setIsDeleteOpen(false);
    } catch (err) {
      toast.error('Failed to delete category');
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'server': return Server;
      case 'network': return Network;
      case 'cloud': return Cloud;
      case 'security': return ShieldCheck;
      case 'mobile': return Smartphone;
      default: return HardDrive;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Categories Management</h2>
          <p className="text-slate-500 font-medium">Organize and maintain the structural taxonomy of the knowledge base.</p>
        </div>
        <button 
          onClick={() => {
            setSelectedCategory(null);
            setIsModalOpen(true);
          }}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all"
        >
          <Plus className="w-5 h-5" />
          Add New Category
        </button>
      </div>

      <CategoryModal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          setSelectedCategory(null);
        }} 
        onSuccess={fetchCategories} 
        categoryId={selectedCategory?.id}
      />

      <ConfirmationModal 
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Category"
        message={`Are you sure you want to delete "${selectedCategory?.name}"? All articles in this category will become uncategorized.`}
        loading={loading}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading && categories.length === 0 ? (
          <div className="col-span-full flex flex-col items-center py-12 text-slate-400 font-bold gap-2">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            Loading categories...
          </div>
        ) : categories.length === 0 ? (
          <div className="col-span-full text-center py-12 text-slate-400 font-bold">No categories found.</div>
        ) : (
          categories.map((category, i) => {
            const Icon = getIcon(category.icon);
            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm group hover:border-blue-500 transition-all"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="p-3 bg-blue-50 rounded-xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-wider ${
                      category.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'
                    }`}>
                      {category.status === 'ACTIVE' ? 'Healthy' : 'Warning'}
                    </span>
                    <button className="p-1 text-slate-400 hover:text-slate-600"><MoreVertical className="w-4 h-4" /></button>
                  </div>
                </div>
                
                <h3 className="text-xl font-black text-slate-900 mb-2">{category.name}</h3>
                <p className="text-sm text-slate-500 font-medium line-clamp-2 mb-6">{category.description || 'No description provided.'}</p>
                
                <div className="flex items-center gap-2 text-slate-400 mb-6">
                  <FileText className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">{category._count?.articles || 0} Articles</span>
                </div>

                <div className="flex gap-2 pt-6 border-t border-slate-100">
                  <button 
                    onClick={() => handleEdit(category)}
                    className="flex-1 flex items-center justify-center gap-2 py-2 text-slate-500 hover:text-blue-600 font-bold text-xs uppercase tracking-wider transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </button>
                  <div className="w-px h-4 bg-slate-100 self-center"></div>
                  <button 
                    onClick={() => handleDeleteClick(category)}
                    className="flex-1 flex items-center justify-center gap-2 py-2 text-slate-500 hover:text-red-600 font-bold text-xs uppercase tracking-wider transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </motion.div>
            );
          })
        )}
        
        <button 
          onClick={() => {
            setSelectedCategory(null);
            setIsModalOpen(true);
          }}
          className="border-2 border-dashed border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center gap-4 text-slate-400 hover:border-blue-500 hover:text-blue-500 transition-all group"
        >
          <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-blue-50 transition-colors">
            <Plus className="w-6 h-6" />
          </div>
          <div className="text-center">
            <p className="font-bold">Create New Category</p>
            <p className="text-xs">Define new taxonomy node</p>
          </div>
        </button>
      </div>
    </div>
  );
};
