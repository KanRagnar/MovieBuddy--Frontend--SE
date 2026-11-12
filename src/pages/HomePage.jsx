import React, { useState, useEffect } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { fetchTitles, searchTitles } from '../api/titleApi.js';
import { GENRES } from '../utils/constants.js';
import { Navbar } from '../components/Navbar.jsx';
import { TitleCard } from '../components/TitleCard.jsx';
import { Loader } from '../components/Loader.jsx';

export const HomePage = () => {
  const [titles, setTitles] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchBar, setShowSearchBar] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadTitles = async (genre = selectedGenre, query = searchQuery) => {
    setLoading(true);
    setError('');
    try {
      let res;
      if (query.trim()) {
        res = await searchTitles(query.trim(), genre);
      } else {
        res = await fetchTitles(genre);
      }
      setTitles(res.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTitles(selectedGenre, searchQuery);
  }, [selectedGenre]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadTitles(selectedGenre, searchQuery);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    loadTitles(selectedGenre, '');
  };

  const movies = titles.filter((t) => !t.numOfSeasons || t.numOfSeasons === 0);
  const series = titles.filter((t) => t.numOfSeasons && t.numOfSeasons > 0);

  return (
    <>
      <Navbar onToggleSearch={() => setShowSearchBar((prev) => !prev)} />
      <div className="page-content">
        {showSearchBar && (
          <form
            onSubmit={handleSearchSubmit}
            style={{ display: 'flex', gap: '8px', marginBottom: '14px', alignItems: 'center' }}
          >
            <div style={{ position: 'relative', flex: 1 }}>
              <input
                type="text"
                placeholder="Search movies, series, keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ paddingRight: '34px' }}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  style={{
                    position: 'absolute',
                    right: '8px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'transparent',
                    color: 'var(--text-secondary)'
                  }}
                >
                  <X size={16} />
                </button>
              )}
            </div>
            <button type="submit" className="btn-primary" style={{ padding: '10px 14px', borderRadius: 'var(--radius-sm)' }}>
              <Search size={18} />
            </button>
          </form>
        )}

        {/* Genre Filter Chips */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            overflowX: 'auto',
            paddingBottom: '10px',
            marginBottom: '14px'
          }}
        >
          <Filter size={16} style={{ color: 'var(--accent-blue)', flexShrink: 0 }} />
          {GENRES.map((genre) => {
            const active = selectedGenre === genre;
            return (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  backgroundColor: active ? 'var(--accent-blue)' : 'var(--bg-card)',
                  color: active ? '#ffffff' : 'var(--text-secondary)',
                  border: `1px solid ${active ? 'var(--accent-blue)' : 'var(--border-color)'}`
                }}
              >
                {genre}
              </button>
            );
          })}
        </div>

        {loading ? (
          <Loader text="Fetching titles from MovieBuddy..." />
        ) : error ? (
          <div className="empty-state">
            <p style={{ color: 'var(--accent-danger)', marginBottom: '10px' }}>{error}</p>
            <button className="btn-secondary" onClick={() => loadTitles()}>
              Try Again
            </button>
          </div>
        ) : titles.length === 0 ? (
          <div className="empty-state">
            <p style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '6px' }}>Sorry! Nothing matches</p>
            <p style={{ fontSize: '0.85rem' }}>Try another keyword or reset your category filter.</p>
          </div>
        ) : (
          <>
            {movies.length > 0 && (
              <section style={{ marginBottom: '22px' }}>
                <h3 className="section-title">Top Movies</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                  {movies.map((item) => (
                    <TitleCard key={item.id} title={item} />
                  ))}
                </div>
              </section>
            )}

            {series.length > 0 && (
              <section>
                <h3 className="section-title">Top Series</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                  {series.map((item) => (
                    <TitleCard key={item.id} title={item} />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </>
  );
};
