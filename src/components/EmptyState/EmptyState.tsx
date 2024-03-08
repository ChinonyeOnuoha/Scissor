//EmptyState.tsx
import React from 'react';
import './emptyState.css';

const EmptyState = () => {
  return (
    <div className="empty-state">
      <img src="/assets/empty state image.svg" alt="No links" className="empty-state-image" />
      <h2 className="empty-state-title">No links found</h2>
      <p className="empty-state-subtext">You haven't created any active links yet</p>
    </div>
  );
};

export default EmptyState;

