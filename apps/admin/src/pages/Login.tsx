import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { toast } from '../components/ui';

function GoogleG() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M23.5 12.3c0-.9-.1-1.5-.3-2.2H12v4.3h6.5c-.1 1.1-.8 2.7-2.4 3.8l-.1.1 3.5 2.7.2.1c2.2-2 3.6-5 3.6-8.8z" />
      <path fill="#34A853" d="M12 24c3.2 0 6-1.1 7.9-2.9l-3.8-2.9c-1 .7-2.4 1.2-4.1 1.2-3.2 0-5.9-2.1-6.8-5l-.1.1-3.7 2.9v.1C3.3 21.3 7.3 24 12 24z" />
      <path fill="#FBBC05" d="M5.2 14.4c-.2-.7-.4-1.5-.4-2.4s.1-1.7.4-2.4l-.1-.1-3.6-2.8-.1.1C.5 8.5 0 10.1 0 12s.5 3.5 1.4 5.1l3.8-2.7z" />
      <path fill="#EA4335" d="M12 4.7c1.8 0 3 .8 3.7 1.4l3.3-3.2C17.9 1.1 15.2 0 12 0 7.3 0 3.3 2.7 1.4 6.9l3.8 2.9c.9-2.9 3.6-5.1 6.8-5.1z" />
    </svg>
  );
}

const UserIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5" />
  </svg>
);
const LockIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
    <rect x="4.5" y="10" width="15" height="10" rx="2.5" />
    <path d="M8 10V7a4 4 0 018 0v3" />
    <circle cx="12" cy="15" r="1.4" fill="currentColor" stroke="none" />
  </svg>
);
const EyeIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
    <path d="M2 12s3.5-6.5 10-6.5S22 12 22 12s-3.5 6.5-10 6.5S2 12 2 12z" />
    <circle cx="12" cy="12" r="2.6" />
  </svg>
);
const EyeOffIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
    <path d="M3 3l18 18M10.5 5.9A9.8 9.8 0 0112 5.5c6.5 0 10 6.5 10 6.5a17 17 0 01-3.2 3.9M6.6 6.6A16 16 0 002 12s3.5 6.5 10 6.5c1.4 0 2.7-.3 3.9-.8" />
  </svg>
);

export default function Login() {
  const [email, setEmail] = useState(() => localStorage.getItem('hvac-admin-email') || '');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [showPw, setShowPw] = useState(false);
  const [busy, setBusy] = useState(false);
  const nav = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      toast('Nhập email và mật khẩu');
      return;
    }
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setBusy(false);
    if (error) {
      toast('Đăng nhập thất bại: ' + error.message);
    } else {
      if (remember) localStorage.setItem('hvac-admin-email', email.trim());
      else localStorage.removeItem('hvac-admin-email');
      toast('Đăng nhập thành công');
      nav('/');
    }
  };

  const googleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    });
    if (error) toast('Lỗi: ' + error.message);
  };

  const forgot = () => nav('/forgot-password');

  return (
    <div className="login-page">
      <div className="blob b1" />
      <div className="blob b2" />
      <div className="blob b3" />
      <div className="login-card">
        <div className="login-tile">
          <img src="/logo.svg" alt="HVAC Hub" />
        </div>
        <h1>Chào mừng trở lại</h1>
        <p className="login-sub">Đăng nhập để tiếp tục</p>

        <form onSubmit={submit}>
          <div className="login-field">
            <span className="lf-icon">{UserIcon}</span>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
            />
          </div>
          <div className="login-field">
            <span className="lf-icon">{LockIcon}</span>
            <input
              type={showPw ? 'text' : 'password'}
              placeholder="Mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
            <button type="button" className="lf-eye" onClick={() => setShowPw(!showPw)} aria-label="Hiện mật khẩu">
              {showPw ? EyeOffIcon : EyeIcon}
            </button>
          </div>

          <div className="login-row">
            <label className="remember">
              <span className={`cbox${remember ? ' on' : ''}`} onClick={() => setRemember(!remember)}>
                {remember && (
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={3.4}>
                    <path d="M4 12.5l5 5L20 6.5" />
                  </svg>
                )}
              </span>
              Ghi nhớ tôi
            </label>
            <button type="button" className="forgot" onClick={forgot}>
              Quên mật khẩu?
            </button>
          </div>

          <button type="submit" className="login-btn" disabled={busy}>
            <span>{busy ? 'Đang đăng nhập…' : 'Đăng nhập'}</span>
            <span className="login-arrow">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2.4}>
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </span>
          </button>
        </form>

        <div className="login-divider">
          <span>HOẶC TIẾP TỤC VỚI</span>
        </div>
        <div className="social-row">
          <button type="button" className="social-btn" onClick={googleLogin} title="Đăng nhập với Google">
            <GoogleG />
          </button>
        </div>
        <p className="login-foot">HVAC Hub · Admin CMS</p>
      </div>
    </div>
  );
}
