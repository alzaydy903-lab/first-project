
import React from 'react';
import type { Achievement } from '../types';
import { useAppContext } from '../contexts/AppContext';

interface AchievementCardProps {
  achievement: Achievement;
}

const AchievementCard: React.FC<AchievementCardProps> = ({ achievement }) => {
  const { t } = useAppContext();
  return (
    <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/50 p-px rounded-xl xs:rounded-2xl group transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/20 hover:!scale-105">
        <div className="bg-slate-900 rounded-[11px] xs:rounded-[15px] overflow-hidden h-full">
            <img src={achievement.imageUrl} alt={achievement.title} className="w-full h-40 xs:h-48 sm:h-56 md:h-60 lg:h-56 object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="p-3 xs:p-4 sm:p-5 md:p-6">
                <div className="flex justify-between items-start mb-2 xs:mb-3 gap-2">
                    <h3 className="text-lg xs:text-xl sm:text-2xl font-bold text-white group-hover:text-cyan-300 transition-colors leading-tight">{achievement.title}</h3>
                    <span className="text-xs xs:text-sm font-semibold bg-cyan-500/10 text-cyan-300 py-1 px-2 xs:px-3 rounded-full whitespace-nowrap shrink-0">{achievement.year}</span>
                </div>
                <p className="text-gray-400 text-sm xs:text-base sm:text-lg mb-3 xs:mb-4 font-light leading-relaxed">{achievement.description}</p>
                <span className="text-xs xs:text-sm font-medium text-cyan-400 capitalize">{t(achievement.type)}</span>
            </div>
        </div>
    </div>
  );
};

export default AchievementCard;