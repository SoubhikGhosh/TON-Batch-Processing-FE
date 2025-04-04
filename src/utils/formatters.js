// Format date to a human-readable format
export const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    return date.toLocaleString();
  };
  
  // Format file size
  export const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  // Calculate processing time
  export const calculateProcessingTime = (startTime, endTime) => {
    if (!startTime || !endTime) return 'N/A';
    
    const start = new Date(startTime);
    const end = new Date(endTime);
    
    const diffMs = end - start;
    const diffMins = Math.floor(diffMs / 60000);
    const diffSecs = Math.floor((diffMs % 60000) / 1000);
    
    if (diffMins === 0) {
      return `${diffSecs} seconds`;
    }
    
    return `${diffMins} minutes, ${diffSecs} seconds`;
  };
  
  // Calculate processing percentage
  export const calculatePercentage = (processed, total) => {
    if (!total || total === 0) return 0;
    return Math.round((processed / total) * 100);
  };
  
  // Get status color - works with both light and dark themes
  export const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500 dark:bg-green-600';
      case 'processing':
        return 'bg-blue-500 dark:bg-blue-600';
      case 'failed':
        return 'bg-red-500 dark:bg-red-600';
      default:
        return 'bg-gray-500 dark:bg-gray-600';
    }
  };