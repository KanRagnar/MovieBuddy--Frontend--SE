import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FALLBACK_POSTER } from '../utils/constants.js';

export const TitleCard = ({ title }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/title/${title.id}`)}
      style={{
        backgroundColor: 'var(--bg-card)',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        cursor: 'pointer',
        border: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s ease'
      }}
    >
      <div style={{ position: 'relative', aspectRatio: '2 / 3', width: '100%', backgroundColor: '#111' }}>
        <img
          src={title.poster || FALLBACK_POSTER}
          alt={title.title}
          onError={(e) => {
            e.currentTarget.src = FALLBACK_POSTER;
          }}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
        <span
          style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            backgroundColor: 'rgba(13, 15, 18, 0.85)',
            color: 'var(--accent-blue)',
            fontSize: '0.7rem',
            fontWeight: 700,
            padding: '3px 8px',
            borderRadius: 'var(--radius-full)'
          }}
        >
          {title.genre || 'Movie'}
        </span>
      </div>
      <div style={{ padding: '10px' }}>
        <h4
          style={{
            fontSize: '0.92rem',
            fontWeight: 600,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            marginBottom: '4px'
          }}
        >
          {title.title}
        </h4>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
          {title.releaseDate ? title.releaseDate.slice(0, 4) : 'N/A'}
          {title.numOfSeasons > 0 ? ` • ${title.numOfSeasons} Seasons` : title.duration ? ` • ${title.duration}m` : ''}
        </p>
      </div>
    </div>
  );
};
