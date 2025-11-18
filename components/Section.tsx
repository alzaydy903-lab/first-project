
import React from 'react';

interface SectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

const Section: React.FC<SectionProps> = ({ title, children, className = '' }) => {
  return (
    <section className={`py-8 xs:py-12 sm:py-16 md:py-20 lg:py-24 px-2 xs:px-4 sm:px-6 md:px-8 lg:px-12 ${className}`}>
      <div className="container mx-auto max-w-7xl">
        <div className="mb-6 xs:mb-8 sm:mb-10 md:mb-12 text-center">
            <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white relative inline-block tracking-tight px-2">
                {title}
            </h2>
            <div className="w-12 xs:w-16 sm:w-20 md:w-24 h-1 xs:h-1.5 bg-gradient-to-r from-cyan-400 to-blue-500 mt-2 xs:mt-3 sm:mt-4 mx-auto rounded-full"></div>
        </div>
        {children}
      </div>
    </section>
  );
};

export default Section;