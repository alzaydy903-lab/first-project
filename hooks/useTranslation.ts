
import { useAppContext } from '../contexts/AppContext';

export const useTranslation = () => {
  const { t, language, setLanguage } = useAppContext();
  return { t, language, setLanguage };
};
