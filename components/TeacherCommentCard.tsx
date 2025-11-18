import React from 'react';
import { Quote, Trash2 } from 'lucide-react';
import type { TeacherComment } from '../types';

interface TeacherCommentCardProps {
  comment: TeacherComment;
  onDelete?: (id: string | number) => void;
  showDeleteButton?: boolean;
}

const TeacherCommentCard: React.FC<TeacherCommentCardProps> = ({ comment, onDelete, showDeleteButton = false }) => {
  const handleDelete = () => {
    if (onDelete && window.confirm('هل أنت متأكد من حذف هذا التعليق؟')) {
      onDelete(comment.id);
    }
  };

  // تحديد ما إذا كان التعليق جديد (خلال آخر دقيقة)
  const isNewComment = comment.createdAt && 
    typeof comment.createdAt !== 'string' &&
    comment.createdAt.getTime && 
    comment.createdAt.getTime() > Date.now() - 60000;

  return (
    <div className={`bg-gradient-to-br from-slate-800/80 to-slate-900/50 p-px rounded-2xl group transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/20 hover:!scale-105 h-full ${isNewComment ? 'animate-pulse border-2 border-green-400/50' : ''}`}>
      <div className="bg-slate-900 rounded-[15px] p-3 xs:p-4 sm:p-6 flex flex-col h-full relative">
        {/* زر الحذف */}
        {showDeleteButton && typeof comment.id === 'string' && (
          <button
            onClick={handleDelete}
            className="absolute top-2 xs:top-3 left-2 xs:left-3 p-1.5 xs:p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100"
            title="حذف التعليق"
          >
            <Trash2 className="w-3 h-3 xs:w-4 xs:h-4" />
          </button>
        )}
        
        <div className="flex items-center mb-3 sm:mb-4">
          <div className="flex-grow ltr:mr-3 rtl:ml-3 sm:ltr:mr-4 sm:rtl:ml-4">
            <h4 className="text-sm xs:text-base sm:text-lg md:text-xl font-bold text-white group-hover:text-cyan-300 transition-colors leading-tight">{comment.teacherName}</h4>
            <p className="text-xs xs:text-sm sm:text-base text-cyan-400 mt-0.5">{comment.subject}</p>
          </div>
          <img src={comment.avatarUrl} alt={comment.teacherName} className="w-10 h-10 xs:w-12 xs:h-12 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-slate-700 group-hover:border-cyan-400 transition-colors flex-shrink-0" />
        </div>
        <div className="mt-1 sm:mt-2 flex-grow flex items-start gap-2 xs:gap-3 sm:gap-4">
          <Quote className="w-8 h-8 xs:w-10 xs:h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 text-slate-700/80 transform scale-x-[-1] flex-shrink-0 mt-1" />
          <blockquote className="text-xs xs:text-sm sm:text-base md:text-lg text-gray-300 font-light italic leading-relaxed">
            {comment.comment}
          </blockquote>
        </div>
      </div>
    </div>
  );
};

export default TeacherCommentCard;