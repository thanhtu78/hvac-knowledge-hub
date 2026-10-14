import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Btn, Field, TextInput, TextArea, Modal, PageHead, IconBtn, TrashIcon, Spinner, toast, Empty } from '../components/ui';
import type { Checklist, ChecklistStep } from '../lib/types';

export default function Checklists() {
  const [items, setItems] = useState<(Checklist & { steps: ChecklistStep[] })[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [title, setTitle] = useState('');
  const [steps, setSteps] = useState('');

  const load = async () => {
    setLoading(true);
    const { data: cs } = await supabase.from('checklists').select('*').order('created_at', { ascending: false });
    const out: (Checklist & { steps: ChecklistStep[] })[] = [];
    for (const c of (cs || []) as Checklist[]) {
      const { data: st } = await supabase.from('checklist_steps').select('*').eq('checklist_id', c.id).order('step_order');
      out.push({ ...c, steps: (st || []) as ChecklistStep[] });
    }
    setItems(out);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!title.trim()) { toast('Nhập tên quy trình'); return; }
    const { data: c, error } = await supabase.from('checklists').insert({ title: title.trim() }).select('id').single();
    if (error) { toast('Lỗi: ' + error.message); return; }
    const lines = steps.split('\n').map((s) => s.trim()).filter(Boolean);
    if (lines.length) {
      await supabase.from('checklist_steps').insert(
        lines.map((instruction, i) => ({ checklist_id: (c as { id: string }).id, step_order: i + 1, instruction }))
      );
    }
    toast('Đã thêm checklist'); setModal(false); setTitle(''); setSteps(''); load();
  };
  const remove = async (id: string, t: string) => {
    if (!confirm(`Xóa checklist "${t}"?`)) return;
    const { error } = await supabase.from('checklists').delete().eq('id', id);
    if (error) toast('Lỗi: ' + error.message); else { toast('Đã xóa'); load(); }
  };

  return (
    <>
      <PageHead title="Checklist" sub="Quy trình bảo trì / bảo dưỡng chuẩn" action={<Btn onClick={() => setModal(true)}>＋ Checklist</Btn>} />
      {loading ? <Spinner /> : items.length === 0 ? <div className="neu card"><Empty text="Chưa có checklist nào." /></div> : items.map((c) => (
        <div key={c.id} className="neu card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <b style={{ flex: 1, fontSize: 15 }}>{c.title}</b>
            <IconBtn title="Xóa" onClick={() => remove(c.id, c.title)}><TrashIcon /></IconBtn>
          </div>
          {c.steps.map((s, i) => (
            <div key={s.id} className="stepitem"><i>{i + 1}</i>{s.instruction}</div>
          ))}
        </div>
      ))}
      {modal && (
        <Modal title="Thêm checklist" onClose={() => setModal(false)} onSave={save}>
          <Field label="Tên quy trình"><TextInput value={title} onChange={(e) => setTitle(e.target.value)} placeholder="VD: Bảo dưỡng điều hòa treo tường" /></Field>
          <Field label="Các bước (mỗi dòng 1 bước)"><TextArea value={steps} onChange={(e) => setSteps(e.target.value)} placeholder={"Vệ sinh lưới lọc\nXịt rửa dàn lạnh\nKiểm tra gas"} /></Field>
        </Modal>
      )}
    </>
  );
}
