import React from 'react';
import { useNavigate } from 'react-router-dom';

const BackButton = ({ label = 'Back', className = '' }) => {
  const navigate = useNavigate();
  return (
    <button
      type="button"
      onClick={() => navigate(-1)}
      className={`px-4 py-2 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-md shadow-sm mb-4 transition-colors duration-200 ${className}`}
    >
      {label}
    </button>
  );
};

export default BackButton;
