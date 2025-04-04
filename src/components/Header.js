import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import documentApi from '../services/api';
import ThemeToggle from './ThemeToggle';
import LanguageToggle from './LanguageToggle';
import { LanguageContext } from '../context/LanguageContext';

const Header = () => {
  const [healthStatus, setHealthStatus] = useState('checking');
  const { t } = useContext(LanguageContext);

  useEffect(() => {
    checkApiHealth();
    
    // Check health status every 30 seconds
    const interval = setInterval(checkApiHealth, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const checkApiHealth = async () => {
    try {
      const response = await documentApi.checkHealth();
      setHealthStatus(response.status);
    } catch (error) {
      setHealthStatus('unhealthy');
      console.error('Health check failed:', error);
    }
  };

  return (
    <header className="bg-gray-800 dark:bg-gray-900 text-white p-4 shadow-md">
      <div className="container mx-auto flex flex-col md:flex-row md:justify-between md:items-center">
        <h1 className="text-xl font-bold mb-4 md:mb-0">{t('app.title')}</h1>
        
        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0">
          <nav className="flex items-center space-x-4 mr-0 md:mr-6">
            <Link to="/" className="hover:text-gray-300">{t('nav.home')}</Link>
            <Link to="/jobs" className="hover:text-gray-300">{t('nav.jobs')}</Link>
            <Link to="/dashboard" className="hover:text-gray-300">{t('nav.dashboard')}</Link>
          </nav>
          
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <div className="flex items-center">
              <span className="mr-2 text-sm">{t('api.status')}</span>
              <span className={`inline-block w-3 h-3 rounded-full ${
                healthStatus === 'healthy' ? 'bg-green-500' : 
                healthStatus === 'checking' ? 'bg-yellow-500' : 'bg-red-500'
              }`}></span>
            </div>
            
            <div className="flex items-center space-x-2">
              <ThemeToggle />
              <LanguageToggle />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;