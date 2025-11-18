import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, query, orderBy, doc, deleteDoc, onSnapshot, Timestamp, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Section from '../components/Section';
import AchievementCard from '../components/AchievementCard';
import TeacherCommentCard from '../components/TeacherCommentCard';
import TradingGame from '../components/TradingGame';
import { useAppContext } from '../contexts/AppContext';
import type { Achievement, TeacherComment } from '../types';

const PortfolioPage: React.FC = () => {
  const { data, t, isLoading, isAdmin } = useAppContext();
  const [filter, setFilter] = useState<'all' | 'academic' | 'volunteer' | 'personal'>('all');
  
  const [comments, setComments] = useState<TeacherComment[]>([]);
  const [newComment, setNewComment] = useState({ name: '', subject: '', comment: '' });
  const [formMessage, setFormMessage] = useState({ type: '', text: '' });

  // Fallback comments للتأكد من العرض
  const fallbackComments: TeacherComment[] = [
    { id: 1, teacherName: 'أ. أحمد المصري', subject: 'الرياضيات', comment: 'محمد طالب مجتهد ويظهر فهماً عميقاً للمفاهيم الرياضية. لديه قدرة ممتازة على حل المشكلات.', avatarUrl: 'https://picsum.photos/seed/teacher1/100' },
    { id: 2, teacherName: 'أ. فاطمة علي', subject: 'العلوم', comment: 'يتمتع بشغف كبير للاستكشاف والتعلم. دائمًا ما يطرح أسئلة ذكية ويشارك بفعالية في الفصل.', avatarUrl: 'https://picsum.photos/seed/teacher2/100' },
    { id: 3, teacherName: 'أ. خالد عبدالله', subject: 'اللغة العربية', comment: 'يمتلك موهبة في التعبير والكتابة، وأعماله دائمًا ما تكون مدروسة ومنظمة بشكل جيد.', avatarUrl: 'https://picsum.photos/seed/teacher3/100' },
  ];

  useEffect(() => {
    if (!data) return;
    
    // عرض التعليقات الثابتة أولاً
    const staticComments = data.content?.teacherComments || fallbackComments;
    setComments(staticComments);
    
    console.log('🔄 إعداد Firebase listener...');
    console.log('📊 التعليقات الثابتة الأولية:', staticComments.length);
    
    const commentsRef = collection(db, 'teacherComments');
    const q = query(commentsRef, orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        console.log('📡 Firebase update - عدد التعليقات من Firebase:', snapshot.docs.length);
        
        if (snapshot.docs.length === 0) {
          console.log('⚠️ لا توجد تعليقات في Firebase، استخدام التعليقات الثابتة فقط');
          setComments(staticComments);
          return;
        }
        
        const firebaseComments: TeacherComment[] = snapshot.docs.map(doc => {
          const data = doc.data();
          const createdAt = data.createdAt?.toDate ? data.createdAt.toDate() : new Date();
          console.log('📝 تعليق من Firebase:', {
            id: doc.id,
            teacherName: data.teacherName,
            subject: data.subject
          });
          return {
            id: doc.id,
            teacherName: data.teacherName || '',
            subject: data.subject || '',
            comment: data.comment || '',
            avatarUrl: data.avatarUrl || 'https://picsum.photos/100',
            createdAt: createdAt
          };
        });
        
        // دمج التعليقات من Firebase مع الثابتة
        const allComments = [...firebaseComments, ...staticComments];
        console.log('📋 إجمالي التعليقات (Firebase + Static):', allComments.length);
        setComments(allComments);
      },
      (error) => {
        console.error('❌ Firebase listener error:', error);
        console.error('❌ تفاصيل الخطأ:', error.message, error.code);
        // في حالة الخطأ، عرض التعليقات الثابتة
        setComments(staticComments);
      }
    );
    
    return () => {
      console.log('🔌 إغلاق Firebase listener');
      unsubscribe();
    };
  }, [data]);

  if (isLoading) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white" dir="rtl">
            <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-400 mx-auto mb-4"></div>
                <div className="text-2xl font-bold">جاري تحميل الملف الشخصي...</div>
                <div className="text-sm text-gray-400 mt-2">يرجى الانتظار قليلاً</div>
            </div>
        </div>
    );
  }

  if (!data) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white text-3xl font-bold" dir="rtl">
            لا يمكن تحميل بيانات الملف الشخصي. يرجى المحاولة مرة أخرى لاحقاً.
        </div>
    );
  }

  const { studentInfo, content } = data;

  const filteredAchievements = content.achievements.filter(ach =>
    filter === 'all' ? true : ach.type === filter
  );
  
  const filterButtons: Array<'all' | 'academic' | 'volunteer' | 'personal'> = ['all', 'academic', 'volunteer', 'personal'];

  const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewComment(prev => ({ ...prev, [name]: value }));
  };

  const handleDeleteComment = async (commentId: string | number) => {
    if (typeof commentId !== 'string') {
      setFormMessage({ type: 'error', text: 'لا يمكن حذف التعليقات الثابتة' });
      setTimeout(() => setFormMessage({ type: '', text: '' }), 3000);
      return;
    }

    try {
      await deleteDoc(doc(db, 'teacherComments', commentId));
      setFormMessage({ type: 'success', text: 'تم حذف التعليق بنجاح' });
    } catch (error: any) {
      console.error('خطأ في حذف التعليق:', error);
      setFormMessage({ type: 'error', text: 'خطأ في الحذف' });
    } finally {
      setTimeout(() => setFormMessage({ type: '', text: '' }), 3000);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.name.trim() || !newComment.subject.trim() || !newComment.comment.trim()) {
        setFormMessage({ type: 'error', text: t('commentError') });
        setTimeout(() => setFormMessage({ type: '', text: '' }), 3000);
        return;
    }

    // create optimistic (temporary) comment for immediate UI feedback
    const tempId = `temp_${Date.now()}`;
    const optimisticComment: TeacherComment = {
      id: tempId,
      teacherName: newComment.name.trim(),
      subject: newComment.subject.trim(),
      comment: newComment.comment.trim(),
      avatarUrl: `https://picsum.photos/seed/${Date.now()}/100`,
      createdAt: new Date()
    };

    setComments(prev => [optimisticComment, ...prev]);
    setNewComment({ name: '', subject: '', comment: '' });
    setFormMessage({ type: 'success', text: '✅ تم إضافة التعليق (جارٍ الحفظ)...' });

    const commentData = {
      teacherName: optimisticComment.teacherName,
      subject: optimisticComment.subject,
      comment: optimisticComment.comment,
      avatarUrl: optimisticComment.avatarUrl,
      createdAt: Timestamp.fromDate(optimisticComment.createdAt)
    };

    try {
      console.log('🔥 محاولة حفظ التعليق في Firebase باستخدام addDoc...', commentData);
      const docRef = await addDoc(collection(db, 'teacherComments'), commentData);
      console.log('✅ addDoc succeeded, id=', docRef.id);

      // remove optimistic entry; onSnapshot will insert the saved comment
      setComments(prev => prev.filter(c => c.id !== tempId));
      setFormMessage({ type: 'success', text: t('commentSuccess') });

    } catch (err: any) {
      console.error('⚠️ addDoc failed:', err);
      // try fallback: write with setDoc and a deterministic id
      try {
        const fallbackId = `fallback_${Date.now()}`;
        console.log('🔁 محاولة حفظ التعليق باستخدام setDoc كنسخة احتياطية, id=', fallbackId);
        await setDoc(doc(db, 'teacherComments', fallbackId), commentData);
        console.log('✅ setDoc fallback succeeded, id=', fallbackId);
        setComments(prev => prev.filter(c => c.id !== tempId));
        setFormMessage({ type: 'success', text: t('commentSuccess') });
      } catch (err2: any) {
        console.error('❌ both addDoc and setDoc failed:', err2);
        // remove optimistic and show error
        setComments(prev => prev.filter(c => c.id !== tempId));
        setFormMessage({ type: 'error', text: `خطأ في الحفظ: ${err2.code || err2.message || err.message || 'غير معروف'}` });
      }
    } finally {
      setTimeout(() => setFormMessage({ type: '', text: '' }), 5000);
    }
  };

  return (
    <div className="bg-transparent" dir={useAppContext().language === 'ar' ? 'rtl' : 'ltr'}>
      <Header />
      <main>
        {/* Hero Section */}
        <div className="min-h-[60vh] sm:min-h-[70vh] flex items-center justify-center text-center px-2 sm:px-4">
            <div className="container mx-auto max-w-6xl">
                <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black bg-clip-text text-transparent bg-gradient-to-b from-white to-neutral-400 leading-tight mb-2 sm:mb-4 animate-[fade-in-down_1s_ease-out] px-2">
                    {studentInfo.name}
                </h1>
                <p className="text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-cyan-300 font-medium animate-[fade-in-up_1s_ease-out_0.5s] px-2">
                    {studentInfo.grade} - {studentInfo.school}
                </p>
            </div>
        </div>

        {/* About Me */}
        <Section title={t('aboutMe')}>
          <p className="text-center text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl max-w-6xl mx-auto leading-relaxed text-gray-300 font-light px-2 sm:px-4">
            {content.aboutMe}
          </p>
        </Section>
        
        {/* Achievements */}
        <Section title={t('academicAchievements')}>
            <div className="flex justify-center flex-wrap gap-1 xs:gap-2 sm:gap-3 md:gap-4 mb-8 sm:mb-12 px-2">
                {filterButtons.map(btnFilter => (
                    <button
                        key={btnFilter}
                        onClick={() => setFilter(btnFilter)}
                        className={`text-xs xs:text-sm sm:text-base md:text-lg font-semibold py-1.5 xs:py-2 px-3 xs:px-4 sm:px-6 rounded-full transition-all duration-300 transform hover:scale-105 ${
                        filter === btnFilter
                            ? 'bg-cyan-400 text-slate-900 shadow-lg shadow-cyan-400/30'
                            : 'bg-slate-800/60 border border-slate-700 text-gray-300 hover:bg-slate-700/80'
                        }`}
                    >
                        {t(btnFilter)}
                    </button>
                ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 md:gap-8 lg:gap-12">
                {filteredAchievements.map((ach: Achievement) => (
                    <AchievementCard key={ach.id} achievement={ach} />
                ))}
            </div>
        </Section>
        
        {/* Skills & Hobbies */}
        <Section title={t('skills')}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 md:gap-16 items-start">
                <div className="px-2">
                    <h3 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 md:mb-8 text-center text-cyan-300">{t('skills')}</h3>
                    <div className="flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4">
                        {content.skills.map(skill => (
                            skill.icon && (
                                <div key={skill.name} className="flex items-center gap-1.5 xs:gap-2 sm:gap-3 text-xs xs:text-sm sm:text-base md:text-lg font-medium bg-slate-800/60 border border-slate-700 hover:border-cyan-400/50 hover:bg-slate-800 transition-all py-1.5 xs:py-2 sm:py-3 px-2 xs:px-3 sm:px-5 rounded-lg">
                                    <skill.icon className="text-cyan-300" size={16} sm-size={20} md-size={24} />
                                    <span>{skill.name}</span>
                                </div>
                            )
                        ))}
                    </div>
                </div>
                 <div className="px-2">
                    <h3 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 md:mb-8 text-center text-cyan-300">{t('hobbies')}</h3>
                    <div className="flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4">
                        {content.hobbies.map(hobby => (
                            hobby.icon && (
                                <div key={hobby.name} className="flex items-center gap-1.5 xs:gap-2 sm:gap-3 text-xs xs:text-sm sm:text-base md:text-lg font-medium bg-slate-800/60 border border-slate-700 hover:border-cyan-400/50 hover:bg-slate-800 transition-all py-1.5 xs:py-2 sm:py-3 px-2 xs:px-3 sm:px-5 rounded-lg">
                                    <hobby.icon className="text-cyan-300" size={16} sm-size={20} md-size={24} />
                                    <span>{hobby.name}</span>
                                </div>
                            )
                        ))}
                    </div>
                </div>
            </div>
        </Section>

        {/* Goals */}
        <Section title={t('goals')}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 lg:gap-12 max-w-6xl mx-auto px-2 sm:px-4">
                <div className="bg-gradient-to-br from-slate-900 to-slate-800/70 border border-slate-800 p-3 xs:p-4 sm:p-6 md:p-8 rounded-2xl text-center shadow-lg">
                    <h4 className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-3 md:mb-4 text-cyan-400">{t('shortTerm')}</h4>
                    <p className="text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 font-light leading-relaxed">{content.goals.shortTerm}</p>
                </div>
                <div className="bg-gradient-to-br from-slate-900 to-slate-800/70 border border-slate-800 p-3 xs:p-4 sm:p-6 md:p-8 rounded-2xl text-center shadow-lg">
                    <h4 className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-3 md:mb-4 text-cyan-400">{t('longTerm')}</h4>
                    <p className="text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 font-light leading-relaxed">{content.goals.longTerm}</p>
                </div>
            </div>
        </Section>
        
        {/* Teacher Comments */}
        <Section title={t('teacherComments')}>
            {comments.length === 0 ? (
                <div className="text-center py-8 sm:py-12 text-gray-400 px-4">
                    <p className="text-base sm:text-lg md:text-xl">لا توجد تعليقات بعد</p>
                    <p className="text-xs sm:text-sm mt-1 sm:mt-2">كن أول من يضيف تعليق!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 md:gap-8 px-2 sm:px-0">
                    {comments.map(comment => (
                        <TeacherCommentCard 
                            key={comment.id} 
                            comment={comment} 
                            onDelete={handleDeleteComment}
                            showDeleteButton={isAdmin && typeof comment.id === 'string'}
                        />
                    ))}
                </div>
            )}
        </Section>

        {/* Leave a Comment Form */}
        <Section title={t('leaveAComment')}>
            <div className="max-w-4xl mx-auto bg-slate-900/70 backdrop-blur-xl border border-slate-800 p-3 xs:p-4 sm:p-6 md:p-8 rounded-2xl shadow-2xl shadow-cyan-500/10">
                <form onSubmit={handleCommentSubmit} noValidate>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 xs:gap-4 sm:gap-6 mb-4 sm:mb-6">
                        <div>
                            <label htmlFor="name" className="block text-gray-300 text-sm xs:text-base sm:text-lg font-bold mb-2 sm:mb-3">{t('yourName')}</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={newComment.name}
                                onChange={handleCommentChange}
                                className="text-sm xs:text-base sm:text-lg appearance-none border-2 border-slate-700 rounded-lg w-full py-2 xs:py-2.5 sm:py-3 px-3 xs:px-3.5 sm:px-4 bg-slate-800/50 text-white leading-tight focus:outline-none focus:bg-slate-700 focus:border-cyan-500 transition-colors"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="subject" className="block text-gray-300 text-sm xs:text-base sm:text-lg font-bold mb-2 sm:mb-3">{t('yourSubject')}</label>
                            <input
                                type="text"
                                id="subject"
                                name="subject"
                                value={newComment.subject}
                                onChange={handleCommentChange}
                                className="text-sm xs:text-base sm:text-lg appearance-none border-2 border-slate-700 rounded-lg w-full py-2 xs:py-2.5 sm:py-3 px-3 xs:px-3.5 sm:px-4 bg-slate-800/50 text-white leading-tight focus:outline-none focus:bg-slate-700 focus:border-cyan-500 transition-colors"
                                required
                            />
                        </div>
                    </div>
                    <div className="mb-4 sm:mb-6">
                        <label htmlFor="comment" className="block text-gray-300 text-sm xs:text-base sm:text-lg font-bold mb-2 sm:mb-3">{t('yourComment')}</label>
                        <textarea
                            id="comment"
                            name="comment"
                            value={newComment.comment}
                            onChange={handleCommentChange}
                            rows={4}
                            className="text-sm xs:text-base sm:text-lg appearance-none border-2 border-slate-700 rounded-lg w-full py-2 xs:py-2.5 sm:py-3 px-3 xs:px-3.5 sm:px-4 bg-slate-800/50 text-white leading-tight focus:outline-none focus:bg-slate-700 focus:border-cyan-500 transition-colors resize-none"
                            required
                        />
                    </div>
                    {formMessage.text && (
                        <p className={`text-center mb-3 sm:mb-4 text-sm xs:text-base sm:text-lg ${formMessage.type === 'error' ? 'text-red-400' : 'text-green-400'}`}>
                            {formMessage.text}
                        </p>
                    )}
                    <div className="text-center">
                        <button
                            type="submit"
                            className="text-sm xs:text-base sm:text-lg md:text-xl shadow font-bold py-2 xs:py-2.5 sm:py-3 px-4 xs:px-6 sm:px-8 rounded-lg transition-all duration-300 transform bg-cyan-600 hover:bg-cyan-500 hover:scale-105 focus:shadow-outline focus:outline-none text-slate-900"
                        >
                            {t('submitComment')}
                        </button>
                    </div>
                </form>
            </div>
        </Section>
        
        {/* Trading Game */}
        <Section title={t('tradingGame')}>
            <TradingGame />
        </Section>

      </main>
      <Footer />
    </div>
  );
};

export default PortfolioPage;