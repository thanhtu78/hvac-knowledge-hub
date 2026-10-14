import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Btn, Card, Field, TextInput, Modal, PageHead, IconBtn, TrashIcon, Spinner, toast } from '../components/ui';

interface TreeModel { id: string; name: string }
interface TreeLine { id: string; name: string; models: TreeModel[] }
interface TreeBrand { id: string; name: string; lines: TreeLine[] }

export default function Brands() {
  const [tree, setTree] = useState<TreeBrand[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState<string | null>(null);
  const [modal, setModal] = useState<null | { kind: 'brand' } | { kind: 'line'; brandId: string; brandName: string } | { kind: 'model'; lineId: string; lineName: string }>(null);
  const [name, setName] = useState('');

  const load = async () => {
    setLoading(true);
    const { data: brands } = await supabase.from('brands').select('*').order('name');
    const out: TreeBrand[] = [];
    for (const b of brands || []) {
      const { data: lines } = await supabase.from('product_lines').select('*').eq('brand_id', b.id).order('name');
      const lout: TreeLine[] = [];
      for (const l of lines || []) {
        const { data: models } = await supabase.from('models').select('*').eq('line_id', l.id).order('name');
        lout.push({ id: l.id, name: l.name, models: (models || []) as TreeModel[] });
      }
      out.push({ id: b.id, name: b.name, lines: lout });
    }
    setTree(out);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!name.trim()) { toast('Nhập tên'); return; }
    if (modal?.kind === 'brand') {
      const { error } = await supabase.from('brands').insert({ name: name.trim() });
      if (error) toast('Lỗi: ' + error.message); else toast('Đã thêm hãng');
    } else if (modal?.kind === 'line') {
      const { error } = await supabase.from('product_lines').insert({ brand_id: modal.brandId, name: name.trim() });
      if (error) toast('Lỗi: ' + error.message); else toast('Đã thêm dòng máy');
    } else if (modal?.kind === 'model') {
      const { error } = await supabase.from('models').insert({ line_id: modal.lineId, name: name.trim() });
      if (error) toast('Lỗi: ' + error.message); else toast('Đã thêm model');
    }
    setModal(null); setName(''); load();
  };
  const del = async (table: string, id: string, label: string) => {
    if (!confirm(`Xóa "${label}"? Các mục con cũng bị xóa theo.`)) return;
    const { error } = await supabase.from(table).delete().eq('id', id);
    if (error) toast('Lỗi: ' + error.message); else { toast('Đã xóa'); load(); }
  };

  const title = !modal ? '' : modal.kind === 'brand' ? 'Thêm hãng' : modal.kind === 'line' ? `Thêm dòng máy — ${modal.brandName}` : `Thêm model — ${modal.lineName}`;

  return (
    <>
      <PageHead title="Hãng & Model" sub="Cây hãng → dòng máy → model" action={<Btn onClick={() => { setModal({ kind: 'brand' }); setName(''); }}>＋ Hãng</Btn>} />
      {loading ? <Spinner /> : tree.length === 0 ? <div className="neu card"><p style={{ textAlign: 'center', color: 'var(--mut)' }}>Chưa có hãng nào.</p></div> : tree.map((b) => (
        <div key={b.id} className="neu card">
          <div className="tree-row" onClick={() => setOpen(open === b.id ? null : b.id)}>
            <b style={{ flex: 1 }}>{b.name}</b>
            <span style={{ color: 'var(--mut)', fontSize: 12 }}>{b.lines.length} dòng máy</span>
            <Btn small ghost onClick={(e) => { e.stopPropagation(); setModal({ kind: 'line', brandId: b.id, brandName: b.name }); setName(''); }}>＋ Dòng máy</Btn>
            <IconBtn title="Xóa hãng" onClick={() => del('brands', b.id, b.name)}><TrashIcon /></IconBtn>
          </div>
          {open === b.id && (
            <div className="tree-sub">
              {b.lines.length === 0 && <div style={{ color: 'var(--mut)' }}>Chưa có dòng máy.</div>}
              {b.lines.map((l) => (
                <div key={l.id}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <b style={{ flex: 1 }}>{l.name}</b>
                    <Btn small ghost onClick={() => { setModal({ kind: 'model', lineId: l.id, lineName: l.name }); setName(''); }}>＋ Model</Btn>
                    <IconBtn title="Xóa dòng máy" onClick={() => del('product_lines', l.id, l.name)}><TrashIcon /></IconBtn>
                  </div>
                  <div style={{ color: 'var(--mut)', fontSize: 12.5, marginTop: 4 }}>
                    {l.models.length ? l.models.map((m) => (
                      <span key={m.id} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, marginRight: 12 }}>
                        {m.name}
                        <span style={{ cursor: 'pointer', color: 'var(--red)' }} title="Xóa model" onClick={() => del('models', m.id, m.name)}>×</span>
                      </span>
                    )) : 'Chưa có model.'}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
      {modal && (
        <Modal title={title} onClose={() => setModal(null)} onSave={save}>
          <Field label="Tên"><TextInput value={name} onChange={(e) => setName(e.target.value)} autoFocus /></Field>
        </Modal>
      )}
    </>
  );
}
