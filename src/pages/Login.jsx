import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  //intialize
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  //get data from user 
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

    // valide email
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // password 
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    else if (formData.password.length < 6) {
      newErrors.password = 'Password is not less than 6 characters';
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
      // as if it take time to send to backend but we don't
      await new Promise(resolve => setTimeout(resolve, 1000));

      // done go home page
      navigate('/home');

    } catch (error) {
      setErrors({ submit: 'Login failed. Please check your credentials and try again.' });
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
        className="background min-h-screen bg-cover bg-center bg-no-repeat"
        style={backgroundStyle}
      >
        <div className="transparent_layer absolute inset-0 bg-black bg-opacity-60"></div>

        {/* title*/}
        <div className="content relative flex items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white">Welcome back</h2>
              <p className="mt-2 text-sm text-white">Sign in to your RecipeFinder account</p>
            </div>

            {/* login*/}
            <form onSubmit={handleSubmit} className="mt-8 space-y-6 bg-white bg-opacity-90 p-8 rounded-xl">
              {errors.submit && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                  {errors.submit}
                </div>
              )}

              <div className="space-y-4">
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
                    className={`mt-1 block w-full px-3 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 transition duration-300 ${errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                    placeholder="Enter your email"
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
                    className={`mt-1 block w-full px-3 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 transition duration-300 ${errors.password ? 'border-red-500' : 'border-gray-300'
                      }`}
                    placeholder="Enter your password"
                  />
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="rememberMe"
                    type="checkbox"
                    checked={formData.rememberMe}
                    onChange={handleInputChange}
                    className="h-4 w-4 accent-green-500 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <a href="#" className="font-medium text-green-600 hover:text-green-500 transition duration-300">
                    Forgot password?
                  </a>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 transition duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isLoading ? 'Signing in...' : 'Sign in'}
                </button>
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Don't have an account?
                  <Link to="/signup" className="font-medium text-green-600 hover:text-green-500 transition duration-300 ml-1">
                    Sign up here
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;