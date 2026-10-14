import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { countRows } from '../lib/useTable';
import { Card, PageHead, Badge, Spinner, fmtDate, fmtVND } from '../components/ui';
import type { DocumentRow, Transaction } from '../lib/types';

export default function Dashboard() {
  const [stats, setStats] = useState({ users: 0, docs: 0, codes: 0, revenue: 0 });
  const [recentDocs, setRecentDocs] = useState<DocumentRow[]>([]);
  const [recentTx, setRecentTx] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [users, docs, codes] = await Promise.all([
        countRows('app_users'),
        countRows('documents'),
        countRows('error_codes'),
      ]);
      const { data: tx } = await supabase.from('transactions').select('amount').eq('status', 'success');
      const revenue = (tx || []).reduce((s: number, r: { amount: number }) => s + (r.amount || 0), 0);
      const { data: rd } = await supabase.from('documents').select('*').order('created_at', { ascending: false }).limit(5);
      const { data: rt } = await supabase
        .from('transactions')
        .select('*, app_users(phone)')
        .order('created_at', { ascending: false })
        .limit(5);
      setStats({ users, docs, codes, revenue });
      setRecentDocs((rd || []) as DocumentRow[]);
      setRecentTx((rt || []) as Transaction[]);
      setLoading(false);
    })();
  }, []);

  if (loading) return <><PageHead title="Dashboard" sub="Tổng quan hệ thống" /><Spinner /></>;

  return (
    <>
      <PageHead title="Dashboard" sub="Tổng quan hệ thống" />
      <div className="stats">
        <div className="neu stat"><small>NGƯỜI DÙNG</small><b>{stats.users.toLocaleString('vi-VN')}</b></div>
        <div className="neu stat"><small>TÀI LIỆU</small><b>{stats.docs.toLocaleString('vi-VN')}</b></div>
        <div className="neu stat"><small>MÃ LỖI</small><b>{stats.codes.toLocaleString('vi-VN')}</b></div>
        <div className="neu stat"><small>DOANH THU</small><b>{fmtVND(stats.revenue)}</b></div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <Card>
          <h4>Tài liệu mới nhất</h4>
          <table className="tbl">
            <tbody>
              {recentDocs.map((d) => (
                <tr key={d.id}>
                  <td><b>{d.title}</b><br /><small style={{ color: 'var(--mut)' }}>{fmtDate(d.created_at)}</small></td>
                  <td style={{ textAlign: 'right' }}>{d.is_premium ? <Badge tone="gold">PREMIUM</Badge> : <Badge tone="gray">FREE</Badge>}</td>
                </tr>
              ))}
              {recentDocs.length === 0 && <tr><td>Chưa có tài liệu nào.</td></tr>}
            </tbody>
          </table>
        </Card>
        <Card>
          <h4>Giao dịch mới nhất</h4>
          <table className="tbl">
            <tbody>
              {recentTx.map((t) => (
                <tr key={t.id}>
                  <td><b>{t.app_users?.phone || '—'}</b><br /><small style={{ color: 'var(--mut)' }}>{t.plan}</small></td>
                  <td style={{ textAlign: 'right' }}><b>{fmtVND(t.amount)}</b></td>
                </tr>
              ))}
              {recentTx.length === 0 && <tr><td>Chưa có giao dịch nào.</td></tr>}
            </tbody>
          </table>
        </Card>
      </div>
    </>
  );
}
