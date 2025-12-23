import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Input from './Input';

describe('Input Component', () => {
  test('renders input field', () => {
    render(<Input placeholder="Test Input" />);
    
    const input = screen.getByPlaceholderText(/Test Input/i);
    expect(input).toBeInTheDocument();
  });

  test('accepts text input', () => {
    render(<Input placeholder="Test Input" />);
    
    const input = screen.getByPlaceholderText(/Test Input/i);
    fireEvent.change(input, { target: { value: 'Test Value' } });
    
    expect(input.value).toBe('Test Value');
  });

  test('handles onChange events', () => {
    const handleChange = jest.fn();
    render(<Input placeholder="Test Input" onChange={handleChange} />);
    
    const input = screen.getByPlaceholderText(/Test Input/i);
    fireEvent.change(input, { target: { value: 'New Value' } });
    
    expect(handleChange).toHaveBeenCalled();
  });

  test('renders different input types', () => {
    const { container } = render(
      <>
        <Input type="email" placeholder="Email" />
        <Input type="password" placeholder="Password" />
        <Input type="number" placeholder="Number" />
      </>
    );
    
    expect(container.querySelector('input[type="email"]')).toBeInTheDocument();
    expect(container.querySelector('input[type="password"]')).toBeInTheDocument();
    expect(container.querySelector('input[type="number"]')).toBeInTheDocument();
  });

  test('disables input when disabled prop is true', () => {
    render(<Input placeholder="Test Input" disabled />);
    
    const input = screen.getByPlaceholderText(/Test Input/i);
    expect(input).toBeDisabled();
  });

  test('displays label when provided', () => {
    render(<Input label="Recipe Name" placeholder="Enter name" />);
    
    expect(screen.getByText(/Recipe Name/i)).toBeInTheDocument();
  });

  test('applies custom class names', () => {
    const { container } = render(
      <Input className="custom-input" placeholder="Test" />
    );
    
    const input = container.querySelector('.custom-input');
    expect(input).toBeInTheDocument();
  });

  test('validates required field', async () => {
    render(<Input placeholder="Test Input" required />);
    
    const input = screen.getByPlaceholderText(/Test Input/i);
    expect(input).toHaveAttribute('required');
  });
});
