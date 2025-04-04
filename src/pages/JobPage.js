import React, { useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import JobStatus from '../components/JobStatus';
import { LanguageContext } from '../context/LanguageContext';

const JobPage = () => {
  const { jobId } = useParams();
  const { t } = useContext(LanguageContext);
  
  // Store job ID in local storage for history
  useEffect(() => {
    try {
      // Get existing jobs
      const existingJobs = JSON.parse(localStorage.getItem('processingJobs')) || [];
      
      // Check if this job is already in the list
      const existingJobIndex = existingJobs.findIndex(job => job.job_id === jobId);
      
      if (existingJobIndex === -1) {
        // Add a placeholder for this job if it doesn't exist
        const newJob = {
          job_id: jobId,
          status: 'processing',
          start_time: new Date().toISOString(),
          total_files: 0,
          processed_files: 0
        };
        
        // Add to beginning of array (most recent first)
        existingJobs.unshift(newJob);
        
        // Store back to local storage (limit to 20 most recent)
        localStorage.setItem('processingJobs', JSON.stringify(existingJobs.slice(0, 20)));
      }
    } catch (error) {
      console.error('Error storing job in history:', error);
    }
  }, [jobId]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-4">
        <Link to="/jobs" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
          &larr; {t('job.back')}
        </Link>
      </div>
      
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">{t('job.title')}</h1>
        <JobStatus />
      </div>
    </div>
  );
};

export default JobPage;