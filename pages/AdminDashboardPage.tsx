import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import { db, storage } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { ref, uploadString, getDownloadURL, deleteObject } from 'firebase/storage';

const EditableField: React.FC<{
  label: string;
  value: string | number;
  name: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  isTextArea?: boolean;
  type?: string;
  options?: string[];
}> = ({ label, value, name, onChange, isTextArea = false, type = 'text', options }) => (
  <div className="mb-6">
    <label className="block text-cyan-300 text-lg sm:text-xl font-bold mb-2">{label}</label>
    {isTextArea ? (
      <textarea
        value={value}
        name={name}
        onChange={onChange}
        rows={4}
        className="text-lg sm:text-xl appearance-none border-2 border-slate-700 rounded-lg w-full py-3 px-4 bg-slate-800/50 text-white leading-tight focus:outline-none focus:bg-slate-700 focus:border-cyan-500 transition-colors"
      />
    ) : type === 'select' && options ? (
      <select name={name} value={value} onChange={onChange} className="text-lg sm:text-xl appearance-none border-2 border-slate-700 rounded-lg w-full py-3 px-4 bg-slate-800/50 text-white leading-tight focus:outline-none focus:bg-slate-700 focus:border-cyan-500 transition-colors">
        {options.map(option => <option key={option} value={option}>{option}</option>)}
      </select>
    ) : (
      <input
        type={type}
        value={value}
        name={name}
        onChange={onChange}
        className="text-lg sm:text-xl appearance-none border-2 border-slate-700 rounded-lg w-full py-3 px-4 bg-slate-800/50 text-white leading-tight focus:outline-none focus:bg-slate-700 focus:border-cyan-500 transition-colors"
      />
    )}
  </div>
);

const AdminDashboardPage: React.FC = () => {
  const { isAdmin, data, setData, t, logout, language } = useAppContext();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(data);
  const [saved, setSaved] = useState(false);
  const [isUploading, setIsUploading] = useState<number | null>(null);

  useEffect(() => {
    if (!isAdmin) {
      navigate('/login');
    }
  }, [isAdmin, navigate]);

  useEffect(() => {
    setFormData(data);
  }, [data]);

  const handleStudentInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => prev ? { ...prev, studentInfo: { ...prev.studentInfo, [name]: value } } : null);
  };
  
  const handleContentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => prev ? { ...prev, content: { ...prev.content, [name]: value } } : null);
  };

  const handleGoalChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => prev ? { ...prev, content: { ...prev.content, goals: { ...prev.content.goals, [name]: value } } } : null);
  };

  const handleAchievementChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const achievements = formData?.content.achievements.map((ach, i) => i === index ? { ...ach, [name]: value } : ach) || [];
    setFormData(prev => prev ? { ...prev, content: { ...prev.content, achievements } } : null);
  };

  const handleAddAchievement = () => {
    const newAchievement = { id: Date.now(), title: 'New Achievement', type: 'personal' as const, description: '', year: new Date().getFullYear(), imageUrl: '' };
    const achievements = [...(formData?.content.achievements || []), newAchievement];
    setFormData(prev => prev ? { ...prev, content: { ...prev.content, achievements } } : null);
  };

  const handleDeleteAchievement = async (index: number) => {
    if (!formData) return;
    const achievementToDelete = formData.content.achievements[index];
    
    // Delete image from storage if it exists
    if (achievementToDelete.imageUrl && achievementToDelete.imageUrl.includes('firebasestorage')) {
      try {
        const imageRef = ref(storage, achievementToDelete.imageUrl);
        await deleteObject(imageRef);
      } catch (error) {
        console.error("Error deleting image from storage:", error);
      }
    }

    const achievements = formData.content.achievements.filter((_, i) => i !== index);
    setFormData(prev => prev ? { ...prev, content: { ...prev.content, achievements } } : null);
  };
  
  const handleAchievementImageChange = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !formData) return;
    setIsUploading(index);

    const reader = new FileReader();
    reader.onload = async (event) => {
        const base64String = event.target?.result as string;
        if (!base64String) {
            setIsUploading(null);
            return;
        }

        try {
             // Delete old image if it exists
            const oldImageUrl = formData.content.achievements[index].imageUrl;
            if (oldImageUrl && oldImageUrl.includes('firebasestorage')) {
                const oldImageRef = ref(storage, oldImageUrl);
                await deleteObject(oldImageRef).catch(err => console.warn("Old image deletion failed, might not exist:", err));
            }

            const storageRef = ref(storage, `images/${Date.now()}_${file.name}`);
            const uploadTask = await uploadString(storageRef, base64String, 'data_url');
            const downloadURL = await getDownloadURL(uploadTask.ref);

            const achievements = formData.content.achievements.map((ach, i) => i === index ? { ...ach, imageUrl: downloadURL } : ach);
            setFormData(prev => prev ? { ...prev, content: { ...prev.content, achievements } } : null);
        } catch (error) {
            console.error("Image upload failed:", error);
        } finally {
            setIsUploading(null);
        }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;
    try {
        // By stringifying and parsing, we create a deep clone and remove any non-serializable
        // data like functions (the icon components), which solves the Firestore error.
        // The 'iconName' property is preserved for re-hydration.
        const dataToSave = JSON.parse(JSON.stringify(formData));

        await setDoc(doc(db, 'portfolio', language), dataToSave);
        setData(formData); // Update context with the live data (including icons)
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
        window.scrollTo(0, 0);
    } catch(error) {
        console.error("Error saving data:", error);
        alert("Failed to save data. Check console for details.");
    }
  };
  
  if (!isAdmin || !formData) {
    return null; 
  }

  return (
    <div className="min-h-screen bg-transparent p-4 sm:p-8" dir={useAppContext().language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="container mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-4">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white">{t('adminDashboard')}</h1>
            <button onClick={() => { logout(); navigate('/'); }} className="text-lg sm:text-xl bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 sm:py-3 sm:px-6 rounded-lg transition-colors">
                {t('logout')}
            </button>
        </div>
        
        {saved && <p className="bg-green-500/20 text-green-300 text-center text-xl p-4 rounded-lg mb-8">Changes saved successfully!</p>}

        <form onSubmit={handleSubmit} className="bg-slate-900/70 backdrop-blur-xl border border-slate-800 p-4 sm:p-8 rounded-2xl shadow-2xl shadow-cyan-500/10">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 border-b-2 border-cyan-500/50 pb-3 text-white">Student Info</h2>
          <div className="grid md:grid-cols-2 gap-x-8">
            <EditableField label={t('name')} name="name" value={formData.studentInfo.name} onChange={handleStudentInfoChange} />
            <EditableField label={t('grade')} name="grade" value={formData.studentInfo.grade} onChange={handleStudentInfoChange} />
            <EditableField label={t('school')} name="school" value={formData.studentInfo.school} onChange={handleStudentInfoChange} />
            <EditableField label={t('email')} name="email" value={formData.studentInfo.email} onChange={handleStudentInfoChange} />
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold mt-12 mb-6 border-b-2 border-cyan-500/50 pb-3 text-white">Page Content</h2>
          <EditableField label={t('aboutMe')} name="aboutMe" value={formData.content.aboutMe} onChange={handleContentChange} isTextArea />
          <EditableField label={`${t('goals')} (${t('shortTerm')})`} name="shortTerm" value={formData.content.goals.shortTerm} onChange={handleGoalChange} isTextArea />
          <EditableField label={`${t('goals')} (${t('longTerm')})`} name="longTerm" value={formData.content.goals.longTerm} onChange={handleGoalChange} isTextArea />

          <h2 className="text-3xl sm:text-4xl font-bold mt-12 mb-6 border-b-2 border-cyan-500/50 pb-3 text-white">Achievements</h2>
          {formData.content.achievements.map((ach, index) => (
            <div key={ach.id} className="bg-slate-800/50 p-6 rounded-xl mb-6 border border-slate-700 relative">
              <EditableField label="Title" name="title" value={ach.title} onChange={(e) => handleAchievementChange(index, e)} />
              <EditableField label="Description" name="description" value={ach.description} onChange={(e) => handleAchievementChange(index, e)} isTextArea />
              <div className="grid md:grid-cols-2 gap-x-8">
                <EditableField label="Year" name="year" type="number" value={ach.year} onChange={(e) => handleAchievementChange(index, e)} />
                <EditableField label="Type" name="type" type="select" options={['academic', 'volunteer', 'personal']} value={ach.type} onChange={(e) => handleAchievementChange(index, e)} />
              </div>
              <div className="mt-4">
                  <label className="block text-cyan-300 text-lg sm:text-xl font-bold mb-2">Image</label>
                  {ach.imageUrl && <img src={ach.imageUrl} alt={ach.title} className="w-48 h-auto object-cover rounded-lg mb-4 border-2 border-slate-600" />}
                  <input type="file" accept="image/*" onChange={(e) => handleAchievementImageChange(index, e)} className="text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-50 file:text-cyan-700 hover:file:bg-cyan-100" />
                  {isUploading === index && <p className="text-cyan-300 mt-2">Uploading...</p>}
              </div>
              <button type="button" onClick={() => handleDeleteAchievement(index)} className="absolute top-4 right-4 text-lg bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 rounded-lg transition-colors">Delete</button>
            </div>
          ))}
          <button type="button" onClick={handleAddAchievement} className="text-lg bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-6 rounded-lg transition-colors w-full mt-4">Add Achievement</button>


          <div className="mt-12 text-center">
            <button type="submit" className="text-xl sm:text-2xl bg-cyan-600 hover:bg-cyan-500 text-slate-900 font-bold py-3 px-8 sm:py-4 sm:px-12 rounded-lg transition-all duration-300 transform hover:scale-105">
              {t('saveChanges')}
            </button>
            <p className="text-gray-400 mt-4 text-base sm:text-lg">(Note: Changes are saved live to the database)</p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminDashboardPage;