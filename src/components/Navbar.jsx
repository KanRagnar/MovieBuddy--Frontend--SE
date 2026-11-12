import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Clapperboard, Search, MessageCircle } from 'lucide-react';

export const Navbar = ({ onToggleSearch }) => {
  const navigate = useNavigate();

  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 16px',
        backgroundColor: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border-color)',
        position: 'sticky',
        top: 0,
        zIndex: 20
      }}
    >
      <button
        onClick={() => {
          if (onToggleSearch) {
            onToggleSearch();
          } else {
            navigate('/');
          }
        }}
        aria-label="Search titles"
        style={{ background: 'transparent', color: 'var(--text-primary)', display: 'flex', alignItems: 'center' }}
      >
        <Search size={22} />
      </button>

      <Link
        to="/"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          textDecoration: 'none',
          color: 'var(--accent-blue)',
          fontWeight: 800,
          fontSize: '1.15rem',
          letterSpacing: '0.5px'
        }}
      >
        <Clapperboard size={24} />
        <span>MOVIE BUDDY</span>
      </Link>

      <Link
        to="/messages"
        aria-label="Messages"
        style={{ color: 'var(--accent-blue)', display: 'flex', alignItems: 'center', position: 'relative' }}
      >
        <MessageCircle size={23} fill="currentColor" />
      </Link>
    </header>
  );
};
