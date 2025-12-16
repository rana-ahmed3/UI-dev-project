import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from './Login';
import { AuthProvider } from '../context/AuthContext';


// check if the login page has an email and password field.

test('Login page has email and password fields', () => {
  render(
    <BrowserRouter>
      <AuthProvider>
        <Login />
      </AuthProvider>
    </BrowserRouter>
  );
  
  // check for email field
  const emailInput = screen.getByLabelText(/email/i);
  expect(emailInput).toBeInTheDocument();
  expect(emailInput).toHaveAttribute('type', 'email');
  
  // check for password field
  const passwordInput = screen.getByLabelText(/password/i);
  expect(passwordInput).toBeInTheDocument();
  expect(passwordInput).toHaveAttribute('type', 'password');
  
  // check for submit button
  const submitButton = screen.getByRole('button', { name: /sign in/i });
  expect(submitButton).toBeInTheDocument();
});