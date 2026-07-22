import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { capture } from "@/lib/posthog";

const DISMISSED_KEY = 'sipiteno_exit_intent_dismissed';

export default function ExitIntentOverlay() {
  const { t, i18n } = useTranslation();
  const [visible, setVisible] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [dismissed, setDismissed] = useState(() => localStorage.getItem(DISMISSED_KEY) === 'true');
  const mountedRef = useRef(true);

  useEffect(() => () => { mountedRef.current = false; }, []);

  const show = useCallback(() => {
    if (!dismissed && !success && mountedRef.current) {
      setVisible(true);
    }
  }, [dismissed, success]);

  useEffect(() => {
    // don't bind until 5s after mount (avoids false positives)
    const timer = setTimeout(() => {
      if (dismissed || success) return;
      const handler = (e: MouseEvent) => {
        if (e.clientY <= 10) show();
      };
      document.addEventListener('mouseleave', handler);
      return () => document.removeEventListener('mouseleave', handler);
    }, 5000);
    return () => clearTimeout(timer);
  }, [dismissed, success, show]);

  const handleDismiss = useCallback(() => {
    localStorage.setItem(DISMISSED_KEY, 'true');
    setDismissed(true);
    setVisible(false);
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    setSending(true);
    setError('');

    try {
      const resp = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: name.trim(),
          email: email.trim(),
          message: `Exit intent download: Free Expansion Playbook`,
          service: 'Free Expansion Playbook (Exit Intent)',
          country: '',
          phone: '',
          hearAboutUs: '',
          companyName: '',
        }),
      });
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      capture('exit_intent_conversion', { lang: i18n.language });
      setSuccess(true);
      setDismissed(true);
      localStorage.setItem(DISMISSED_KEY, 'true');
      setTimeout(() => setVisible(false), 3000);
    } catch (err) {
      setError(t('exitIntent.error') || 'Something went wrong. Please try again.');
      capture('exit_intent_failed', { lang: i18n.language });
    } finally {
      setSending(false);
    }
  }, [name, email, t, i18n.language]);

  if (!visible) return null;

  return (
    <div
      style={{
        position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
        background: 'rgba(0,0,0,0.65)', display: 'flex', alignItems: 'center',
        justifyContent: 'center', zIndex: 9999, padding: '1rem',
      }}
      onClick={handleDismiss}
      role="dialog"
      aria-modal="true"
      aria-label={t('exitIntent.title')}
    >
      <div
        style={{
          background: '#0f1115', border: '1px solid #1e293b', borderRadius: '16px',
          maxWidth: '440px', width: '100%', padding: '2rem', position: 'relative',
          boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={handleDismiss}
          aria-label={t('exitIntent.close') || 'Close'}
          style={{
            position: 'absolute', top: '0.75rem', right: '1rem', background: 'none',
            border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '1.25rem',
            lineHeight: 1, padding: '0.25rem',
          }}
        >
          ✕
        </button>

        {success ? (
          <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
            <div style={{
              fontSize: '2.5rem', marginBottom: '0.75rem',
              background: '#1a2e1a', borderRadius: '50%', width: '56px', height: '56px',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            }}>
              ✅
            </div>
            <h3 style={{ color: '#e2e8f0', margin: '0 0 0.5rem', fontSize: '1.2rem' }}>
              {t('exitIntent.successTitle')}
            </h3>
            <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.9rem' }}>
              {t('exitIntent.successBody')}
            </p>
          </div>
        ) : (
          <>
            {/* Badge */}
            <div style={{
              display: 'inline-block', padding: '0.25rem 0.75rem',
              borderRadius: '9999px', background: '#1a2e1a', color: '#4ade80',
              fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.75rem',
              letterSpacing: '0.02em',
            }}>
              {t('exitIntent.badge')}
            </div>

            <h2 style={{
              color: '#f1f5f9', margin: '0 0 0.5rem', fontSize: '1.35rem',
              lineHeight: 1.3,
            }}>
              {t('exitIntent.title')}
            </h2>
            <p style={{
              color: '#94a3b8', margin: '0 0 1.25rem', fontSize: '0.9rem',
              lineHeight: 1.5,
            }}>
              {t('exitIntent.body')}
            </p>

            <form onSubmit={handleSubmit} noValidate>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <input
                  type="text"
                  placeholder={t('exitIntent.namePlaceholder')}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  aria-required="true"
                  style={{
                    width: '100%', padding: '0.75rem 1rem', borderRadius: '10px',
                    border: '1px solid #1e293b', background: '#0a0c10', color: '#e2e8f0',
                    fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box',
                  }}
                />
                <input
                  type="email"
                  placeholder={t('exitIntent.emailPlaceholder')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  aria-required="true"
                  style={{
                    width: '100%', padding: '0.75rem 1rem', borderRadius: '10px',
                    border: '1px solid #1e293b', background: '#0a0c10', color: '#e2e8f0',
                    fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box',
                  }}
                />
                <button
                  type="submit"
                  disabled={sending}
                  style={{
                    width: '100%', padding: '0.8rem 1rem', borderRadius: '10px',
                    border: 'none', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                    color: '#fff', fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer',
                    opacity: sending ? 0.7 : 1, marginTop: '0.25rem',
                  }}
                >
                  {sending ? (t('exitIntent.sending') || 'Sending...') : (t('exitIntent.submit') || 'Send Me The Playbook')}
                </button>
              </div>
            </form>

            {error && (
              <p style={{ color: '#f87171', margin: '0.75rem 0 0', fontSize: '0.8rem' }}>
                {error}
              </p>
            )}

            {/* Privacy note */}
            <p style={{
              color: '#64748b', margin: '0.75rem 0 0', fontSize: '0.7rem',
              textAlign: 'center',
            }}>
              {t('exitIntent.privacy')}
            </p>

            {/* No thanks link */}
            <div style={{ textAlign: 'center', marginTop: '0.75rem' }}>
              <button
                onClick={handleDismiss}
                style={{
                  background: 'none', border: 'none', color: '#64748b',
                  fontSize: '0.8rem', cursor: 'pointer', textDecoration: 'underline',
                  padding: '0.25rem',
                }}
              >
                {t('exitIntent.noThanks')}
              </button>
            </div>

            {/* Honeypot */}
            <div style={{ position: 'absolute', left: '-9999px' }} aria-hidden="true">
              <input type="text" name="website" tabIndex={-1} autoComplete="off" />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
