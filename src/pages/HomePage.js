import React, { useContext } from 'react';
import UploadForm from '../components/UploadForm';
import { LanguageContext } from '../context/LanguageContext';

const HomePage = () => {
  const { t } = useContext(LanguageContext);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">{t('home.title')}</h1>
        
        <p className="mb-8 text-gray-600 dark:text-gray-300">
          {t('home.description')}
        </p>
        
        <UploadForm />
      </div>
    </div>
  );
};

export default HomePage;