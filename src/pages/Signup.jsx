import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    terms: false
  });
  
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
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

    // first name
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

    // password
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    // confirm password 
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // terms and conditions
    if (!formData.terms) {
      newErrors.terms = 'You must agree to the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // wait time to run isloading
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Redirect to home page after successful signup
      navigate('/home');
      
    } catch (error) {
      setErrors({ submit: 'Signup failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const backgroundStyle = {
    backgroundImage: `url('https://www.georgeinstitute.org/sites/default/files/2020-10/world-food-day-2020.png')`
  };

  return (
    <div className="min-h-screen">
      <div 
        className="background-container fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={backgroundStyle}
      >
        <div className="dark-overlay absolute inset-0 bg-black bg-opacity-60"></div>
      </div>
      
      {/* title */}
      <div className="content relative flex items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white">Create your account</h2>
            <p className="mt-2 text-sm text-white">Join RecipeFinder and start planning your meals</p>
          </div>
          
          {/* sign up */}
          <form onSubmit={handleSubmit} className="mt-8 space-y-6 bg-white bg-opacity-90 p-8 rounded-xl shadow-2xl">
            {errors.submit && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {errors.submit}
              </div>
            )}
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                    First name
                  </label>
                  <input 
                    id="firstName" 
                    name="firstName" 
                    type="text" 
                    required 
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className={`mt-1 block w-full px-3 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 transition duration-300 ${
                      errors.firstName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Rana"
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                    Last name
                  </label>
                  <input 
                    id="lastName" 
                    name="lastName" 
                    type="text" 
                    required 
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className={`mt-1 block w-full px-3 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 transition duration-300 ${
                      errors.lastName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Ahmed"
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                  )}
                </div>
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <input 
                  id="email" 
                  name="email" 
                  type="email" 
                  required 
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full px-3 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-300 ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="s-rana.maaty@zewailcity.edu.eg"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input 
                  id="password" 
                  name="password" 
                  type="password" 
                  required 
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full px-3 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 transition duration-300 ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Create a password"
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirm password
                </label>
                <input 
                  id="confirmPassword" 
                  name="confirmPassword" 
                  type="password" 
                  required 
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full px-3 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 transition duration-300 ${
                    errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Confirm your password"
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                )}
              </div>
            </div>

            <div className="flex items-start">
              <input 
                id="terms" 
                name="terms" 
                type="checkbox" 
                required 
                checked={formData.terms}
                onChange={handleInputChange}
                className="h-4 w-4 accent-green-500 rounded mt-1"
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                I agree to the <a href="#" className="text-green-600 hover:text-green-500 transition duration-300">Terms and Conditions</a>
              </label>
            </div>
            {errors.terms && (
              <p className="text-sm text-red-600">{errors.terms}</p>
            )}

            <div>
              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? 'Creating account...' : 'Create account'}
              </button>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Already have an account?
                <Link to="/login" className="font-medium text-green-600 hover:text-green-500 transition duration-300 ml-1">
                  Sign in here
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;