import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const ICONS: Record<string, JSX.Element> = {
  dash: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <rect x="3" y="3" width="7" height="9" rx="1.5" />
      <rect x="14" y="3" width="7" height="5" rx="1.5" />
      <rect x="14" y="12" width="7" height="9" rx="1.5" />
      <rect x="3" y="16" width="7" height="5" rx="1.5" />
    </svg>
  ),
  arts: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M4 5h16v14H4z" />
      <path d="M8 9h8M8 13h8M8 17h5" />
    </svg>
  ),
  codes: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M12 3L2 20h20z" />
      <path d="M12 10v4M12 17.5v.5" />
    </svg>
  ),
  brands: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M4 7l8-4 8 4-8 4z" />
      <path d="M4 7v10l8 4 8-4V7" />
      <path d="M12 11v10" />
    </svg>
  ),
  checks: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M9 11l3 3 8-8" />
      <path d="M20 12v6a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h9" />
    </svg>
  ),
  users: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20c0-3.5 3-5.5 6.5-5.5s6.5 2 6.5 5.5" />
      <circle cx="17" cy="9" r="2.5" />
      <path d="M16 14.6c2.8.3 5 2 5 5.4" />
    </svg>
  ),
  bill: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <rect x="3" y="6" width="18" height="13" rx="2.5" />
      <path d="M3 10h18M7 15h4" />
    </svg>
  ),
  media: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <rect x="3" y="4" width="18" height="16" rx="2.5" />
      <circle cx="9" cy="10" r="1.8" />
      <path d="M4 18l5-5 3 3 4-4 4 4" />
    </svg>
  ),
  notif: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M18 9a6 6 0 10-12 0c0 6-2.5 7-2.5 7h17S18 15 18 9zM10 20a2 2 0 004 0" />
    </svg>
  ),
};

export const NAV = [
  { to: '/', label: 'Dashboard', icon: 'dash', end: true },
  { to: '/articles', label: 'Bài viết', icon: 'arts' },
  { to: '/error-codes', label: 'Mã lỗi', icon: 'codes' },
  { to: '/brands', label: 'Hãng & Model', icon: 'brands' },
  { to: '/checklists', label: 'Checklist', icon: 'checks' },
  { to: '/users', label: 'Người dùng', icon: 'users' },
  { to: '/billing', label: 'Gói & Thanh toán', icon: 'bill' },
  { to: '/media', label: 'Thư viện media', icon: 'media' },
  { to: '/notifications', label: 'Thông báo', icon: 'notif' },
];

export default function Layout() {
  const nav = useNavigate();
  const logout = async () => {
    await supabase.auth.signOut();
    nav('/login');
  };
  return (
    <div className="app">
      <aside className="sidebar">
        <div className="logo">
          <span className="logo-mark">H</span>
          <span>
            <b>HVAC Hub</b>
            <small>Admin CMS</small>
          </span>
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
          {NAV.map((n) => (
            <NavLink key={n.to} to={n.to} end={n.end} className={({ isActive }) => `navlink${isActive ? ' active' : ''}`}>
              {ICONS[n.icon]}
              <span>{n.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="side-foot">
          <div className="neu" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 10, borderRadius: 12 }}>
            <span className="logo-mark" style={{ width: 32, height: 32, fontSize: 13, borderRadius: 10 }}>A</span>
            <span style={{ flex: 1 }}>
              <b style={{ fontSize: 12.5, display: 'block' }}>Admin</b>
              <small style={{ color: 'var(--mut)', fontSize: 10.5 }}>Quản trị viên</small>
            </span>
            <button type="button" title="Đăng xuất" className="iconbtn" style={{ marginLeft: 0 }} onClick={logout}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" /></svg>
            </button>
          </div>
        </div>
      </aside>
      <main className="main">
        <Outlet />
      </main>
    </div>
  );
}
