import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clapperboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export const LoginPage = () => {
  const { login, register, loading } = useAuth();
  const navigate = useNavigate();

  const [isSignUp, setIsSignUp] = useState(false);
  const [username, setUsername] = useState('sampleuser');
  const [password, setPassword] = useState('samplepassword');
  const [name, setName] = useState('');
  const [age, setAge] = useState(24);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isSignUp) {
        if (!name.trim()) {
          setError('Full name is required');
          return;
        }
        await register({
          userId: username.trim(),
          password,
          name: name.trim(),
          age: Number(age)
        });
      } else {
        await login(username.trim(), password);
      }
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        maxWidth: 'var(--max-app-width)',
        backgroundColor: 'var(--bg-primary)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '28px 24px',
        borderLeft: '1px solid var(--border-color)',
        borderRight: '1px solid var(--border-color)'
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: '36px' }}>
        <div
          style={{
            display: 'inline-flex',
            padding: '16px',
            borderRadius: '20px',
            backgroundColor: 'rgba(30, 144, 255, 0.12)',
            color: 'var(--accent-blue)',
            marginBottom: '14px'
          }}
        >
          <Clapperboard size={46} />
        </div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent-blue)', letterSpacing: '1.5px' }}>
          MOVIE BUDDY
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginTop: '6px' }}>
          Swipe, review & watch movies with people who share your taste
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '5px' }}>
            Username
          </label>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        {isSignUp && (
          <>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '5px' }}>
                Display Name
              </label>
              <input
                type="text"
                placeholder="e.g. Maria K."
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '5px' }}>
                Age (18+)
              </label>
              <input
                type="number"
                min={18}
                max={99}
                value={age}
                onChange={(e) => setAge(e.target.value)}
                required
              />
            </div>
          </>
        )}

        <div>
          <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '5px' }}>
            Password
          </label>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error && (
          <div
            style={{
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              color: '#fca5a5',
              padding: '10px 12px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.85rem'
            }}
          >
            {error}
          </div>
        )}

        <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: '8px' }}>
          {loading ? 'Please wait...' : isSignUp ? 'Create Account' : 'Log In'}
        </button>

        <button
          type="button"
          onClick={() => {
            setIsSignUp((prev) => !prev);
            setError('');
          }}
          style={{
            background: 'transparent',
            color: 'var(--accent-blue)',
            fontSize: '0.88rem',
            fontWeight: 600,
            marginTop: '4px'
          }}
        >
          {isSignUp ? 'Already have an account? Log In' : 'Sign Up'}
        </button>
      </form>
    </div>
  );
};
