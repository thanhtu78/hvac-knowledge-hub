import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Card, PageHead, Badge, Spinner, toast, fmtDate, fmtVND } from '../components/ui';
import type { Transaction } from '../lib/types';

export default function Billing() {
  const [txns, setTxns] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [premCount, setPremCount] = useState(0);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('transactions')
      .select('*, app_users(phone)')
      .order('created_at', { ascending: false })
      .limit(50);
    if (error) toast('Lỗi: ' + error.message);
    setTxns((data || []) as Transaction[]);
    const { count } = await supabase.from('app_users').select('*', { count: 'exact', head: true }).eq('is_premium', true);
    setPremCount(count || 0);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const revenue = txns.filter((t) => t.status === 'success').reduce((s, t) => s + t.amount, 0);

  return (
    <>
      <PageHead title="Gói & Thanh toán" sub="Gói Premium, giao dịch, đối soát" />
      <div className="stats">
        <div className="neu stat"><small>DOANH THU (50 GD GẦN NHẤT)</small><b>{fmtVND(revenue)}</b></div>
        <div className="neu stat"><small>USER PREMIUM</small><b>{premCount}</b></div>
        <div className="neu stat"><small>GÓI THÁNG</small><b>49k</b></div>
        <div className="neu stat"><small>GÓI NĂM</small><b>490k</b></div>
      </div>
      <Card>
        <h4>Giao dịch gần đây</h4>
        {loading ? <Spinner /> : txns.length === 0 ? <p style={{ color: 'var(--mut)', textAlign: 'center' }}>Chưa có giao dịch nào.</p> : (
          <table className="tbl">
            <thead><tr><th>User</th><th>Gói</th><th>Số tiền</th><th>Trạng thái</th><th>Ngày</th></tr></thead>
            <tbody>
              {txns.map((t) => (
                <tr key={t.id}>
                  <td><b>{t.app_users?.phone || '—'}</b></td>
                  <td>{t.plan}</td>
                  <td><b>{fmtVND(t.amount)}</b></td>
                  <td><Badge tone={t.status === 'success' ? 'green' : t.status === 'pending' ? 'blue' : 'red'}>{t.status}</Badge></td>
                  <td>{fmtDate(t.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </>
  );
}
