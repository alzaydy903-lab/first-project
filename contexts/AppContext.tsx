import React, { createContext, useState, useContext, ReactNode, useCallback, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import type { AppContextType, Language, TranslatedData } from '../types';
import staticData from '../data/content';
import { iconMap } from '../components/IconMap';

const AppContext = createContext<AppContextType | undefined>(undefined);

const hydrateData = (data: TranslatedData): TranslatedData => {
    const hydratedContent = { ...data.content };

    if (hydratedContent.skills) {
        hydratedContent.skills = hydratedContent.skills.map(skill => ({
            ...skill,
            icon: iconMap[skill.iconName]
        }));
    }
    if (hydratedContent.hobbies) {
        hydratedContent.hobbies = hydratedContent.hobbies.map(hobby => ({
            ...hobby,
            icon: iconMap[hobby.iconName]
        }));
    }
    return { ...data, content: hydratedContent };
};


export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('ar');
  const [data, setData] = useState<TranslatedData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  
  useEffect(() => {
    const fetchData = async () => {
        // Load static data immediately for fast initial render
        const staticDataForLanguage = hydrateData(staticData[language]);
        setData(staticDataForLanguage);
        setIsLoading(false);
        
        // Then try to fetch from Firebase in the background with timeout
        try {
            const timeoutPromise = new Promise<never>((_, reject) => {
                setTimeout(() => reject(new Error('Firebase timeout')), 3000); // 3 second timeout
            });
            
            const firestorePromise = getDoc(doc(db, 'portfolio', language));
            
            const docSnap = await Promise.race([firestorePromise, timeoutPromise]);
            
            if (docSnap.exists()) {
                const firebaseData = hydrateData(docSnap.data() as TranslatedData);
                setData(firebaseData);
                console.log(`Updated with Firebase data for language '${language}'`);
            }
        } catch (error) {
            console.log(`Using static data for language '${language}' - Firebase unavailable or slow:`, error.message);
            // Static data is already loaded, so we just continue
        }
    };
    fetchData();
  }, [language]);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
  }, []);
  
  const t = useCallback((key: string): string => {
    return data?.labels?.[key] || key;
  }, [data]);

  const login = (password: string): boolean => {
    if (password === 'admin123') { // Using a slightly more secure password
      setIsAdmin(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAdmin(false);
  };

  const value: AppContextType = {
    data,
    setData,
    language,
    setLanguage,
    t,
    isAdmin,
    login,
    logout,
    isLoading,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};