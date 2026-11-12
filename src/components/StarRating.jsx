import React from 'react';
import { Star } from 'lucide-react';

export const StarRating = ({ value = 0, max = 10, onChange }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap' }}>
      {Array.from({ length: max }, (_, idx) => {
        const starVal = idx + 1;
        const active = starVal <= Number(value);
        return (
          <button
            key={starVal}
            type="button"
            onClick={() => onChange && onChange(starVal)}
            style={{
              background: 'transparent',
              padding: '2px',
              color: active ? 'var(--accent-blue)' : 'var(--text-muted)',
              cursor: onChange ? 'pointer' : 'default'
            }}
            title={`${starVal}/${max}`}
          >
            <Star size={18} fill={active ? 'currentColor' : 'none'} />
          </button>
        );
      })}
      <span style={{ marginLeft: '6px', fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-blue)' }}>
        {value}/{max}
      </span>
    </div>
  );
};
