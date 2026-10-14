import { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { toast } from '../components/ui';

const MailIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
    <rect x="3" y="5" width="18" height="14" rx="2.5" />
    <path d="M3.5 7l8.5 6 8.5-6" />
  </svg>
);
const CheckIcon = (
  <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth={2.4}>
    <circle cx="12" cy="12" r="10" strokeOpacity={0.25} />
    <path d="M7 12.5l3.5 3.5L17 9.5" />
  </svg>
);

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast('Nhập email của bạn');
      return;
    }
    setBusy(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setBusy(false);
    if (error) toast('Lỗi: ' + error.message);
    else setSent(true);
  };

  return (
    <div className="login-page">
      <div className="blob b1" />
      <div className="blob b2" />
      <div className="blob b3" />
      <div className="login-card">
        <div className="login-tile">
          <img src="/logo.svg" alt="HVAC Hub" />
        </div>
        {sent ? (
          <>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>{CheckIcon}</div>
            <h1>Đã gửi email</h1>
            <p className="login-sub" style={{ letterSpacing: 1, lineHeight: 1.8 }}>
              Link đặt lại mật khẩu đã được gửi tới
              <br />
              <b style={{ color: 'var(--ink)' }}>{email}</b>
              <br />
              Kiểm tra hộp thư (kể cả mục spam).
            </p>
            <Link to="/login" className="forgot" style={{ fontSize: 14 }}>
              ← Quay lại đăng nhập
            </Link>
          </>
        ) : (
          <>
            <h1>Quên mật khẩu</h1>
            <p className="login-sub" style={{ letterSpacing: 1, lineHeight: 1.8 }}>
              Nhập email để nhận link
              <br />
              đặt lại mật khẩu
            </p>
            <form onSubmit={submit}>
              <div className="login-field">
                <span className="lf-icon">{MailIcon}</span>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>
              <button type="submit" className="login-btn" disabled={busy}>
                <span>{busy ? 'Đang gửi…' : 'Gửi link đặt lại'}</span>
                <span className="login-arrow">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2.4}>
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </span>
              </button>
            </form>
            <div style={{ marginTop: 22 }}>
              <Link to="/login" className="forgot" style={{ fontSize: 14 }}>
                ← Quay lại đăng nhập
              </Link>
            </div>
          </>
        )}
        <p className="login-foot">HVAC Hub · Admin CMS</p>
      </div>
    </div>
  );
}
