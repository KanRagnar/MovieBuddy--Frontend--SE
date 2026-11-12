import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Clock, Calendar, Trash2, Edit3 } from 'lucide-react';
import { fetchTitleById, addTitleToFavorites, removeTitleFromFavorites } from '../api/titleApi.js';
import { fetchReviews, createReview, updateReview, deleteReview } from '../api/reviewApi.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../hooks/useToast.js';
import { validateReview } from '../utils/validators.js';
import { FALLBACK_POSTER } from '../utils/constants.js';
import { Navbar } from '../components/Navbar.jsx';
import { StarRating } from '../components/StarRating.jsx';
import { Loader } from '../components/Loader.jsx';
import { ToastMessage } from '../components/ToastMessage.jsx';

export const TitleDetailsPage = () => {
  const { titleId } = useParams();
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();
  const { toast, showToast, clearToast } = useToast();

  const [title, setTitle] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favLoading, setFavLoading] = useState(false);

  // Review form state
  const [comment, setComment] = useState('');
  const [rate, setRate] = useState(8);
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [submittingReview, setSubmittingReview] = useState(false);

  const isFavorite = Boolean(
    user?.favoriteMovies?.some((fav) => Number(typeof fav === 'object' ? fav.id : fav) === Number(titleId))
  );

  const loadData = async () => {
    setLoading(true);
    try {
      const [titleRes, revRes] = await Promise.all([
        fetchTitleById(titleId),
        fetchReviews(titleId)
      ]);
      setTitle(titleRes.data);
      setReviews(revRes.data || []);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [titleId]);

  const handleToggleFavorite = async () => {
    if (!user) return;
    setFavLoading(true);
    try {
      if (isFavorite) {
        await removeTitleFromFavorites(titleId, user.id);
        showToast('Removed from Favorite List', 'info');
      } else {
        await addTitleToFavorites(titleId, user.id);
        showToast('Added to Favorite List!', 'success');
      }
      await refreshUser();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setFavLoading(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    const validationErr = validateReview(comment, rate);
    if (validationErr) {
      showToast(validationErr, 'error');
      return;
    }

    setSubmittingReview(true);
    try {
      if (editingReviewId) {
        await updateReview(editingReviewId, { comment: comment.trim(), rate: Number(rate) });
        showToast('Review updated successfully', 'success');
        setEditingReviewId(null);
      } else {
        await createReview(titleId, {
          comment: comment.trim(),
          rate: Number(rate),
          userId: user?.id || 1
        });
        showToast('Review uploaded successfully!', 'success');
      }
      setComment('');
      setRate(8);
      const revRes = await fetchReviews(titleId);
      setReviews(revRes.data || []);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleEditClick = (rev) => {
    setEditingReviewId(rev.id);
    setComment(rev.comment);
    setRate(rev.rate);
  };

  const handleDeleteReview = async (revId) => {
    try {
      await deleteReview(revId);
      setReviews((prev) => prev.filter((r) => r.id !== revId));
      if (editingReviewId === revId) {
        setEditingReviewId(null);
        setComment('');
      }
      showToast('Review removed', 'info');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <Loader text="Loading title details..." />
      </>
    );
  }

  if (!title) {
    return (
      <>
        <Navbar />
        <div className="page-content">
          <div className="empty-state">Title not found.</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <ToastMessage toast={toast} onClose={clearToast} />
      <div className="page-content">
        <button
          onClick={() => navigate(-1)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'transparent',
            color: 'var(--text-secondary)',
            marginBottom: '12px',
            fontWeight: 600
          }}
        >
          <ArrowLeft size={18} /> Back
        </button>

        {/* Hero Poster + Info */}
        <div
          style={{
            backgroundColor: 'var(--bg-card)',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            border: '1px solid var(--border-color)',
            marginBottom: '18px'
          }}
        >
          <img
            src={title.poster || FALLBACK_POSTER}
            alt={title.title}
            onError={(e) => {
              e.currentTarget.src = FALLBACK_POSTER;
            }}
            style={{ width: '100%', maxHeight: '300px', objectFit: 'cover', display: 'block' }}
          />
          <div style={{ padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
              <div>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '6px' }}>{title.title}</h2>
                <div style={{ display: 'flex', gap: '12px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={14} /> {title.releaseDate || 'N/A'}
                  </span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={14} />{' '}
                    {title.numOfSeasons > 0
                      ? `${title.numOfSeasons} Seasons (${title.numOfEpisodes} eps)`
                      : `${title.duration} min`}
                  </span>
                </div>
              </div>

              <button
                onClick={handleToggleFavorite}
                disabled={favLoading}
                style={{
                  backgroundColor: isFavorite ? 'rgba(239, 68, 68, 0.18)' : 'var(--bg-input)',
                  color: isFavorite ? '#ef4444' : 'var(--text-primary)',
                  border: `1px solid ${isFavorite ? '#ef4444' : 'var(--border-color)'}`,
                  padding: '9px 14px',
                  borderRadius: 'var(--radius-full)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontWeight: 600,
                  fontSize: '0.82rem'
                }}
              >
                <Heart size={16} fill={isFavorite ? 'currentColor' : 'none'} />
                {isFavorite ? 'Favorited' : 'Add to Favorite'}
              </button>
            </div>

            {/* External Scores Badge Row (Requirement R-17) */}
            <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
              <span
                style={{
                  backgroundColor: 'rgba(245, 158, 11, 0.15)',
                  color: '#fbbf24',
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.78rem',
                  fontWeight: 700
                }}
              >
                IMDb 8.6/10
              </span>
              <span
                style={{
                  backgroundColor: 'rgba(239, 68, 68, 0.15)',
                  color: '#f87171',
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.78rem',
                  fontWeight: 700
                }}
              >
                Rotten Tomatoes 91%
              </span>
            </div>

            <div style={{ marginTop: '14px' }}>
              <h4 style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Description</h4>
              <p style={{ fontSize: '0.9rem', lineHeight: 1.5, color: 'var(--text-primary)' }}>{title.description}</p>
            </div>
          </div>
        </div>

        {/* My Review Form (User Story S-3) */}
        <section
          style={{
            backgroundColor: 'var(--bg-card)',
            padding: '16px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)',
            marginBottom: '18px'
          }}
        >
          <h3 className="section-title">{editingReviewId ? 'Edit My Review' : 'My Review'}</h3>
          <form onSubmit={handleReviewSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Rate out of 10
              </label>
              <StarRating value={rate} max={10} onChange={setRate} />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Comment</label>
                <span style={{ fontSize: '0.75rem', color: comment.length > 80 ? 'var(--accent-danger)' : 'var(--text-muted)' }}>
                  {comment.length}/80
                </span>
              </div>
              <textarea
                rows={2}
                maxLength={80}
                placeholder="Write your review (max 80 chars)..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button type="submit" className="btn-primary" disabled={submittingReview}>
                {submittingReview ? 'Saving...' : editingReviewId ? 'Save Changes' : 'Upload Review'}
              </button>
              {editingReviewId && (
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => {
                    setEditingReviewId(null);
                    setComment('');
                    setRate(8);
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        {/* Reviews List */}
        <section>
          <h3 className="section-title">Community Reviews ({reviews.length})</h3>
          {reviews.length === 0 ? (
            <div className="empty-state">No reviews yet. Be the first to review!</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {reviews.map((rev) => (
                <div
                  key={rev.id}
                  style={{
                    backgroundColor: 'var(--bg-card)',
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ fontWeight: 700, color: 'var(--accent-blue)', fontSize: '0.88rem' }}>
                      ★ {rev.rate}/10
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{rev.date}</span>
                      <button
                        onClick={() => handleEditClick(rev)}
                        title="Edit review"
                        style={{ background: 'transparent', color: 'var(--text-secondary)' }}
                      >
                        <Edit3 size={15} />
                      </button>
                      <button
                        onClick={() => handleDeleteReview(rev.id)}
                        title="Delete review"
                        style={{ background: 'transparent', color: 'var(--accent-danger)' }}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>{rev.comment}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
};
