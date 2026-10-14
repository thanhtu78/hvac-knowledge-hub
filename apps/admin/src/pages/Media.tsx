import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useTable } from '../lib/useTable';
import { Btn, Field, TextInput, Select, Modal, PageHead, Badge, IconBtn, TrashIcon, Spinner, Empty, toast, fmtDate } from '../components/ui';
import type { MediaFile } from '../lib/types';

function fmtSize(b: number | null) {
  if (!b) return '—';
  if (b < 1024 * 1024) return Math.round(b / 1024) + ' KB';
  return (b / 1024 / 1024).toFixed(1) + ' MB';
}

export default function Media() {
  const { rows, loading, error, reload } = useTable<MediaFile>('media_files');
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ file_name: '', file_type: 'pdf', storage: 'r2', url: '' });

  const save = async () => {
    if (!form.file_name.trim()) { toast('Nhập tên file'); return; }
    const { error } = await supabase.from('media_files').insert({
      file_name: form.file_name.trim(),
      file_type: form.file_type,
      storage: form.storage,
      url: form.url.trim() || null,
    });
    if (error) toast('Lỗi: ' + error.message);
    else { toast('Đã thêm file'); setModal(false); setForm({ file_name: '', file_type: 'pdf', storage: 'r2', url: '' }); reload(); }
  };
  const remove = async (m: MediaFile) => {
    if (!confirm(`Xóa file "${m.file_name}"?`)) return;
    const { error } = await supabase.from('media_files').delete().eq('id', m.id);
    if (error) toast('Lỗi: ' + error.message);
    else { toast('Đã xóa'); reload(); }
  };

  return (
    <>
      <PageHead
        title="Thư viện media"
        sub="PDF lưu trên Cloudflare R2 · Ảnh/video qua Cloudinary"
        action={<Btn onClick={() => setModal(true)}>＋ Tải lên</Btn>}
      />
      {error && <div className="err">{error}</div>}
      {loading ? <Spinner /> : rows.length === 0 ? (
        <div className="neu card"><Empty text="Chưa có file nào." /></div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
          {rows.map((m) => (
            <div key={m.id} className="neu card" style={{ margin: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <b style={{ flex: 1, fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.file_name}</b>
                <IconBtn title="Xóa" onClick={() => remove(m)}><TrashIcon /></IconBtn>
              </div>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 6 }}>
                <Badge tone="blue">{m.file_type.toUpperCase()}</Badge>
                <Badge tone={m.storage === 'r2' ? 'green' : 'gold'}>{m.storage === 'r2' ? 'Cloudflare R2' : 'Cloudinary'}</Badge>
              </div>
              <small style={{ color: 'var(--mut)' }}>{fmtSize(m.size_bytes)} · {fmtDate(m.created_at)}</small>
            </div>
          ))}
        </div>
      )}
      {modal && (
        <Modal title="Thêm file media" onClose={() => setModal(false)} onSave={save}>
          <Field label="Tên file"><TextInput value={form.file_name} onChange={(e) => setForm({ ...form, file_name: e.target.value })} placeholder="VD: so-do-mach.pdf" /></Field>
          <Field label="Loại">
            <Select value={form.file_type} onChange={(e) => setForm({ ...form, file_type: e.target.value })}>
              <option value="pdf">PDF</option>
              <option value="image">Ảnh</option>
              <option value="video">Video</option>
            </Select>
          </Field>
          <Field label="Lưu trữ">
            <Select value={form.storage} onChange={(e) => setForm({ ...form, storage: e.target.value })}>
              <option value="r2">Cloudflare R2 (khuyên dùng cho PDF)</option>
              <option value="cloudinary">Cloudinary (ảnh/video)</option>
            </Select>
          </Field>
          <Field label="URL file"><TextInput value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} placeholder="https://…" /></Field>
          <p style={{ fontSize: 12, color: 'var(--mut)', lineHeight: 1.6 }}>
            Upload trực tiếp lên R2/Cloudinary sẽ được nối ở bước tiếp theo — hiện tại lưu metadata trước.
          </p>
        </Modal>
      )}
    </>
  );
}
