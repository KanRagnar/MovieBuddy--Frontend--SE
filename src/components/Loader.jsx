import React from 'react';

export const Loader = ({ text = 'Loading...' }) => (
  <div style={{ textAlign: 'center', padding: '40px 16px', color: 'var(--text-secondary)' }}>
    <div
      style={{
        width: '32px',
        height: '32px',
        border: '3px solid var(--border-color)',
        borderTopColor: 'var(--accent-blue)',
        borderRadius: '50%',
        margin: '0 auto 12px',
        animation: 'spin 0.8s linear infinite'
      }}
    />
    <p style={{ fontSize: '0.9rem' }}>{text}</p>
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);
