
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import { LogIn, LogOut, Settings, Languages } from 'lucide-react';

const Header: React.FC = () => {
  const { language, setLanguage, t, isAdmin, logout } = useAppContext();
  const navigate = useNavigate();

  const handleLanguageToggle = () => {
    const newLang = language === 'ar' ? 'en' : 'ar';
    setLanguage(newLang);
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="py-3 xs:py-4 sm:py-5 md:py-6 px-2 xs:px-4 sm:px-6 md:px-8 lg:px-12 bg-slate-950/70 backdrop-blur-lg sticky top-0 z-50 border-b border-slate-800">
      <div className="container mx-auto max-w-7xl flex justify-between items-center">
        <Link to="/" className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight hover:text-cyan-300 transition-colors">
          {t('siteName')}
        </Link>
        <nav className="flex items-center space-x-1 xs:space-x-2 sm:space-x-3 md:space-x-4">
          <button
            onClick={handleLanguageToggle}
            className="p-1.5 xs:p-2 rounded-full text-white hover:bg-white/10 hover:text-cyan-300 transition-all duration-300"
            aria-label="Toggle Language"
          >
            <Languages size={20} className="xs:w-6 xs:h-6" />
          </button>
          {isAdmin ? (
            <>
              <Link
                to="/admin"
                className="p-1.5 xs:p-2 rounded-full text-white hover:bg-white/10 hover:text-cyan-300 transition-all duration-300"
                aria-label={t('adminDashboard')}
              >
                <Settings size={20} className="xs:w-6 xs:h-6" />
              </Link>
              <button
                onClick={handleLogout}
                className="p-1.5 xs:p-2 rounded-full text-white hover:bg-red-500/20 hover:text-red-400 transition-all duration-300"
                aria-label={t('logout')}
              >
                <LogOut size={20} className="xs:w-6 xs:h-6" />
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="p-1.5 xs:p-2 rounded-full text-white hover:bg-white/10 hover:text-cyan-300 transition-all duration-300"
              aria-label={t('adminLogin')}
            >
              <LogIn size={20} className="xs:w-6 xs:h-6" />
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;