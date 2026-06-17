import { Outlet } from 'react-router-dom';
import { Gift } from 'lucide-react';

const PublicLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-dark-950 text-white relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-gold-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-gold-400/5 rounded-full blur-3xl pointer-events-none"></div>

      <nav className="glass sticky top-0 z-50">
        <div className="container mx-auto px-4 h-20 flex items-center justify-center">
          <div className="flex items-center gap-3">
            <Gift className="w-10 h-10 text-gold-500" />
            <h1 className="text-3xl font-bold gold-gradient tracking-tight">بالطريق</h1>
          </div>
        </div>
      </nav>

      <main className="flex-1 container mx-auto px-4 py-12 relative z-10 flex flex-col items-center justify-center">
        <Outlet />
      </main>

      <footer className="glass py-6 mt-auto relative z-10">
        <div className="container mx-auto text-center text-sm text-gray-400">
          © {new Date().getFullYear()} بالطريق. جميع الحقوق محفوظة.
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
