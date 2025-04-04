import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import JobPage from './pages/JobPage';
import JobsPage from './pages/JobsPage';
import DashboardPage from './pages/DashboardPage';
import NotFoundPage from './pages/NotFoundPage';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { LanguageContext } from './context/LanguageContext';
import './dark-theme.css';

// Footer component with language context
const Footer = () => {
  const { t } = useContext(LanguageContext);
  return (
    <footer className="bg-white dark:bg-gray-800 py-4 border-t border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4 text-center text-gray-500 dark:text-gray-400 text-sm">
        {t('footer.copyright')} {new Date().getFullYear()}
      </div>
    </footer>
  );
};

function AppContent() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <Header />
        <main className="py-4 px-4">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/job/:jobId" element={<JobPage />} />
            <Route path="/jobs" element={<JobsPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;