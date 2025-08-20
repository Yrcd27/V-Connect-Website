import React from 'react';
import { FiAlertCircle } from 'react-icons/fi';

/**
 * ApiErrorBanner - Displays a warning message when API data cannot be loaded
 * @param {Object} props
 * @param {string} props.message - The error message to display
 * @param {Function} props.onRetry - Function to call when retry button is clicked
 * @param {string} [props.className] - Additional CSS classes
 */
const ApiErrorBanner = ({ message, onRetry, className = '' }) => {
  return (
    <div className={`bg-amber-50 border-l-4 border-amber-500 text-amber-700 p-4 rounded-md ${className}`}>
      <div className="flex items-center mb-1">
        <FiAlertCircle className="text-amber-500 mr-2" size={18} />
        <span className="font-medium">Using Sample Data</span>
      </div>
      <p className="ml-6 text-sm">{message}</p>
      {onRetry && (
        <button 
          onClick={onRetry} 
          className="ml-6 mt-2 text-sm bg-amber-100 hover:bg-amber-200 text-amber-700 px-3 py-1 rounded-md flex items-center"
        >
          <span className="mr-1">↻</span> Retry Connection
        </button>
      )}
    </div>
  );
};

export default ApiErrorBanner;
