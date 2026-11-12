import React from 'react';

export const ToastMessage = ({ toast, onClose }) => {
  if (!toast) return null;

  const bgColors = {
    success: '#166534',
    error: '#991b1b',
    info: '#1e3a8a'
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        top: '16px',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: bgColors[toast.type] || bgColors.info,
        color: '#ffffff',
        padding: '10px 18px',
        borderRadius: 'var(--radius-full)',
        fontSize: '0.88rem',
        fontWeight: 600,
        boxShadow: '0 6px 20px rgba(0,0,0,0.5)',
        zIndex: 100,
        cursor: 'pointer',
        maxWidth: '90%'
      }}
    >
      {toast.message}
    </div>
  );
};
