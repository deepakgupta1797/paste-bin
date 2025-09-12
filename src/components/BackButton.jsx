import React from 'react';
import { useNavigate } from 'react-router-dom';

const BackButton = ({ label = 'Back', className = '' }) => {
  const navigate = useNavigate();
  return (
    <button
      type="button"
      onClick={() => navigate(-1)}
      className={`px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md shadow-sm mb-4 ${className}`}
    >
      {label}
    </button>
  );
};

export default BackButton;
