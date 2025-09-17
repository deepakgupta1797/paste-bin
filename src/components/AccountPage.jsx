import React, { useState, useRef, useEffect } from "react";
import BackButton from './BackButton';
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { selectCurrentUser, updateUserProfile } from "../redux/authSlice";
import { FiCamera, FiEdit2, FiSave, FiX, FiUser, FiMail, FiLock, FiShield } from "react-icons/fi";
import toast from "react-hot-toast";

const AccountPage = () => {
  const currentUser = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    username: '',
    email: '',
    profilePic: ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  useEffect(() => {
    if (currentUser) {
      // Redirect admin users to admin page
      if (currentUser.role === 'admin') {
        navigate('/admin');
        return;
      }
      
      setProfileData({
        name: currentUser.name || '',
        username: currentUser.username || '',
        email: currentUser.email || currentUser.emailid || '',
        profilePic: currentUser.profilePic || ''
      });
    }
  }, [currentUser, navigate]);

  if (!currentUser) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-8">
          <p className="text-gray-600 dark:text-gray-400">Please log in to view your account.</p>
          <Link 
            to="/login" 
            className="mt-4 inline-block px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Login
          </Link>
        </div>
      </div>
    );
  }

  // If admin, this component won't render due to redirect
  if (currentUser.role === 'admin') {
    return null;
  }

  const handleProfilePicChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Profile picture must be less than 5MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileData(prev => ({
          ...prev,
          profilePic: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileUpdate = async () => {
    try {
      // Validate data
      if (!profileData.name.trim() || !profileData.username.trim()) {
        toast.error('Name and username are required');
        return;
      }

      if (profileData.email && !/\S+@\S+\.\S+/.test(profileData.email)) {
        toast.error('Please enter a valid email address');
        return;
      }

      const updateData = {
        ...profileData,
        id: currentUser.id
      };

      // TODO: Replace with actual API call when backend is ready
      dispatch(updateUserProfile(updateData));
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const handlePasswordUpdate = async () => {
    try {
      if (!passwordData.currentPassword || !passwordData.newPassword) {
        toast.error('Please fill in all password fields');
        return;
      }

      if (passwordData.newPassword !== passwordData.confirmPassword) {
        toast.error('New passwords do not match');
        return;
      }

      if (passwordData.newPassword.length < 6) {
        toast.error('New password must be at least 6 characters');
        return;
      }

      // TODO: Replace with actual API call when backend is ready
      toast.success('Password updated successfully!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setShowPasswordForm(false);
    } catch (error) {
      toast.error('Failed to update password');
    }
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setProfileData({
      name: currentUser.name || '',
      username: currentUser.username || '',
      email: currentUser.email || currentUser.emailid || '',
      profilePic: currentUser.profilePic || ''
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <BackButton />
        
        <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6">
            <h1 className="text-3xl font-bold text-white">My Account</h1>
            <p className="text-indigo-100 mt-2">Manage your profile and account settings</p>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Profile Picture Section */}
              <div className="lg:col-span-1">
                <div className="text-center">
                  <div className="relative inline-block">
                    <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center border-4 border-white shadow-lg">
                      {profileData.profilePic ? (
                        <img 
                          src={profileData.profilePic} 
                          alt="Profile" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <FiUser className="w-16 h-16 text-white" />
                      )}
                    </div>
                    {isEditing && (
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute bottom-0 right-0 w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center hover:bg-indigo-700 transition-colors shadow-lg"
                        title="Change profile picture"
                      >
                        <FiCamera className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePicChange}
                    className="hidden"
                  />
                  <h2 className="mt-4 text-xl font-semibold text-gray-800 dark:text-gray-200">
                    {profileData.name}
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400 capitalize">
                    {currentUser.role}
                  </p>
                </div>
              </div>

              {/* Profile Information Section */}
              <div className="lg:col-span-2">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                    <FiUser className="w-5 h-5" />
                    Profile Information
                  </h3>
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      <FiEdit2 className="w-4 h-4" />
                      Edit Profile
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={handleProfileUpdate}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <FiSave className="w-4 h-4" />
                        Save
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                      >
                        <FiX className="w-4 h-4" />
                        Cancel
                      </button>
                    </div>
                  )}
                </div>

                <div className="space-y-6">
                  {/* Name Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Full Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profileData.name}
                        onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-gray-100"
                        placeholder="Enter your full name"
                      />
                    ) : (
                      <p className="text-gray-800 dark:text-gray-200 py-2">{profileData.name}</p>
                    )}
                  </div>

                  {/* Username Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Username
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profileData.username}
                        onChange={(e) => setProfileData(prev => ({ ...prev, username: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-gray-100"
                        placeholder="Enter your username"
                      />
                    ) : (
                      <p className="text-gray-800 dark:text-gray-200 py-2">@{profileData.username}</p>
                    )}
                  </div>

                  {/* Email Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email Address
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-gray-100"
                        placeholder="Enter your email address"
                      />
                    ) : (
                      <p className="text-gray-800 dark:text-gray-200 py-2">{profileData.email || 'No email provided'}</p>
                    )}
                  </div>

                  {/* Role Field (Read-only) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Account Role
                    </label>
                    <div className="flex items-center gap-2">
                      <FiShield className="w-4 h-4 text-indigo-600" />
                      <span className="text-gray-800 dark:text-gray-200 capitalize font-medium">
                        {currentUser.role}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Password Change Section */}
            <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                  <FiLock className="w-5 h-5" />
                  Security Settings
                </h3>
                <button
                  onClick={() => setShowPasswordForm(!showPasswordForm)}
                  className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                >
                  <FiLock className="w-4 h-4" />
                  Change Password
                </button>
              </div>

              {showPasswordForm && (
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Current Password
                      </label>
                      <input
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-600 dark:text-gray-100"
                        placeholder="Enter current password"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        New Password
                      </label>
                      <input
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-600 dark:text-gray-100"
                        placeholder="Enter new password"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-600 dark:text-gray-100"
                        placeholder="Confirm new password"
                      />
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={handlePasswordUpdate}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Update Password
                    </button>
                    <button
                      onClick={() => {
                        setShowPasswordForm(false);
                        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                      }}
                      className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Account Stats */}
            <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Account Activity</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-300">0</div>
                  <div className="text-sm text-blue-800 dark:text-blue-200">Pastes Created</div>
                </div>
                <div className="bg-green-50 dark:bg-green-900 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-300">0</div>
                  <div className="text-sm text-green-800 dark:text-green-200">Blog Posts</div>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-300">0</div>
                  <div className="text-sm text-purple-800 dark:text-purple-200">Chat Messages</div>
                </div>
                <div className="bg-amber-50 dark:bg-amber-900 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-amber-600 dark:text-amber-300">Member</div>
                  <div className="text-sm text-amber-800 dark:text-amber-200">Since Today</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
