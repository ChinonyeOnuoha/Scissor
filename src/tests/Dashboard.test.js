// Dashboard.test.js
import {  render, screen } from '@testing-library/react';
import Dashboard from './Dashboard';
import { AuthProvider } from '../../AuthContext';

it('renders empty state when there are no links', () => {
  // eslint-disable-next-line no-unused-vars
  const { getByText } = render(
    <AuthProvider>
      <Dashboard />
    </AuthProvider>
  );
  expect(screen.getByText('...')).toBeInTheDocument();
});