import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { toast } from '../components/ui';

const LockIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
    <rect x="4.5" y="10" width="15" height="10" rx="2.5" />
    <path d="M8 10V7a4 4 0 018 0v3" />
    <circle cx="12" cy="15" r="1.4" fill="currentColor" stroke="none" />
  </svg>
);

export default function ResetPassword() {
  const [ready, setReady] = useState(false);
  const [valid, setValid] = useState(false);
  const [pw1, setPw1] = useState('');
  const [pw2, setPw2] = useState('');
  const [busy, setBusy] = useState(false);
  const nav = useNavigate();

  // Supabase tự đổi token recovery trên URL thành session khi khởi tạo client
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setValid(!!data.session);
      setReady(true);
    });
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pw1.length < 6) {
      toast('Mật khẩu tối thiểu 6 ký tự');
      return;
    }
    if (pw1 !== pw2) {
      toast('Mật khẩu nhập lại chưa khớp');
      return;
    }
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password: pw1 });
    setBusy(false);
    if (error) toast('Lỗi: ' + error.message);
    else {
      toast('Đặt lại mật khẩu thành công');
      await supabase.auth.signOut();
      nav('/login');
    }
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
        {!ready ? (
          <div className="spinner" />
        ) : !valid ? (
          <>
            <h1>Link không hợp lệ</h1>
            <p className="login-sub" style={{ letterSpacing: 1, lineHeight: 1.8 }}>
              Link đặt lại đã hết hạn hoặc
              <br />
              đã được sử dụng.
            </p>
            <Link to="/forgot-password" className="forgot" style={{ fontSize: 14 }}>
              Gửi lại link mới →
            </Link>
          </>
        ) : (
          <>
            <h1>Mật khẩu mới</h1>
            <p className="login-sub" style={{ letterSpacing: 1 }}>
              Nhập mật khẩu mới cho tài khoản
            </p>
            <form onSubmit={submit}>
              <div className="login-field">
                <span className="lf-icon">{LockIcon}</span>
                <input
                  type="password"
                  placeholder="Mật khẩu mới (tối thiểu 6 ký tự)"
                  value={pw1}
                  onChange={(e) => setPw1(e.target.value)}
                  autoComplete="new-password"
                />
              </div>
              <div className="login-field">
                <span className="lf-icon">{LockIcon}</span>
                <input
                  type="password"
                  placeholder="Nhập lại mật khẩu mới"
                  value={pw2}
                  onChange={(e) => setPw2(e.target.value)}
                  autoComplete="new-password"
                />
              </div>
              <button type="submit" className="login-btn" disabled={busy}>
                <span>{busy ? 'Đang lưu…' : 'Đặt lại mật khẩu'}</span>
                <span className="login-arrow">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2.4}>
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </span>
              </button>
            </form>
          </>
        )}
        <p className="login-foot">HVAC Hub · Admin CMS</p>
      </div>
    </div>
  );
}
