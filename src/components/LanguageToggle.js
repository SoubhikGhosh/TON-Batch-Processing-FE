import React, { useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';
import { ThemeContext } from '../context/ThemeContext';

const LanguageToggle = () => {
  const { language, toggleLanguage, t } = useContext(LanguageContext);
  const { theme } = useContext(ThemeContext);

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center text-sm rounded-md px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
      aria-label={t('language.toggle')}
      title={t('language.toggle')}
      style={{ 
        backgroundColor: theme === 'dark' ? '#4B5563' : '#E5E7EB',
        color: theme === 'dark' ? '#E5E7EB' : '#374151'
      }}
    >
      {language === 'en' ? (
        <>
          <span className="mr-1">🇮🇳</span> {t('language.hi')}
        </>
      ) : (
        <>
          <span className="mr-1">🇬🇧</span> {t('language.en')}
        </>
      )}
    </button>
  );
};

export default LanguageToggle;