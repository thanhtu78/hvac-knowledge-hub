import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useTable } from '../lib/useTable';
import {
  Btn, Card, Field, TextInput, Select, TextArea, Modal, PageHead,
  Badge, IconBtn, TrashIcon, Empty, Spinner, toast,
} from '../components/ui';
import type { ErrorCode, Brand } from '../lib/types';

export default function ErrorCodes() {
  const { rows, loading, error, reload } = useTable<ErrorCode>('error_codes', '*, brands(name)');
  const [brands, setBrands] = useState<Brand[]>([]);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ code: '', brand_id: '', title: '', cause: '', steps: '' });

  const openAdd = async () => {
    const { data } = await supabase.from('brands').select('*').order('name');
    setBrands((data || []) as Brand[]);
    setForm({ code: '', brand_id: '', title: '', cause: '', steps: '' });
    setModal(true);
  };
  const save = async () => {
    if (!form.code.trim()) { toast('Nhập mã lỗi'); return; }
    const { data: ec, error: e1 } = await supabase.from('error_codes').insert({
      code: form.code.trim().toUpperCase(),
      brand_id: form.brand_id || null,
      title: form.title.trim() || 'Chưa có mô tả',
      cause: form.cause.trim() || null,
    }).select('id').single();
    if (e1) { toast('Lỗi: ' + e1.message); return; }
    const lines = form.steps.split('\n').map((s) => s.trim()).filter(Boolean);
    if (lines.length) {
      const steps = lines.map((line, i) => ({
        error_code_id: (ec as { id: string }).id,
        step_order: i + 1,
        instruction: line.startsWith('! ') ? line.slice(2) : line,
        is_premium: line.startsWith('! '),
      }));
      await supabase.from('error_code_steps').insert(steps);
    }
    toast('Đã thêm mã lỗi'); setModal(false); reload();
  };
  const remove = async (c: ErrorCode) => {
    if (!confirm(`Xóa mã lỗi ${c.code}?`)) return;
    const { error } = await supabase.from('error_codes').delete().eq('id', c.id);
    if (error) toast('Lỗi: ' + error.message);
    else { toast('Đã xóa'); reload(); }
  };

  return (
    <>
      <PageHead title="Mã lỗi" sub="Nguyên nhân & cách xử lý từng bước" action={<Btn onClick={openAdd}>＋ Mã lỗi</Btn>} />
      {error && <div className="err">{error}</div>}
      <Card>
        {loading ? <Spinner /> : rows.length === 0 ? <Empty text="Chưa có mã lỗi nào." /> : (
          <table className="tbl">
            <thead><tr><th>Mã</th><th>Hãng</th><th>Mô tả</th><th></th></tr></thead>
            <tbody>
              {rows.map((c) => (
                <tr key={c.id}>
                  <td><Badge tone="blue">{c.code}</Badge></td>
                  <td>{c.brands?.name || '—'}</td>
                  <td>{c.title}</td>
                  <td style={{ textAlign: 'right' }}><IconBtn title="Xóa" onClick={() => remove(c)}><TrashIcon /></IconBtn></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
      {modal && (
        <Modal title="Thêm mã lỗi" onClose={() => setModal(false)} onSave={save}>
          <Field label="Mã lỗi"><TextInput value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} placeholder="VD: E5" /></Field>
          <Field label="Hãng">
            <Select value={form.brand_id} onChange={(e) => setForm({ ...form, brand_id: e.target.value })}>
              <option value="">— Chung —</option>
              {brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
            </Select>
          </Field>
          <Field label="Mô tả"><TextInput value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></Field>
          <Field label="Nguyên nhân"><TextArea value={form.cause} onChange={(e) => setForm({ ...form, cause: e.target.value })} /></Field>
          <Field label="Các bước xử lý (mỗi dòng 1 bước — dòng bắt đầu bằng '! ' sẽ là Premium)">
            <TextArea value={form.steps} onChange={(e) => setForm({ ...form, steps: e.target.value })} placeholder={"Kiểm tra giắc cắm\nĐo điện trở cảm biến\n! Thay board mạch"} />
          </Field>
        </Modal>
      )}
    </>
  );
}
