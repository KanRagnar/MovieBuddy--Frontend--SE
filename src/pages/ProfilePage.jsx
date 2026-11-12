import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit2, LogOut, Trash2, Eye, EyeOff } from 'lucide-react';
import { updateUserProfile } from '../api/userApi.js';
import { removeTitleFromFavorites } from '../api/titleApi.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../hooks/useToast.js';
import { validateProfile } from '../utils/validators.js';
import { FALLBACK_AVATAR, FALLBACK_POSTER } from '../utils/constants.js';
import { Navbar } from '../components/Navbar.jsx';
import { ToastMessage } from '../components/ToastMessage.jsx';

export const ProfilePage = () => {
  const { user, logout, updateLocalUser, refreshUser } = useAuth();
  const { toast, showToast, clearToast } = useToast();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    age: 25,
    madeIn: '',
    job: '',
    sex: '',
    into: '',
    education: '',
    isVisible: true
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        age: user.age || 25,
        madeIn: user.madeIn || '',
        job: user.job || '',
        sex: user.sex || '',
        into: user.into || '',
        education: user.education || '',
        isVisible: user.isVisible !== false
      });
    }
  }, [user]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    const errMsg = validateProfile(formData);
    if (errMsg) {
      showToast(errMsg, 'error');
      return;
    }

    setSaving(true);
    try {
      const res = await updateUserProfile(user.id, {
        ...formData,
        age: Number(formData.age)
      });
      updateLocalUser(res.data);
      setIsEditing(false);
      showToast('Profile changed successfully', 'success');
    } catch (err) {
      showToast(err.message || 'Sorry! Something went wrong, try again!', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveFavorite = async (titleId) => {
    try {
      await removeTitleFromFavorites(titleId, user.id);
      await refreshUser();
      showToast('Title removed from Favorite List', 'info');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <>
      <Navbar />
      <ToastMessage toast={toast} onClose={clearToast} />
      <div className="page-content">
        {/* Profile Header Card */}
        <div
          style={{
            backgroundColor: 'var(--bg-card)',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            border: '1px solid var(--border-color)',
            marginBottom: '18px'
          }}
        >
          <div style={{ position: 'relative', height: '190px', backgroundColor: '#12151c' }}>
            <img
              src={user.images?.[0] || FALLBACK_AVATAR}
              alt={user.name}
              onError={(e) => {
                e.currentTarget.src = FALLBACK_AVATAR;
              }}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <button
              onClick={handleLogout}
              title="Log Out"
              style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                backgroundColor: 'rgba(13, 15, 18, 0.82)',
                color: '#fca5a5',
                padding: '8px 12px',
                borderRadius: 'var(--radius-full)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.8rem',
                fontWeight: 600
              }}
            >
              <LogOut size={15} /> Log Out
            </button>
          </div>

          <div style={{ padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <div>
                <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>
                  {user.name} <span style={{ fontWeight: 400, color: 'var(--text-secondary)' }}>{user.age}</span>
                </h2>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>@{user.userId}</p>
              </div>
              <button
                onClick={() => setIsEditing((prev) => !prev)}
                className="btn-secondary"
                style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem' }}
              >
                <Edit2 size={14} /> {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>

            {/* Favorite List Grid */}
            <div style={{ marginTop: '14px', marginBottom: '16px' }}>
              <h4 style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Favorite List ({user.favoriteMovies?.length || 0})
              </h4>
              {user.favoriteMovies?.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                  {user.favoriteMovies.map((movie) => (
                    <div key={movie.id} style={{ position: 'relative' }}>
                      <img
                        src={movie.poster || FALLBACK_POSTER}
                        alt={movie.title}
                        onClick={() => navigate(`/title/${movie.id}`)}
                        style={{
                          width: '100%',
                          aspectRatio: '2/3',
                          objectFit: 'cover',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          display: 'block'
                        }}
                      />
                      <button
                        onClick={() => handleRemoveFavorite(movie.id)}
                        title="Remove from favorites"
                        style={{
                          position: 'absolute',
                          top: '4px',
                          right: '4px',
                          backgroundColor: 'rgba(0,0,0,0.75)',
                          color: '#ef4444',
                          borderRadius: '50%',
                          width: '22px',
                          height: '22px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                  No favorite movies yet. Browse titles and tap "Add to Favorite".
                </p>
              )}
            </div>

            {/* Profile Details or Edit Form */}
            {isEditing ? (
              <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Name</label>
                  <input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Age</label>
                    <input
                      type="number"
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Sex</label>
                    <input
                      value={formData.sex}
                      onChange={(e) => setFormData({ ...formData, sex: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Made in</label>
                  <input
                    value={formData.madeIn}
                    onChange={(e) => setFormData({ ...formData, madeIn: e.target.value })}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Job</label>
                  <input
                    value={formData.job}
                    onChange={(e) => setFormData({ ...formData, job: e.target.value })}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Into (Genres/Interests)</label>
                  <input
                    value={formData.into}
                    onChange={(e) => setFormData({ ...formData, into: e.target.value })}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Education</label>
                  <input
                    value={formData.education}
                    onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                  />
                </div>

                {/* Visibility Toggle (Requirement R-10) */}
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: 'var(--bg-input)',
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer'
                  }}
                >
                  <span style={{ fontSize: '0.88rem' }}>Show my profile in Swiping</span>
                  <input
                    type="checkbox"
                    checked={formData.isVisible}
                    onChange={(e) => setFormData({ ...formData, isVisible: e.target.checked })}
                    style={{ width: 'auto' }}
                  />
                </label>

                <button type="submit" className="btn-primary" disabled={saving} style={{ marginTop: '6px' }}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  { label: 'Made in', value: user.madeIn || 'Not specified' },
                  { label: 'Job', value: user.job || 'Not specified' },
                  { label: 'Into', value: user.into || 'Not specified' },
                  { label: 'Education', value: user.education || 'Not specified' },
                  { label: 'Sex', value: user.sex || 'Not specified' }
                ].map((field) => (
                  <div
                    key={field.label}
                    style={{
                      backgroundColor: 'var(--bg-input)',
                      padding: '10px 12px',
                      borderRadius: 'var(--radius-sm)'
                    }}
                  >
                    <span style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      {field.label}
                    </span>
                    <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{field.value}</span>
                  </div>
                ))}

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '0.82rem',
                    color: user.isVisible !== false ? 'var(--accent-success)' : 'var(--text-muted)',
                    marginTop: '4px'
                  }}
                >
                  {user.isVisible !== false ? <Eye size={16} /> : <EyeOff size={16} />}
                  <span>
                    {user.isVisible !== false ? 'Profile visible to other users' : 'Profile hidden from swiping'}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
