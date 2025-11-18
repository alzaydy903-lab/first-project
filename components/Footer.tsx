
import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import { Mail, Briefcase } from 'lucide-react';

const Footer: React.FC = () => {
  const { data, t, language } = useAppContext();

  return (
    <footer className="bg-slate-950/50 border-t border-slate-800 text-gray-400 py-8 xs:py-10 sm:py-12 px-2 xs:px-4 sm:px-6 md:px-8">
      <div className="container mx-auto max-w-7xl text-center">
        <h3 className="text-2xl xs:text-3xl sm:text-4xl font-bold mb-6 xs:mb-8 text-white">{t('contact')}</h3>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 xs:gap-6 md:gap-10 text-base xs:text-lg sm:text-xl">
          <a href={`mailto:${data.studentInfo.email}`} className="flex items-center group text-gray-300 hover:text-cyan-300 transition-colors px-2">
            <Mail className="mr-2 xs:mr-3 w-5 h-5 xs:w-6 xs:h-6 text-cyan-400 group-hover:text-cyan-300 transition-colors shrink-0" />
            <span className="break-all xs:break-normal">{data.studentInfo.email}</span>
          </a>
          <div className="flex items-center text-gray-300 px-2">
            <Briefcase className="mr-2 xs:mr-3 w-5 h-5 xs:w-6 xs:h-6 text-cyan-400 shrink-0" />
            <span>{data.studentInfo.name}</span>
          </div>
        </div>
        <p className="mt-6 xs:mt-8 sm:mt-10 text-sm xs:text-base text-gray-500 px-4">
            &copy; {new Date().getFullYear()} {data.studentInfo.name}. {language === 'ar' ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}
        </p>
      </div>
    </footer>
  );
};

export default Footer;