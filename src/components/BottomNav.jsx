import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Heart, User, MessageSquare } from 'lucide-react';

export const BottomNav = () => {
  const navItems = [
    { to: '/', icon: Home, label: 'Discover' },
    { to: '/swipe', icon: Heart, label: 'Watch With' },
    { to: '/profile', icon: User, label: 'Profile' },
    { to: '/messages', icon: MessageSquare, label: 'Messages' }
  ];

  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        width: '100%',
        maxWidth: 'var(--max-app-width)',
        backgroundColor: 'var(--bg-secondary)',
        borderTop: '1px solid var(--border-color)',
        display: 'flex',
        justifyContent: 'space-around',
        padding: '10px 0',
        zIndex: 30
      }}
    >
      {navItems.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          style={({ isActive }) => ({
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
            textDecoration: 'none',
            fontSize: '0.72rem',
            fontWeight: isActive ? 700 : 500,
            color: isActive ? 'var(--accent-blue)' : 'var(--text-secondary)'
          })}
        >
          <Icon size={21} />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
};
