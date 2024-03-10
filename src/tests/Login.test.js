// Login.test.js
import { render, fireEvent, screen } from '@testing-library/react';
import Login from './Login';
import * as authService from '../AuthContext'; 

jest.mock('../../services/authService'); 

it('renders login form', () => {
  render(<Login />);
  expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
});

it('submits the form with email and password', async () => {
  const emailInput = screen.getByLabelText(/email/i);
  const passwordInput = screen.getByLabelText(/password/i);
  const loginButton = screen.getByRole('button', { name: /login/i });
  
  authService.signup.mockResolvedValueOnce(true); 
  
  fireEvent.change(emailInput, { target: { value: 'test@test.com' } });
  fireEvent.change(passwordInput, { target: { value: 'password123' } });
  fireEvent.click(loginButton);
  
  expect(authService.signup).toHaveBeenCalledWith('test@test.com', 'password123');
});
