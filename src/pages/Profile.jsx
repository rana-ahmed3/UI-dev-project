import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut } from 'lucide-react';
import Loading from '../components/common/Loading';

const Profile = () => {
  const { user, updateProfile, logout } = useAuth();
  const navigate = useNavigate();
  
  // Use user data from auth context
  const [userData, setUserData] = useState(user || {
    firstName: 'Rana',
    lastName: 'Ahmed',
    email: 's-rana.maaty@zewailcity.edu.eg',
    bio: 'Love cooking healthy meals and trying new recipes!',
    avatar: 'https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg',
    joinDate: 'Jan 2024',
    role: 'user'
  });

  const [formData, setFormData] = useState({ ...userData });
  const [errors, setErrors] = useState({});
  const [isModified, setIsModified] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Update formData when user data changes
  useEffect(() => {
    if (user) {
      setUserData(user);
      setFormData({ ...user });
    }
  }, [user]);

  // check if form has been modified
  useEffect(() => {
    const hasChanges = 
      formData.firstName !== userData.firstName ||
      formData.lastName !== userData.lastName ||
      formData.email !== userData.email ||
      formData.bio !== userData.bio;
    
    setIsModified(hasChanges);
  }, [formData, userData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // clear error while typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // validate first name 
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = 'First name must be at least 2 characters';
    }

    // last name
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = 'Last name must be at least 2 characters';
    }

    // email 
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // bio
    if (formData.bio.length > 500) {
      newErrors.bio = 'Bio must be less than 500 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setSaveStatus('Please fix the errors above');
      return;
    }

    try {
      setSaveStatus('Saving...');
      
      // Update profile using auth context
      updateProfile({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        bio: formData.bio
      });
      
      setIsModified(false);
      setSaveStatus('Changes saved successfully!');
      
      // delete success message
      setTimeout(() => {
        setSaveStatus('');
      }, 3000);

    } catch (error) {
      setSaveStatus('Error saving changes. Please try again.');
    }
  };

  const handleCancel = () => {
    setFormData({ ...userData });
    setErrors({});
    setIsModified(false);
    setSaveStatus('');
  };

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    logout();
    navigate('/');
    setShowLogoutConfirm(false);
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      {/* Logout Confirmation Dialog */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900">
              <LogOut className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            
            <h3 className="text-lg font-bold text-gray-900 dark:text-white text-center mb-2">
              Confirm Logout
            </h3>
            
            <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
              Are you sure you want to logout? You will need to sign in again to access your account.
            </p>
            
            <div className="flex justify-center space-x-4">
              <button
                onClick={cancelLogout}
                className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-300"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-300"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Title */}
      <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Profile Settings</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Manage your account settings and preferences</p>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left side */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="text-center">
                <div className="w-24 h-24 mx-auto mb-4">
                  <img 
                    src={userData.avatar} 
                    alt="user photo" 
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  {userData.firstName} {userData.lastName}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{userData.email}</p>
                <p className="text-green-600 dark:text-green-400 text-sm mt-2">
                  member since {userData.joinDate}
                </p>
                
                {/* Logout Button */}
                <button
                  onClick={handleLogoutClick}
                  className="mt-6 w-full py-2 px-4 inline-flex items-center justify-center gap-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-300"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            </div>
          </div>

          {/* Right side*/}
          <div className="lg:col-span-2 space-y-6">
            <form onSubmit={handleSubmit}>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Personal Information</h2>
                </div>
                <div className="p-6 space-y-4">
                  {/* Name fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        First name
                      </label>
                      <input 
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-green-500 ${
                          errors.firstName ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                        }`}
                      />
                      {errors.firstName && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.firstName}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Last name
                      </label>
                      <input 
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-green-500 ${
                          errors.lastName ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                        }`}
                      />
                      {errors.lastName && (
                        <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                      )}
                    </div>
                  </div>
                  
                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Email
                    </label>
                    <input 
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-green-500 ${
                        errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      }`}
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                    )}
                  </div>
                  
                  {/* Bio */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Bio
                    </label>
                    <textarea 
                      rows="3"
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      placeholder="Tell us about yourself..."
                      className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-green-500 ${
                        errors.bio ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      }`}
                    />
                    {errors.bio && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.bio}</p>
                    )}
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      {formData.bio.length}/500 characters
                    </p>
                  </div>
                </div>
              </div>

              {/* Status message and Buttons */}
              <div className="flex flex-col space-y-4">
                {/* Status message */}
                {saveStatus && (
                  <div className={`text-sm font-medium ${
                    saveStatus.includes('Error') || saveStatus.includes('Please fix') 
                      ? 'text-red-600 dark:text-red-400' 
                      : saveStatus.includes('Saving')
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-green-600 dark:text-green-400'
                  }`}>
                    {saveStatus}
                  </div>
                )}

                {/* Buttons */}
                <div className="flex justify-end space-x-4">
                  {isModified && (
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium py-2 px-6 rounded-lg transition duration-300 mt-3 "
                    >
                      Cancel
                    </button>
                  )}
                  <button 
                    type="submit"
                    disabled={!isModified || saveStatus === 'Saving...'}
                    className={`font-medium py-2 px-6 rounded-lg transition duration-300 mt-3 ${
                      isModified && saveStatus !== 'Saving...'
                        ? 'bg-green-600 hover:bg-green-700 text-white'
                        : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                    }`}
                  >
                    {saveStatus === 'Saving...' ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
    </div>
  );
};

export default Profile;