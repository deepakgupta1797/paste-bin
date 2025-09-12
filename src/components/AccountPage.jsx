import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { selectCurrentUser } from "../redux/authSlice";

const AccountPage = () => {
  const currentUser = useSelector(selectCurrentUser);

  if (!currentUser) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p>Loading user information or not logged in...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-xl rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            My Account
          </h1>
          <div className="space-y-4 mb-8">
            <p className="text-lg text-gray-700">
              <span className="font-semibold">Name:</span>
              {currentUser.name}
            </p>
            <p className="text-lg text-gray-700">
              <span className="font-semibold">Username:</span>
              {currentUser.username}
            </p>

            {currentUser.emailid && (
              <p className="text-lg text-gray-700">
                <span className="font-semibold">Email:</span>
                {currentUser.emailid}
              </p>
            )}
            <p className="text-lg text-gray-700">
              <span className="font-semibold">Role:</span>
              <span className="capitalize">{currentUser.role}</span>
            </p>
          </div>
          <div className="mt-6 border-t pt-6">
            <Link
              to="/change-password"
              className="w-full flex justify-center py-3 px-4 border
               border-transparent rounded-md shadow-sm text-sm font-medium 
               text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none 
               focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Change My Password
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
