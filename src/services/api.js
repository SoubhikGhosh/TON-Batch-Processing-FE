import axios from 'axios';

// Set the base URL for the API
const API_BASE_URL = 'http://localhost:8001';

// Create an axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
});

// API functions for document processing
const documentApi = {
  // Upload zip files
  uploadFiles: async (files) => {
    const formData = new FormData();
    
    // Append each file to the form data
    files.forEach(file => {
      formData.append('files', file);
    });
    
    const response = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  },
  
  // Get job status
  getJobStatus: async (jobId) => {
    try {
      const response = await api.get(`/status/${jobId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching job status:', error);
      throw error;
    }
  },
  
  // Download results
  downloadResults: (jobId) => {
    // Create a direct URL for download
    const downloadUrl = `${API_BASE_URL}/download/${jobId}`;
    
    // Open the download URL in a new tab/window
    window.open(downloadUrl, '_blank');
  },
  
  // Get dashboard statistics
  getStats: async () => {
    try {
      // Try to get stats from the backend if the endpoint exists
      const response = await api.get('/stats');
      const data = response.data;
      
      // Format the data correctly - handle various possible response formats
      const formattedData = {
        jobs: data.jobs || {},
        files: {},
        processing_times: data.processing_times || []
      };
      
      // Handle different possible formats of the files data
      if (data.files) {
        if (Array.isArray(data.files)) {
          // If files is an array [total, recognized]
          formattedData.files = {
            total: data.files[0] || 0,
            recognized: data.files[1] || 0
          };
        } else if (typeof data.files === 'object') {
          // If files is already an object with total and recognized
          formattedData.files = data.files;
        }
      }
      
      console.log('Formatted stats data:', formattedData);
      return formattedData;
    } catch (error) {
      console.error('Error getting stats:', error);
      // Return empty stats as a fallback
      return {
        jobs: {
          completed: 0,
          processing: 0,
          failed: 0
        },
        files: {
          total: 0,
          recognized: 0
        },
        processing_times: []
      };
    }
  },
  
  // Health check
  checkHealth: async () => {
    try {
      const response = await api.get('/health');
      return response.data;
    } catch (error) {
      console.error('Health check failed:', error);
      return { status: 'unhealthy' };
    }
  },
};

export default documentApi;