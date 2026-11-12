import React, { useState, useEffect } from 'react';
import { X, Heart, MapPin, Briefcase, Film, RotateCcw } from 'lucide-react';
import { fetchAllUsers, swipeUser } from '../api/userApi.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../hooks/useToast.js';
import { FALLBACK_AVATAR, FALLBACK_POSTER } from '../utils/constants.js';
import { Navbar } from '../components/Navbar.jsx';
import { Loader } from '../components/Loader.jsx';
import { ToastMessage } from '../components/ToastMessage.jsx';

export const SwipePage = () => {
  const { user, refreshUser } = useAuth();
  const { toast, showToast, clearToast } = useToast();

  const [candidates, setCandidates] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showMoviesGrid, setShowMoviesGrid] = useState(false);
  const [loading, setLoading] = useState(true);
  const [swiping, setSwiping] = useState(false);

  const loadCandidates = async () => {
    setLoading(true);
    try {
      const res = await fetchAllUsers();
      const others = (res.data || []).filter(
        (u) => u.id !== user?.id && u.isVisible !== false
      );
      setCandidates(others);
      setCurrentIndex(0);
      setShowMoviesGrid(false);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCandidates();
  }, [user?.id]);

  const currentProfile = candidates[currentIndex];

  const handleSwipe = async (direction) => {
    if (!currentProfile || !user || swiping) return;
    setSwiping(true);
    try {
      const res = await swipeUser(user.id, currentProfile.id, direction);
      if (res.data?.matched) {
        showToast(`It's a Match with ${currentProfile.name}! You can now chat.`, 'success');
        await refreshUser();
      } else if (direction === 'right') {
        showToast(`Liked ${currentProfile.name}`, 'info');
      }
      setShowMoviesGrid(false);
      setCurrentIndex((prev) => prev + 1);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSwiping(false);
    }
  };

  return (
    <>
      <Navbar />
      <ToastMessage toast={toast} onClose={clearToast} />
      <div className="page-content" style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ textAlign: 'center', marginBottom: '12px' }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)' }}>Watch With..</h2>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            Tap card to toggle photo & favorite movies (GPS Active • 5 km)
          </p>
        </div>

        {loading ? (
          <Loader text="Finding nearby movie buddies..." />
        ) : !currentProfile ? (
          <div className="empty-state" style={{ marginTop: '24px' }}>
            <p style={{ fontWeight: 700, marginBottom: '8px' }}>No more profiles right now</p>
            <p style={{ fontSize: '0.85rem', marginBottom: '16px' }}>
              You have seen all available movie buddies nearby.
            </p>
            <button className="btn-primary" onClick={loadCandidates} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <RotateCcw size={16} /> Reload Profiles
            </button>
          </div>
        ) : (
          <div
            style={{
              backgroundColor: 'var(--bg-card)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-color)',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-card)',
              flex: 1,
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {/* Card Media Area: Toggle between Photo & Favorite Movies Grid per Mockup */}
            <div
              onClick={() => setShowMoviesGrid((prev) => !prev)}
              style={{
                position: 'relative',
                height: '330px',
                backgroundColor: '#11141a',
                cursor: 'pointer'
              }}
            >
              {!showMoviesGrid ? (
                <img
                  src={currentProfile.images?.[0] || FALLBACK_AVATAR}
                  alt={currentProfile.name}
                  onError={(e) => {
                    e.currentTarget.src = FALLBACK_AVATAR;
                  }}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              ) : (
                <div style={{ padding: '14px', height: '100%', overflowY: 'auto' }}>
                  <p style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-blue)', marginBottom: '10px' }}>
                    {currentProfile.name}'s Favorite Titles
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                    {(currentProfile.favoriteMovies || []).length > 0 ? (
                      currentProfile.favoriteMovies.map((fav, i) => (
                        <div
                          key={fav.id || i}
                          style={{
                            backgroundColor: 'var(--bg-secondary)',
                            borderRadius: 'var(--radius-sm)',
                            overflow: 'hidden',
                            border: '1px solid var(--border-color)'
                          }}
                        >
                          <img
                            src={fav.poster || FALLBACK_POSTER}
                            alt={fav.title}
                            style={{ width: '100%', height: '105px', objectFit: 'cover' }}
                          />
                          <p style={{ padding: '6px', fontSize: '0.78rem', fontWeight: 600 }}>{fav.title}</p>
                        </div>
                      ))
                    ) : (
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>No favorite titles listed yet.</p>
                    )}
                  </div>
                </div>
              )}

              {/* Indicator pills */}
              <div
                style={{
                  position: 'absolute',
                  top: '10px',
                  left: '12px',
                  right: '12px',
                  display: 'flex',
                  gap: '6px'
                }}
              >
                <div
                  style={{
                    flex: 1,
                    height: '4px',
                    borderRadius: '4px',
                    backgroundColor: !showMoviesGrid ? 'var(--accent-blue)' : 'rgba(255,255,255,0.3)'
                  }}
                />
                <div
                  style={{
                    flex: 1,
                    height: '4px',
                    borderRadius: '4px',
                    backgroundColor: showMoviesGrid ? 'var(--accent-blue)' : 'rgba(255,255,255,0.3)'
                  }}
                />
              </div>
            </div>

            {/* Profile Info */}
            <div style={{ padding: '16px', flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px' }}>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>
                  {currentProfile.name}, <span style={{ fontWeight: 400 }}>{currentProfile.age}</span>
                </h3>
                <span style={{ fontSize: '0.78rem', color: 'var(--accent-blue)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <MapPin size={14} /> 5 km
                </span>
              </div>

              {currentProfile.job && (
                <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                  <Briefcase size={14} /> {currentProfile.job} {currentProfile.madeIn ? `• ${currentProfile.madeIn}` : ''}
                </p>
              )}

              {currentProfile.into && (
                <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Film size={14} /> Into: {currentProfile.into}
                </p>
              )}
            </div>

            {/* Swipe Action Buttons */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '28px',
                padding: '14px 16px 18px',
                borderTop: '1px solid var(--border-color)'
              }}
            >
              <button
                onClick={() => handleSwipe('left')}
                disabled={swiping}
                aria-label="Skip profile"
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(239, 68, 68, 0.14)',
                  color: 'var(--accent-danger)',
                  border: '1px solid rgba(239, 68, 68, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <X size={28} />
              </button>

              <button
                onClick={() => handleSwipe('right')}
                disabled={swiping}
                aria-label="Like profile"
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(30, 144, 255, 0.18)',
                  color: 'var(--accent-blue)',
                  border: '1px solid rgba(30, 144, 255, 0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Heart size={26} fill="currentColor" />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
