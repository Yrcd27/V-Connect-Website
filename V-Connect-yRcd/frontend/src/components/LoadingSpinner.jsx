import React from 'react';

const LoadingSpinner = ({ size = 'medium' }) => {
  const spinnerSizes = {
    small: {
      container: 'w-10 h-10',
      border: 'border-2',
      text: 'text-xs mt-2',
      showText: false
    },
    medium: {
      container: 'w-16 h-16',
      border: 'border-4',
      text: 'text-sm mt-4',
      showText: true
    },
    large: {
      container: 'w-20 h-20',
      border: 'border-4',
      text: 'text-base mt-4',
      showText: true
    }
  };

  const { container, border, text, showText } = spinnerSizes[size] || spinnerSizes.medium;

  return (
    <div className="fixed inset-0 flex flex-col justify-center items-center bg-white bg-opacity-80 z-40">
      <div className="relative">
        <div className={`${container} ${border} border-primary/30 rounded-full`}></div>
        <div className={`absolute top-0 left-0 ${container} ${border} border-primary rounded-full animate-spin border-t-transparent`}></div>
      </div>
      {showText && <p className={`${text} text-gray-600 font-medium`}>Loading...</p>}
    </div>
  );
};

export default LoadingSpinner;
