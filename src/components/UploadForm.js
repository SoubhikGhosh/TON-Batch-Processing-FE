import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import documentApi from '../services/api';
import { LanguageContext } from '../context/LanguageContext';

const UploadForm = () => {
  const [files, setFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const navigate = useNavigate();
  const { t } = useContext(LanguageContext);

  const handleFileChange = (e) => {
    // Filter for zip files only
    const selectedFiles = Array.from(e.target.files).filter(
      file => file.type === 'application/zip' || file.name.endsWith('.zip')
    );
    
    setFiles(selectedFiles);
    setUploadError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (files.length === 0) {
      setUploadError(t('upload.error.empty'));
      return;
    }
    
    setIsUploading(true);
    setUploadError(null);
    
    try {
      const response = await documentApi.uploadFiles(files);
      
      // Redirect to job status page
      navigate(`/job/${response.job_id}`);
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError(
        error.response?.data?.detail || 
        'An error occurred during upload. Please try again.'
      );
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">{t('upload.title')}</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
          <input
            type="file"
            multiple
            accept=".zip"
            onChange={handleFileChange}
            className="hidden"
            id="file-upload"
            disabled={isUploading}
          />
          <label htmlFor="file-upload" className="cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {files.length > 0 
                ? `${t('upload.selected')} ${files.length} ${t('upload.files')}` 
                : t('upload.drag')}
            </p>
          </label>
        </div>
        
        {files.length > 0 && (
          <div className="mt-4">
            <h3 className="text-md font-medium mb-2">{t('upload.selected')} {t('upload.files')}:</h3>
            <ul className="list-disc pl-5 space-y-1">
              {files.map((file, index) => (
                <li key={index} className="text-sm">
                  {file.name} ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {uploadError && (
          <div className="text-red-500 dark:text-red-400 text-sm font-medium mt-2">
            {uploadError}
          </div>
        )}
        
        <div className="mt-4">
          <button
            type="submit"
            className={`w-full py-2 px-4 rounded-md font-medium text-white 
              ${isUploading 
                ? 'bg-blue-400 dark:bg-blue-600 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600'}`}
            disabled={isUploading}
          >
            {isUploading ? t('upload.uploading') : t('upload.button')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UploadForm;