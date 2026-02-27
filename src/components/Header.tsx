import { Search, Bell, HelpCircle, Loader2, FileText, Tag, User as UserIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../services/apiClient';
import debounce from 'lodash/debounce';

export const Header = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const performSearch = async (query: string) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const res = await apiClient.get(`/articles?search=${query}`);
      setResults(res.data);
      setIsOpen(true);
    } catch (err) {
      console.error('Search failed', err);
    } finally {
      setLoading(false);
    }
  };

  const debouncedSearch = useMemo(
    () => debounce((query: string) => performSearch(query), 300),
    []
  );

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    debouncedSearch(value);
  };

  const handleResultClick = (id: string) => {
    setIsOpen(false);
    setSearchQuery('');
    navigate(`/admin/articles?id=${id}`);
  };

  return (
    <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-50">
      <div className="flex-1 max-w-2xl relative" ref={dropdownRef}>
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={handleInputChange}
            onFocus={() => searchQuery && setIsOpen(true)}
            placeholder="Search KB articles, users, or logs..."
            className="w-full h-12 pl-12 pr-4 bg-slate-100 border-transparent focus:bg-white focus:border-blue-500 rounded-xl text-slate-900 placeholder:text-slate-500 transition-all outline-none"
          />
          {loading && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
            </div>
          )}
        </div>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden max-h-[400px] overflow-y-auto z-50">
            <div className="p-4 border-b border-slate-50 bg-slate-50/50">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Search Results</p>
            </div>
            {results.length === 0 ? (
              <div className="p-8 text-center text-slate-400 font-bold">No results found for "{searchQuery}"</div>
            ) : (
              <div className="divide-y divide-slate-50">
                {results.map((result) => (
                  <button
                    key={result.id}
                    onClick={() => handleResultClick(result.id)}
                    className="w-full p-4 flex items-start gap-4 hover:bg-slate-50 transition-colors text-left"
                  >
                    <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{result.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Tag className="w-3 h-3 text-slate-400" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                          {result.category?.name || 'Uncategorized'}
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-4 border-r border-slate-200 pr-6">
          <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors relative">
            <Bell className="w-6 h-6" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
            <HelpCircle className="w-6 h-6" />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-bold text-slate-900">{user?.firstName} {user?.lastName}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{user?.organization.name}</p>
          </div>
          <div className="w-10 h-10 bg-slate-200 rounded-xl flex items-center justify-center">
            <UserIcon className="w-6 h-6 text-slate-500" />
          </div>
        </div>
      </div>
    </header>
  );
};
