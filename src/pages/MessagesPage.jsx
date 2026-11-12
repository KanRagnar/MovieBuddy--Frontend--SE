import React, { useState, useEffect } from 'react';
import { Send, ArrowLeft, Trash2 } from 'lucide-react';
import { fetchAllUsers } from '../api/userApi.js';
import { fetchUserTexts, sendUserText, deleteTextMessage } from '../api/textApi.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../hooks/useToast.js';
import { FALLBACK_AVATAR } from '../utils/constants.js';
import { Navbar } from '../components/Navbar.jsx';
import { Loader } from '../components/Loader.jsx';
import { ToastMessage } from '../components/ToastMessage.jsx';

export const MessagesPage = () => {
  const { user } = useAuth();
  const { toast, showToast, clearToast } = useToast();

  const [buddies, setBuddies] = useState([]);
  const [messages, setMessages] = useState([]);
  const [activeBuddy, setActiveBuddy] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const loadChatData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [usersRes, textsRes] = await Promise.all([
        fetchAllUsers(),
        fetchUserTexts(user.userId)
      ]);
      const otherUsers = (usersRes.data || []).filter((u) => u.userId !== user.userId);
      setBuddies(otherUsers);
      setMessages(textsRes.data || []);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadChatData();
  }, [user?.userId]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeBuddy || sending) return;

    setSending(true);
    try {
      const res = await sendUserText(user.userId, activeBuddy.userId, newMessage.trim());
      setMessages((prev) => [...prev, res.data]);
      setNewMessage('');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSending(false);
    }
  };

  const handleDeleteMessage = async (textId) => {
    try {
      await deleteTextMessage(textId);
      setMessages((prev) => prev.filter((m) => m.id !== textId));
      showToast('Message deleted', 'info');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const conversationMessages = activeBuddy
    ? messages.filter(
        (m) =>
          (m.sender === user?.userId && m.receiver === activeBuddy.userId) ||
          (m.sender === activeBuddy.userId && m.receiver === user?.userId)
      )
    : [];

  return (
    <>
      <Navbar />
      <ToastMessage toast={toast} onClose={clearToast} />
      <div className="page-content" style={{ display: 'flex', flexDirection: 'column' }}>
        {loading ? (
          <Loader text="Loading conversations..." />
        ) : !activeBuddy ? (
          <>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, textAlign: 'center', marginBottom: '16px' }}>
              My Messages
            </h2>
            {buddies.length === 0 ? (
              <div className="empty-state">No matched buddies yet. Start swiping!</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {buddies.map((buddy) => {
                  const thread = messages.filter(
                    (m) => m.sender === buddy.userId || m.receiver === buddy.userId
                  );
                  const lastMsg = thread[thread.length - 1];

                  return (
                    <div
                      key={buddy.id}
                      onClick={() => setActiveBuddy(buddy)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '12px',
                        backgroundColor: 'var(--bg-card)',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-color)',
                        cursor: 'pointer'
                      }}
                    >
                      <img
                        src={buddy.images?.[0] || FALLBACK_AVATAR}
                        alt={buddy.name}
                        onError={(e) => {
                          e.currentTarget.src = FALLBACK_AVATAR;
                        }}
                        style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                          <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{buddy.name}</span>
                          {lastMsg && (
                            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{lastMsg.date}</span>
                          )}
                        </div>
                        <p
                          style={{
                            fontSize: '0.83rem',
                            color: 'var(--text-secondary)',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}
                        >
                          {lastMsg ? lastMsg.script : 'Tap to start chatting about movies!'}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        ) : (
          /* Active Chat Window per Mockup */
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                paddingBottom: '12px',
                borderBottom: '1px solid var(--border-color)',
                marginBottom: '12px'
              }}
            >
              <button
                onClick={() => setActiveBuddy(null)}
                style={{ background: 'transparent', color: 'var(--text-primary)' }}
              >
                <ArrowLeft size={20} />
              </button>
              <img
                src={activeBuddy.images?.[0] || FALLBACK_AVATAR}
                alt={activeBuddy.name}
                style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
              />
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>{activeBuddy.name}</h3>
                <span style={{ fontSize: '0.74rem', color: 'var(--accent-success)' }}>Online</span>
              </div>
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px', overflowY: 'auto', marginBottom: '12px' }}>
              {conversationMessages.length === 0 ? (
                <div className="empty-state">Say hello and suggest a movie to watch!</div>
              ) : (
                conversationMessages.map((msg) => {
                  const isMine = msg.sender === user?.userId;
                  return (
                    <div
                      key={msg.id}
                      style={{
                        alignSelf: isMine ? 'flex-end' : 'flex-start',
                        maxWidth: '78%',
                        backgroundColor: isMine ? 'var(--accent-blue)' : 'var(--bg-card)',
                        color: '#ffffff',
                        padding: '10px 14px',
                        borderRadius: '16px',
                        borderBottomRightRadius: isMine ? '4px' : '16px',
                        borderBottomLeftRadius: isMine ? '16px' : '4px',
                        position: 'relative'
                      }}
                    >
                      <p style={{ fontSize: '0.9rem', lineHeight: 1.4 }}>{msg.script}</p>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'flex-end',
                          alignItems: 'center',
                          gap: '6px',
                          marginTop: '4px'
                        }}
                      >
                        <span style={{ fontSize: '0.68rem', opacity: 0.75 }}>{msg.date}</span>
                        {isMine && (
                          <button
                            onClick={() => handleDeleteMessage(msg.id)}
                            title="Delete message"
                            style={{ background: 'transparent', color: '#ffffff', opacity: 0.75 }}
                          >
                            <Trash2 size={12} />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                placeholder="Send a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                style={{ borderRadius: 'var(--radius-full)' }}
              />
              <button
                type="submit"
                className="btn-primary"
                disabled={sending || !newMessage.trim()}
                style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <Send size={18} />
              </button>
            </form>
          </div>
        )}
      </div>
    </>
  );
};
