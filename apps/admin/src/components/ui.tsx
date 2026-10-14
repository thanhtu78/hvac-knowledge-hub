import { useEffect, useState, type ReactNode, type ButtonHTMLAttributes, type InputHTMLAttributes, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react';

/* ---------- Toast ---------- */
export function toast(msg: string) {
  window.dispatchEvent(new CustomEvent('app-toast', { detail: msg }));
}
export function Toaster() {
  const [items, setItems] = useState<{ id: number; msg: string }[]>([]);
  useEffect(() => {
    const h = (e: Event) => {
      const id = Date.now() + Math.random();
      const msg = (e as CustomEvent).detail as string;
      setItems((p) => [...p, { id, msg }]);
      setTimeout(() => setItems((p) => p.filter((x) => x.id !== id)), 2400);
    };
    window.addEventListener('app-toast', h);
    return () => window.removeEventListener('app-toast', h);
  }, []);
  return (
    <div className="toaster">
      {items.map((i) => (
        <div key={i.id} className="toastmsg">{i.msg}</div>
      ))}
    </div>
  );
}

/* ---------- Button ---------- */
interface BtnProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  ghost?: boolean;
  small?: boolean;
  danger?: boolean;
}
export function Btn({ ghost, small, danger, className = '', ...rest }: BtnProps) {
  const cls = `btn${ghost ? ' ghost' : ''}${small ? ' sm' : ''}${danger ? ' danger' : ''} ${className}`;
  return <button className={cls} {...rest} />;
}

/* ---------- Card ---------- */
export function Card({ children, style }: { children: ReactNode; style?: React.CSSProperties }) {
  return (
    <div className="neu card" style={style}>
      {children}
    </div>
  );
}

/* ---------- Field ---------- */
export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="field">
      <label>{label}</label>
      {children}
    </div>
  );
}
export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input className="input" {...props} />;
}
export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className="select" {...props} />;
}
export function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className="textarea" {...props} />;
}

/* ---------- Badge ---------- */
export function Badge({ tone = 'gray', children }: { tone?: 'blue' | 'gold' | 'green' | 'gray' | 'red'; children: ReactNode }) {
  return <span className={`badge ${tone}`}>{children}</span>;
}

/* ---------- Toggle ---------- */
export function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      className={`switch${on ? ' on' : ''}`}
      onClick={(e) => {
        e.stopPropagation();
        onChange(!on);
      }}
      aria-pressed={on}
    />
  );
}

/* ---------- Icon button ---------- */
export function IconBtn({ title, onClick, children }: { title: string; onClick: (e: React.MouseEvent) => void; children: ReactNode }) {
  return (
    <button
      type="button"
      title={title}
      className="iconbtn"
      onClick={(e) => {
        e.stopPropagation();
        onClick(e);
      }}
    >
      {children}
    </button>
  );
}
export function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M4 7h16M9 7V4h6v3m-8 0l1 13h8l1-13" />
    </svg>
  );
}

/* ---------- Modal ---------- */
export function Modal({
  title,
  onClose,
  onSave,
  saveLabel = 'Lưu',
  wide,
  children,
}: {
  title: string;
  onClose: () => void;
  onSave: () => void;
  saveLabel?: string;
  wide?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="modal-veil" onClick={onClose}>
      <div className="neu modal-box" style={wide ? { width: 760 } : undefined} onClick={(e) => e.stopPropagation()}>
        <h3>{title}</h3>
        {children}
        <div className="modal-actions">
          <Btn ghost onClick={onClose}>
            Hủy
          </Btn>
          <Btn onClick={onSave}>{saveLabel}</Btn>
        </div>
      </div>
    </div>
  );
}

/* ---------- Page head ---------- */
export function PageHead({ title, sub, action }: { title: string; sub: string; action?: ReactNode }) {
  return (
    <div className="pagehead">
      <div style={{ flex: 1 }}>
        <h2>{title}</h2>
        <p>{sub}</p>
      </div>
      {action}
    </div>
  );
}

/* ---------- Misc ---------- */
export function Empty({ text }: { text: string }) {
  return <div className="empty">{text}</div>;
}
export function Spinner() {
  return <div className="spinner" />;
}
export function fmtDate(iso: string) {
  const d = new Date(iso);
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
}
export function fmtVND(n: number) {
  return n.toLocaleString('vi-VN') + 'đ';
}
