import React, { useState } from 'react';

type AuthPanelProps = {
  onLogin: (payload: { username: string; password: string }) => Promise<void>;
  onRegister: (payload: { username: string; password: string; email?: string }) => Promise<void>;
  loading?: boolean;
  error?: string | null;
};

export const AuthPanel: React.FC<AuthPanelProps> = ({ onLogin, onRegister, loading, error }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (mode === 'login') {
      await onLogin({ username, password });
    } else {
      await onRegister({ username, password, email });
    }
  };

  return (
    <div className="auth-panel">
      <h1>Pandimus Reborn</h1>
      <p>Log in or create an account to begin your adventure.</p>

      <div className="auth-toggle">
        <button
          type="button"
          className={mode === 'login' ? 'active' : ''}
          onClick={() => setMode('login')}
          disabled={loading}
        >
          Login
        </button>
        <button
          type="button"
          className={mode === 'register' ? 'active' : ''}
          onClick={() => setMode('register')}
          disabled={loading}
        >
          Register
        </button>
      </div>

      <form className="auth-form" onSubmit={handleSubmit}>
        <label>
          Username
          <input
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            disabled={loading}
            autoComplete="username"
            required
          />
        </label>
        {mode === 'register' && (
          <label>
            Email (optional)
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              disabled={loading}
              autoComplete="email"
            />
          </label>
        )}
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            disabled={loading}
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            required
          />
        </label>
        <button type="submit" disabled={loading}>
          {loading ? 'Please wait...' : mode === 'login' ? 'Login' : 'Register'}
        </button>
      </form>

      {error && <div className="auth-error">{error}</div>}
    </div>
  );
};
