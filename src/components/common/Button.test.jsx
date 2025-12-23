import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Button from './Button';

describe('Button Component', () => {
  test('renders button with text', () => {
    render(<Button>Click Me</Button>);
    
    const button = screen.getByRole('button', { name: /Click Me/i });
    expect(button).toBeInTheDocument();
  });

  test('handles click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click Me</Button>);
    
    const button = screen.getByRole('button', { name: /Click Me/i });
    fireEvent.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('disables button when disabled prop is true', () => {
    render(<Button disabled>Disabled Button</Button>);
    
    const button = screen.getByRole('button', { name: /Disabled Button/i });
    expect(button).toBeDisabled();
  });

  test('applies custom class names', () => {
    const { container } = render(
      <Button className="custom-class">Styled Button</Button>
    );
    
    const button = container.querySelector('.custom-class');
    expect(button).toBeInTheDocument();
  });

  test('renders button with different types', () => {
    render(
      <>
        <Button type="submit">Submit</Button>
        <Button type="reset">Reset</Button>
      </>
    );
    
    expect(screen.getByRole('button', { name: /Submit/i })).toHaveAttribute('type', 'submit');
    expect(screen.getByRole('button', { name: /Reset/i })).toHaveAttribute('type', 'reset');
  });
});
