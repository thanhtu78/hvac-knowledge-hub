import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useTable } from '../lib/useTable';
import { Card, PageHead, Badge, Toggle, Spinner, Empty, toast, fmtDate } from '../components/ui';
import type { AppUser } from '../lib/types';

export default function Users() {
  const { rows, loading, error, reload } = useTable<AppUser>('app_users');
  const [q, setQ] = useState('');
  const filtered = rows.filter((u) => u.phone.includes(q));

  const togglePremium = async (u: AppUser) => {
    const { error } = await supabase.from('app_users').update({ is_premium: !u.is_premium }).eq('id', u.id);
    if (error) toast('Lỗi: ' + error.message);
    else { toast(u.is_premium ? 'Đã hủy Premium' : 'Đã cấp Premium'); reload(); }
  };

  return (
    <>
      <PageHead title="Người dùng" sub="Phân quyền & cấp Premium thủ công" />
      <div className="toolbar">
        <div className="searchbox">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#7E8CA3" strokeWidth={2.4}><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></svg>
          <input placeholder="Tìm số điện thoại…" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </div>
      {error && <div className="err">{error}</div>}
      <Card>
        {loading ? <Spinner /> : filtered.length === 0 ? <Empty text="Chưa có người dùng nào." /> : (
          <table className="tbl">
            <thead><tr><th>Số điện thoại</th><th>Premium</th><th>Ngày đăng ký</th><th></th></tr></thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id}>
                  <td><b>{u.phone}</b></td>
                  <td><Toggle on={u.is_premium} onChange={() => togglePremium(u)} /></td>
                  <td>{fmtDate(u.created_at)}</td>
                  <td style={{ textAlign: 'right' }}>{u.is_premium ? <Badge tone="gold">PREMIUM</Badge> : <Badge tone="gray">FREE</Badge>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </>
  );
}
