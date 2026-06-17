import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AdminLayout from './components/layout/AdminLayout';
import PublicLayout from './components/layout/PublicLayout';
import Dashboard from './pages/admin/Dashboard';
import PublicResults from './pages/public/PublicResults';

function App() {
  return (
    <BrowserRouter>
      <Toaster 
        position="top-center"
        toastOptions={{
          className: 'bg-dark-800 text-white border border-dark-800/50',
          style: {
            direction: 'rtl',
            background: '#1a1a1a',
            color: '#fff',
            border: '1px solid rgba(212, 175, 55, 0.2)'
          }
        }} 
      />
      <Routes>
        {/* Public Route */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<PublicResults />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
        </Route>

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
