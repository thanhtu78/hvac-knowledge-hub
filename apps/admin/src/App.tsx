import { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import { Toaster } from './components/ui';
import { isSupabaseConfigured, supabase } from './lib/supabase';
import Dashboard from './pages/Dashboard';
import Articles from './pages/Articles';
import ErrorCodes from './pages/ErrorCodes';
import Brands from './pages/Brands';
import Checklists from './pages/Checklists';
import Users from './pages/Users';
import Billing from './pages/Billing';
import Media from './pages/Media';
import Notifications from './pages/Notifications';
import Login from './pages/Login';

function SetupScreen() {
  return (
    <div className="setup">
      <div className="neu setup-card">
        <h1>Chưa cấu hình Supabase</h1>
        <p>
          Admin CMS cần kết nối Supabase để hoạt động. Hãy thêm 2 biến môi trường sau
          (local: file <code>.env</code> · Vercel: <b>Settings → Environment Variables</b>):
        </p>
        <ol>
          <li>
            <code>VITE_SUPABASE_URL</code>
          </li>
          <li>
            <code>VITE_SUPABASE_ANON_KEY</code>
          </li>
          <li>
            Chạy file <code>supabase/migrations/0001_init.sql</code> trong SQL Editor của Supabase.
          </li>
        </ol>
        <p>Xong thì reload lại trang.</p>
      </div>
    </div>
  );
}

function AuthGate({ children }: { children: JSX.Element }) {
  const [state, setState] = useState<'loading' | 'in' | 'out'>('loading');
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setState(data.session ? 'in' : 'out'));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setState(s ? 'in' : 'out'));
    return () => sub.subscription.unsubscribe();
  }, []);
  if (state === 'loading') return <div className="spinner" />;
  if (state === 'out') return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  if (!isSupabaseConfigured) return <SetupScreen />;
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<AuthGate><Layout /></AuthGate>}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/articles" element={<Articles />} />
          <Route path="/error-codes" element={<ErrorCodes />} />
          <Route path="/brands" element={<Brands />} />
          <Route path="/checklists" element={<Checklists />} />
          <Route path="/users" element={<Users />} />
          <Route path="/billing" element={<Billing />} />
          <Route path="/media" element={<Media />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
      <Toaster />
    </>
  );
}
