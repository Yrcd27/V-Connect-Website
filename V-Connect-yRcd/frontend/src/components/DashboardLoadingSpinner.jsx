import React from 'react';
import { motion } from 'framer-motion';

const DashboardLoadingSpinner = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col justify-center items-center h-64 w-full"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ 
          scale: 1, 
          opacity: 1,
          transition: { 
            duration: 0.5,
            ease: "easeInOut" 
          } 
        }}
      >
        <div className="relative">
          <div className="w-16 h-16 border-4 border-primary/30 rounded-full"></div>
          <div className="absolute top-0 left-0 w-16 h-16 border-4 border-primary rounded-full animate-spin border-t-transparent"></div>
        </div>
        <motion.p 
          className="text-sm mt-4 text-gray-600 font-medium text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Loading dashboard...
        </motion.p>
      </motion.div>
    </motion.div>
  );
};

export default DashboardLoadingSpinner;
