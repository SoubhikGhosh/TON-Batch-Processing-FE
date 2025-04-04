import React, { useState, useEffect, useContext } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { LanguageContext } from '../context/LanguageContext';
import { ThemeContext } from '../context/ThemeContext';
import documentApi from '../services/api';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalJobs: 0,
    completedJobs: 0,
    processingJobs: 0,
    failedJobs: 0,
    totalFiles: 0,
    processedFiles: 0,
    documentTypes: {
      recognized: 0,
      unrecognized: 0
    },
    processingTimes: []
  });
  
  const { t } = useContext(LanguageContext);
  const { theme } = useContext(ThemeContext);
  
  // Set chart colors based on theme
  const textColor = theme === 'dark' ? '#E5E7EB' : '#374151';
  const gridColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await documentApi.getStats();
        console.log('Stats data received:', data);
        
        // Transform API data for dashboard
        const totalJobs = Object.values(data.jobs || {}).reduce((sum, count) => sum + count, 0);
        const completedJobs = data.jobs?.completed || 0;
        const processingJobs = data.jobs?.processing || 0;
        const failedJobs = data.jobs?.failed || 0;
        
        // For files stats, ensure we have values (not null)
        const totalFiles = data.files?.recognized || 0;
        const recognizedFiles = data.files?.total || 0;
        const unrecognizedFiles = totalFiles - recognizedFiles;
        
        console.log('Processed stats:', {
          totalJobs, completedJobs, processingJobs, failedJobs,
          totalFiles, recognizedFiles, unrecognizedFiles
        });
        
        setStats({
          totalJobs,
          completedJobs,
          processingJobs,
          failedJobs,
          totalFiles,
          processedFiles: recognizedFiles,
          documentTypes: {
            recognized: recognizedFiles,
            unrecognized: unrecognizedFiles
          },
          processingTimes: data.processing_times || []
        });
      } catch (error) {
        console.error('Error computing dashboard stats:', error);
      }
    };

    fetchStats();
    
    // Set up an interval to refresh stats every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    
    return () => clearInterval(interval);
  }, []);

  // Prepare data for status chart
  const statusData = {
    labels: [t('status.completed'), t('status.processing'), t('status.failed')],
    datasets: [
      {
        data: [stats.completedJobs, stats.processingJobs, stats.failedJobs],
        backgroundColor: ['#10B981', '#3B82F6', '#EF4444'],
        borderWidth: 0,
      },
    ],
  };

  // Prepare data for document types chart
  const documentTypesData = {
    labels: [t('dashboard.chart.documents.recognized'), t('dashboard.chart.documents.unrecognized')],
    datasets: [
      {
        data: [stats.documentTypes.recognized, stats.documentTypes.unrecognized],
        backgroundColor: [
          '#6366F1', '#F59E0B'
        ],
        borderWidth: 0,
      },
    ],
  };

  // Prepare data for processing time chart (if we have data)
  const processingTimeData = {
    labels: stats.processingTimes.slice(0, 10).map(item => item.job_id.substring(0, 8)),
    datasets: [
      {
        label: t('dashboard.chart.time.seconds'),
        data: stats.processingTimes.slice(0, 10).map(item => item.duration),
        backgroundColor: '#3B82F6',
      },
    ],
  };

  // Chart options with theme-aware colors
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: textColor,
          font: {
            size: 12
          }
        }
      },
      title: {
        display: false,
      },
      tooltip: {
        bodyColor: textColor,
        backgroundColor: theme === 'dark' ? '#374151' : '#FFFFFF',
        borderColor: theme === 'dark' ? '#4B5563' : '#E5E7EB',
        borderWidth: 1
      }
    },
    scales: {
      x: {
        grid: {
          color: gridColor
        },
        ticks: {
          color: textColor
        }
      },
      y: {
        grid: {
          color: gridColor
        },
        ticks: {
          color: textColor
        }
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{t('dashboard.stats.total')}</h3>
          <p className="text-2xl font-bold" style={{ color: theme === 'dark' ? '#F9FAFB' : '#111827' }}>{stats.totalJobs}</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{t('dashboard.stats.processed')}</h3>
          <p className="text-2xl font-bold" style={{ color: theme === 'dark' ? '#F9FAFB' : '#111827' }}>
            {stats.processedFiles} / {stats.totalFiles}
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{t('dashboard.stats.success')}</h3>
          <p className="text-2xl font-bold" style={{ color: theme === 'dark' ? '#F9FAFB' : '#111827' }}>
            {stats.totalJobs ? Math.round((stats.completedJobs / stats.totalJobs) * 100) : 0}%
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{t('dashboard.stats.active')}</h3>
          <p className="text-2xl font-bold" style={{ color: theme === 'dark' ? '#F9FAFB' : '#111827' }}>{stats.processingJobs}</p>
        </div>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Job Status Chart */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium mb-4" style={{ color: theme === 'dark' ? '#F9FAFB' : '#111827' }}>
            {t('dashboard.chart.status')}
          </h3>
          <div className="h-64">
            {(stats.completedJobs > 0 || stats.processingJobs > 0 || stats.failedJobs > 0) ? (
              <Pie data={statusData} options={chartOptions} />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                No job data available
              </div>
            )}
          </div>
        </div>
        
        {/* Document Types Chart */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium mb-4" style={{ color: theme === 'dark' ? '#F9FAFB' : '#111827' }}>
            {t('dashboard.chart.documents')}
          </h3>
          <div className="h-64">
            {(stats.documentTypes.recognized > 0 || stats.documentTypes.unrecognized > 0) ? (
              <Pie data={documentTypesData} options={chartOptions} />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                No document data available
              </div>
            )}
          </div>
        </div>
        
        {/* Processing Time Chart */}
        {stats.processingTimes.length > 0 && (
          <div className="col-span-1 md:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-medium mb-4" style={{ color: theme === 'dark' ? '#F9FAFB' : '#111827' }}>
              {t('dashboard.chart.time')}
            </h3>
            <div className="h-64">
              <Bar 
                data={processingTimeData} 
                options={{
                  ...chartOptions,
                  scales: {
                    ...chartOptions.scales,
                    y: {
                      ...chartOptions.scales.y,
                      beginAtZero: true,
                      title: {
                        display: true,
                        text: t('dashboard.chart.time.seconds'),
                        color: textColor
                      }
                    }
                  }
                }} 
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;