import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useTable } from '../lib/useTable';
import {
  Btn, Card, Field, TextInput, Select, Modal, PageHead, Badge,
  Toggle, IconBtn, TrashIcon, Empty, Spinner, toast, fmtDate,
} from '../components/ui';
import type { DocumentRow, Brand, Model } from '../lib/types';

export default function Articles() {
  const { rows, loading, error, reload } = useTable<DocumentRow>('documents', '*, brands(name), models(name)');
  const [q, setQ] = useState('');
  const [modal, setModal] = useState<null | { doc?: DocumentRow }>(null);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [models, setModels] = useState<Model[]>([]);
  const [form, setForm] = useState({ title: '', brand_id: '', model_id: '', pages: 0, is_premium: false, status: 'draft' });

  const filtered = rows.filter((a) => (a.title + (a.brands?.name || '')).toLowerCase().includes(q.toLowerCase()));

  const openAdd = async () => {
    const { data } = await supabase.from('brands').select('*').order('name');
    setBrands((data || []) as Brand[]);
    setModels([]);
    setForm({ title: '', brand_id: '', model_id: '', pages: 0, is_premium: false, status: 'draft' });
    setModal({});
  };
  const onBrandChange = async (brandId: string) => {
    setForm((f) => ({ ...f, brand_id: brandId, model_id: '' }));
    if (!brandId) { setModels([]); return; }
    const { data: lines } = await supabase.from('product_lines').select('id').eq('brand_id', brandId);
    const lineIds = (lines || []).map((l: { id: string }) => l.id);
    if (!lineIds.length) { setModels([]); return; }
    const { data: ms } = await supabase.from('models').select('*').in('line_id', lineIds).order('name');
    setModels((ms || []) as Model[]);
  };
  const save = async () => {
    if (!form.title.trim()) { toast('Nhập tiêu đề'); return; }
    const payload = {
      title: form.title.trim(),
      brand_id: form.brand_id || null,
      model_id: form.model_id || null,
      pages: Number(form.pages) || 0,
      is_premium: form.is_premium,
      status: form.status,
    };
    const { error } = modal?.doc
      ? await supabase.from('documents').update(payload).eq('id', modal.doc.id)
      : await supabase.from('documents').insert(payload);
    if (error) toast('Lỗi: ' + error.message);
    else { toast(modal?.doc ? 'Đã cập nhật' : 'Đã thêm bài viết'); setModal(null); reload(); }
  };
  const togglePremium = async (d: DocumentRow) => {
    const { error } = await supabase.from('documents').update({ is_premium: !d.is_premium }).eq('id', d.id);
    if (error) toast('Lỗi: ' + error.message);
    else { toast(d.is_premium ? 'Đã gỡ Premium' : 'Đã đánh dấu Premium'); reload(); }
  };
  const remove = async (d: DocumentRow) => {
    if (!confirm(`Xóa bài viết "${d.title}"?`)) return;
    const { error } = await supabase.from('documents').delete().eq('id', d.id);
    if (error) toast('Lỗi: ' + error.message);
    else { toast('Đã xóa'); reload(); }
  };

  return (
    <>
      <PageHead title="Bài viết" sub="Soạn thảo, upload PDF, đánh dấu Premium" action={<Btn onClick={openAdd}>＋ Bài viết</Btn>} />
      <div className="toolbar">
        <div className="searchbox">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#7E8CA3" strokeWidth={2.4}><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></svg>
          <input placeholder="Tìm bài viết…" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </div>
      {error && <div className="err">{error}</div>}
      <Card>
        {loading ? <Spinner /> : filtered.length === 0 ? <Empty text="Chưa có bài viết nào." /> : (
          <table className="tbl">
            <thead><tr><th>Tiêu đề</th><th>Hãng / Model</th><th>Premium</th><th>Trạng thái</th><th></th></tr></thead>
            <tbody>
              {filtered.map((a) => (
                <tr key={a.id}>
                  <td><b>{a.title}</b><br /><small style={{ color: 'var(--mut)' }}>{a.pages} trang · {a.views} lượt xem · {fmtDate(a.created_at)}</small></td>
                  <td>{a.brands?.name || '—'} · {a.models?.name || '—'}</td>
                  <td><Toggle on={a.is_premium} onChange={() => togglePremium(a)} /></td>
                  <td><Badge tone={a.status === 'published' ? 'green' : a.status === 'pending' ? 'blue' : 'gray'}>{a.status === 'published' ? 'Đã duyệt' : a.status === 'pending' ? 'Chờ duyệt' : 'Nháp'}</Badge></td>
                  <td style={{ whiteSpace: 'nowrap', textAlign: 'right' }}>
                    <IconBtn title="Xóa" onClick={() => remove(a)}><TrashIcon /></IconBtn>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
      {modal && (
        <Modal title={modal.doc ? 'Sửa bài viết' : 'Thêm bài viết'} onClose={() => setModal(null)} onSave={save}>
          <Field label="Tiêu đề"><TextInput value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="VD: Sơ đồ mạch dàn lạnh FTKA" /></Field>
          <Field label="Hãng">
            <Select value={form.brand_id} onChange={(e) => onBrandChange(e.target.value)}>
              <option value="">— Chung —</option>
              {brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
            </Select>
          </Field>
          <Field label="Model">
            <Select value={form.model_id} onChange={(e) => setForm({ ...form, model_id: e.target.value })}>
              <option value="">—</option>
              {models.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
            </Select>
          </Field>
          <Field label="Số trang"><TextInput type="number" value={form.pages} onChange={(e) => setForm({ ...form, pages: Number(e.target.value) })} /></Field>
          <Field label="Trạng thái">
            <Select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              <option value="draft">Nháp</option>
              <option value="pending">Chờ duyệt</option>
              <option value="published">Đã duyệt</option>
            </Select>
          </Field>
          <label className="check"><input type="checkbox" checked={form.is_premium} onChange={(e) => setForm({ ...form, is_premium: e.target.checked })} /> Đánh dấu Premium</label>
        </Modal>
      )}
    </>
  );
}
