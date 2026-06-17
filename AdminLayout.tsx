import { Outlet, Link } from 'react-router-dom';
import { Settings, LayoutDashboard, Gift } from 'lucide-react';

const AdminLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-dark-950 text-white">
      {/* Navbar */}
      <nav className="glass sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Gift className="w-8 h-8 text-gold-500" />
            <span className="text-2xl font-bold gold-gradient tracking-tight">بالطريق</span>
            <span className="text-xs text-dark-800/80 bg-gold-500/20 px-2 py-0.5 rounded-full ml-4">لوحة الإدارة</span>
          </div>
          
          <div className="flex gap-6">
            <Link to="/admin" className="flex items-center gap-2 hover:text-gold-400 transition-colors">
              <LayoutDashboard size={20} />
              <span>الرئيسية</span>
            </Link>
            <Link to="/" target="_blank" className="flex items-center gap-2 hover:text-gold-400 transition-colors">
              <Settings size={20} />
              <span>الصفحة العامة</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        <Outlet />
      </main>
      
      {/* Footer */}
      <footer className="glass py-4 mt-auto">
        <div className="container mx-auto text-center text-sm text-gray-500">
          © {new Date().getFullYear()} بالطريق. جميع الحقوق محفوظة.
        </div>
      </footer>
    </div>
  );
};

export default AdminLayout;
