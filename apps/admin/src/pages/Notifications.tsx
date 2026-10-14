import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useTable } from '../lib/useTable';
import { Btn, Card, Field, TextInput, TextArea, Modal, PageHead, Badge, IconBtn, TrashIcon, Spinner, Empty, toast, fmtDate } from '../components/ui';
import type { NotificationRow } from '../lib/types';

export default function Notifications() {
  const { rows, loading, error, reload } = useTable<NotificationRow>('notifications');
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ title: '', body: '' });

  const save = async (asDraft: boolean) => {
    if (!form.title.trim()) { toast('Nhập tiêu đề'); return; }
    const { error } = await supabase.from('notifications').insert({
      title: form.title.trim(),
      body: form.body.trim() || null,
      status: asDraft ? 'draft' : 'sent',
      sent_count: asDraft ? 0 : 1,
    });
    if (error) toast('Lỗi: ' + error.message);
    else { toast(asDraft ? 'Đã lưu nháp' : 'Đã gửi (demo)'); setModal(false); setForm({ title: '', body: '' }); reload(); }
  };
  const remove = async (n: NotificationRow) => {
    if (!confirm('Xóa thông báo này?')) return;
    const { error } = await supabase.from('notifications').delete().eq('id', n.id);
    if (error) toast('Lỗi: ' + error.message);
    else { toast('Đã xóa'); reload(); }
  };

  return (
    <>
      <PageHead title="Thông báo" sub="Push notification & banner trang chủ" action={<Btn onClick={() => setModal(true)}>＋ Thông báo</Btn>} />
      {error && <div className="err">{error}</div>}
      <Card>
        <h4>Lịch sử</h4>
        {loading ? <Spinner /> : rows.length === 0 ? <Empty text="Chưa có thông báo nào." /> : (
          <table className="tbl">
            <thead><tr><th>Tiêu đề</th><th>Trạng thái</th><th>Ngày</th><th></th></tr></thead>
            <tbody>
              {rows.map((n) => (
                <tr key={n.id}>
                  <td><b>{n.title}</b><br /><small style={{ color: 'var(--mut)' }}>{n.body || ''}</small></td>
                  <td><Badge tone={n.status === 'sent' ? 'green' : 'gray'}>{n.status === 'sent' ? 'Đã gửi' : 'Nháp'}</Badge></td>
                  <td>{fmtDate(n.created_at)}</td>
                  <td style={{ textAlign: 'right' }}><IconBtn title="Xóa" onClick={() => remove(n)}><TrashIcon /></IconBtn></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
      {modal && (
        <Modal title="Soạn thông báo" onClose={() => setModal(false)} onSave={() => save(false)} saveLabel="Gửi ngay">
          <Field label="Tiêu đề"><TextInput value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="VD: Tài liệu mã lỗi VRF mới" /></Field>
          <Field label="Nội dung"><TextArea value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} /></Field>
          <Btn ghost onClick={() => save(true)} >Lưu nháp</Btn>
        </Modal>
      )}
    </>
  );
}
