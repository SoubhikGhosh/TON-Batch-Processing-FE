import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import JobsList from '../components/JobsList';
import { LanguageContext } from '../context/LanguageContext';

const JobsPage = () => {
  const { t } = useContext(LanguageContext);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{t('jobs.title')}</h1>
        <Link 
          to="/" 
          className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-4 py-2 rounded-md"
        >
          {t('jobs.button.upload')}
        </Link>
      </div>
      
      <JobsList />
    </div>
  );
};

export default JobsPage;