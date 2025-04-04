import React, { useContext } from 'react';
import Dashboard from '../components/Dashboard';
import { LanguageContext } from '../context/LanguageContext';
import { ThemeContext } from '../context/ThemeContext';

const DashboardPage = () => {
  const { t } = useContext(LanguageContext);
  const { theme } = useContext(ThemeContext);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6" style={{ 
        color: theme === 'dark' ? '#F9FAFB' : '#111827'
      }}>
        {t('dashboard.title')}
      </h1>
      
      <Dashboard />
    </div>
  );
};

export default DashboardPage;