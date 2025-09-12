import React from 'react';
import { Link } from 'react-router-dom';

const UnauthorizedPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <BackButton />
      <div className="max-w-md w-full space-y-8 text-center bg-white p-10 rounded-xl shadow-lg">
        <h1 className="text-4xl font-extrabold text-red-600">Access Denied</h1>
        <p className="mt-2 text-lg text-gray-600">You do not have the necessary permissions to view this page.</p>
        <div className="mt-6">
          <Link to="/" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Go to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;