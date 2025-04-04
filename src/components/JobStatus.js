import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import documentApi from '../services/api';
import { 
  formatDate, 
  calculateProcessingTime, 
  calculatePercentage,
  getStatusColor
} from '../utils/formatters';
import { LanguageContext } from '../context/LanguageContext';

const JobStatus = () => {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { t } = useContext(LanguageContext);

  useEffect(() => {
    fetchJobStatus();
    
    // Poll for updates if job is processing
    const interval = setInterval(() => {
      if (job && job.status === 'processing') {
        fetchJobStatus();
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, [job]);

  const fetchJobStatus = async () => {
    try {
      const data = await documentApi.getJobStatus(jobId);
      setJob(data);
      setLoading(false);
      
      // Also update the job in localStorage for history
      updateJobInLocalStorage(data);
    } catch (error) {
      console.error('Error fetching job status:', error);
      setError('Failed to fetch job status. Please try again.');
      setLoading(false);
    }
  };
  
  const updateJobInLocalStorage = (jobData) => {
    try {
      const existingJobs = JSON.parse(localStorage.getItem('processingJobs')) || [];
      const jobIndex = existingJobs.findIndex(j => j.job_id === jobData.job_id);
      
      if (jobIndex !== -1) {
        existingJobs[jobIndex] = {
          ...existingJobs[jobIndex],
          status: jobData.status,
          processed_files: jobData.processed_files,
          total_files: jobData.total_files,
          end_time: jobData.end_time,
          processing_stats: jobData.processing_stats
        };
        
        localStorage.setItem('processingJobs', JSON.stringify(existingJobs));
      }
    } catch (error) {
      console.error('Error updating job in localStorage:', error);
    }
  };

  const handleDownload = () => {
    documentApi.downloadResults(jobId);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 dark:border-blue-400"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded">
        <p>{error}</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="bg-yellow-100 dark:bg-yellow-900 border border-yellow-400 dark:border-yellow-700 text-yellow-700 dark:text-yellow-300 px-4 py-3 rounded">
        <p>{t('job.not.found')}</p>
      </div>
    );
  }

  // Calculate progress percentage
  const progressPercentage = calculatePercentage(job.processed_files, job.total_files);
  
  // Get stats for different document types
  const processingStats = job.processing_stats || {};

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">{t('job.title')}</h2>
        <div className={`px-3 py-1 rounded-full text-white text-sm font-medium ${getStatusColor(job.status)}`}>
          {t(`status.${job.status}`) || job.status}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">{t('job.id')}</p>
          <p className="font-medium">{job.job_id}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">{t('job.started')}</p>
          <p className="font-medium">{formatDate(job.start_time)}</p>
        </div>
        {job.end_time && (
          <>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t('job.completed')}</p>
              <p className="font-medium">{formatDate(job.end_time)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t('job.time')}</p>
              <p className="font-medium">{calculateProcessingTime(job.start_time, job.end_time)}</p>
            </div>
          </>
        )}
      </div>
      
      <div className="mb-6">
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium">{t('job.progress')}</span>
          <span className="text-sm font-medium">{job.processed_files} {t('job.of')} {job.total_files} {t('job.files')}</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
          <div 
            className="bg-blue-600 dark:bg-blue-500 h-2.5 rounded-full" 
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>
      
      {Object.keys(processingStats).length > 0 && (
        <div className="mb-6">
          <h3 className="text-md font-medium mb-2">{t('job.stats')}</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('job.stats.status')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('job.stats.count')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('job.stats.recognized')}</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {Object.entries(processingStats).map(([status, data]) => (
                  <tr key={status}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{status}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{data.count}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{data.recognized}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {job.status === 'completed' && (
        <div className="mt-6">
          <button
            onClick={handleDownload}
            className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white font-medium rounded-md"
          >
            {t('job.download')}
          </button>
        </div>
      )}
      
      {job.error_message && (
        <div className="mt-4 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-md">
          <h3 className="font-medium">{t('job.error')}</h3>
          <p className="text-sm">{job.error_message}</p>
        </div>
      )}
    </div>
  );
};

export default JobStatus;