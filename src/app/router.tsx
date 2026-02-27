import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { AdminLayout } from './layouts/AdminLayout';
import { AdminDashboard } from '../features/admin/AdminDashboard';
import { ArticlesManagement } from '../features/admin/ArticlesManagement';
import { CategoriesManagement } from '../features/admin/CategoriesManagement';
import { UsersManagement } from '../features/admin/UsersManagement';
import { UserLayout } from './layouts/UserLayout';
import { UserDashboard } from '../features/user/UserDashboard';
import { ArticleDetail } from '../features/user/ArticleDetail';
import { SignIn } from '../pages/SignIn';
import { SignUp } from '../pages/SignUp';
import { useAuth } from '../context/AuthContext';

export const AppRouter = () => {
  const { user } = useAuth();
  
  return (
    <Routes>
      <Route path="/login" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      
      <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="articles" element={<ArticlesManagement />} />
          <Route path="categories" element={<CategoriesManagement />} />
          <Route path="users" element={<UsersManagement />} />
          <Route path="analytics" element={<div>Analytics (Coming Soon)</div>} />
          <Route path="settings" element={<div>Settings (Coming Soon)</div>} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['USER', 'ADMIN']} />}>
        <Route path="/" element={<UserLayout />}>
          <Route index element={
            user?.role === 'ADMIN' ? <Navigate to="/admin" replace /> : <UserDashboard />
          } />
          <Route path="kb/:id" element={<ArticleDetail />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};
