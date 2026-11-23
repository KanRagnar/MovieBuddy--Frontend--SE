import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star } from 'lucide-react';
import { FALLBACK_POSTER } from '../utils/constants.js';

export const TitleCard = ({ title }) => {
  const navigate = useNavigate();
  const hasImdbRating = Number.isFinite(title.imdbRating);
  const imdbRating = hasImdbRating ? title.imdbRating.toFixed(1) : 'N/A';
  const releaseYear = title.releaseDate ? title.releaseDate.slice(0, 4) : 'N/A';

  return (
    <div
      className="title-card"
      role="link"
      tabIndex={0}
      aria-label={`View details for ${title.title}`}
      onClick={() => navigate(`/title/${title.id}`)}
      onKeyDown={(event) => {
        if (event.key === 'Enter') {
          navigate(`/title/${title.id}`);
        }
      }}
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
        <div className="title-card-preview" role="tooltip">
          <h4>{title.title}</h4>
          <div className="title-card-preview-meta">
            <span>{title.genre || 'Movie'}</span>
            <span>{releaseYear}</span>
            <span>
              <Star size={12} fill="currentColor" aria-hidden="true" />
              {imdbRating}
            </span>
          </div>
          <p>{title.description || 'No description available.'}</p>
        </div>
      </div>
      <div
        style={{
          padding: '10px',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          gap: '8px'
        }}
      >
        <div style={{ minWidth: 0 }}>
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
            {releaseYear}
            {title.numOfSeasons > 0 ? ` • ${title.numOfSeasons} Seasons` : title.duration ? ` • ${title.duration}m` : ''}
          </p>
        </div>
        <span
          aria-label={hasImdbRating ? `IMDb rating ${imdbRating} out of 10` : 'IMDb rating unavailable'}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            flexShrink: 0,
            backgroundColor: 'rgba(13, 15, 18, 0.65)',
            color: '#fbbf24',
            fontSize: '0.7rem',
            fontWeight: 700,
            padding: '3px 8px',
            borderRadius: 'var(--radius-full)'
          }}
        >
          <Star size={12} fill="currentColor" aria-hidden="true" />
          {imdbRating}
        </span>
      </div>
    </div>
  );
};
