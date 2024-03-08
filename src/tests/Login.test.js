// Login.test.js
import { render, fireEvent, screen } from '@testing-library/react';
import Login from './Login';

it('renders login form', () => {
  render(<Login />);
  expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
});

it('submits the form with email and password', () => {
  const mockSubmit = jest.fn();
  render(<Login onSubmit={mockSubmit} />);
  
  fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@test.com' } });
  fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
  fireEvent.click(screen.getByText(/login/i));
  
  expect(mockSubmit).toHaveBeenCalledWith('test@test.com', 'password123');
});
