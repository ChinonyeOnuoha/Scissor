// Dashboard.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import Dashboard from './Dashboard';
import { AuthProvider } from '../../AuthContext';

describe('Dashboard', () => {
  it('renders empty state when there are no links', async () => {
    render(
      <AuthProvider>
        <Dashboard />
      </AuthProvider>
    );
    
    const message = await screen.findByText('No links found');
    expect(message).toBeInTheDocument();
  });
});
