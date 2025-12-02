import React, { useState, useEffect } from 'react';

const Profile = () => {
  const [userData, setUserData] = useState({
    firstName: 'Rana',
    lastName: 'Ahmed',
    email: 's-rana.maaty@zewailcity.edu.eg',
    bio: 'Love cooking healthy meals and trying new recipes!',
    avatar: 'https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg',
    joinDate: 'Jan 2024'
  });

  const [formData, setFormData] = useState({ ...userData });
  const [errors, setErrors] = useState({});
  const [isModified, setIsModified] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');

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
      
      // wait
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // update user data with form data
      setUserData({ ...formData });
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

  return (
    <div className="bg-gray-50 min-h-screen">

      <main className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
          <p className="text-gray-600 mt-2">Manage your account settings and preferences</p>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* at left side */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-center">
                <div className="w-24 h-24 mx-auto mb-4">
                  <img 
                    src={userData.avatar} 
                    alt="user photo" 
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <h3 className="text-lg font-bold text-gray-900">
                  {userData.firstName} {userData.lastName}
                </h3>
                <p className="text-gray-600 text-sm">{userData.email}</p>
                <p className="text-green-600 text-sm mt-2">
                  member since {userData.joinDate}
                </p>
              </div>
            </div>
          </div>

          {/* right side*/}
          <div className="lg:col-span-2 space-y-6">
            <form onSubmit={handleSubmit}>
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-xl font-bold text-gray-900">Personal Information</h2>
                </div>
                <div className="p-6 space-y-4">
                  {/* data name */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        First name
                      </label>
                      <input 
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-green-500 ${
                          errors.firstName ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.firstName && (
                        <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Last name
                      </label>
                      <input 
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-green-500 ${
                          errors.lastName ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.lastName && (
                        <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                      )}
                    </div>
                  </div>
                  
                  {/* email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input 
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-green-500 ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                    )}
                  </div>
                  
                  {/* bio*/}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Bio
                    </label>
                    <textarea 
                      rows="3"
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      placeholder="Tell us about yourself..."
                      className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-green-500 ${
                        errors.bio ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.bio && (
                      <p className="mt-1 text-sm text-red-600">{errors.bio}</p>
                    )}
                    <p className="mt-1 text-sm text-gray-500">
                      {formData.bio.length}/500 characters
                    </p>
                  </div>
                </div>
              </div>

              {/* status mssage and Buttons */}
              <div className="flex flex-col space-y-4">
                {/* status message */}
                {saveStatus && (
                  <div className={`text-sm font-medium ${
                    saveStatus.includes('Error') || saveStatus.includes('Please fix') 
                      ? 'text-red-600' 
                      : saveStatus.includes('Saving')
                      ? 'text-blue-600'
                      : 'text-green-600'
                  }`}>
                    {saveStatus}
                  </div>
                )}

                {/* buttons */}
                <div className="flex justify-end space-x-4">
                  {isModified && (
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium py-2 px-6 rounded-lg transition duration-300 mt-3 "
                    >
                      Cancel
                    </button>
                  )}
                  <button 
                    type="submit"
                    disabled={!isModified || saveStatus === 'Saving...'}
                    className={`font-medium py-2 py px-6 rounded-lg transition duration-300 mt-3 ${
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
      </main>
    </div>
  );
};

export default Profile;