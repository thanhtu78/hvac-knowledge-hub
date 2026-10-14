import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Btn, Field, TextInput, toast } from '../components/ui';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const nav = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { toast('Nhập email và mật khẩu'); return; }
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) toast('Đăng nhập thất bại: ' + error.message);
    else { toast('Đăng nhập thành công'); nav('/'); }
  };

  return (
    <div className="setup">
      <div className="neu setup-card" style={{ width: 400 }}>
        <div className="logo" style={{ paddingBottom: 12 }}>
          <span className="logo-mark">H</span>
          <span><b>HVAC Hub</b><small>Admin CMS</small></span>
        </div>
        <h1 style={{ fontSize: 19, margin: '0 0 6px' }}>Đăng nhập quản trị</h1>
        <p style={{ marginTop: 0 }}>Dùng tài khoản admin đã tạo trong Supabase Authentication.</p>
        <form onSubmit={submit}>
          <Field label="Email"><TextInput type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@hvachub.vn" /></Field>
          <Field label="Mật khẩu"><TextInput type="password" value={password} onChange={(e) => setPassword(e.target.value)} /></Field>
          <Btn type="submit" disabled={busy} style={{ width: '100%' }}>{busy ? 'Đang đăng nhập…' : 'Đăng nhập'}</Btn>
        </form>
      </div>
    </div>
  );
}
