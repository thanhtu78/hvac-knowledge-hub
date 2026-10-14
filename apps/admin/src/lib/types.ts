export interface Brand {
  id: string;
  name: string;
  created_at: string;
}

export interface ProductLine {
  id: string;
  brand_id: string;
  name: string;
  created_at: string;
}

export interface Model {
  id: string;
  line_id: string;
  name: string;
  created_at: string;
}

export interface DocumentRow {
  id: string;
  title: string;
  brand_id: string | null;
  model_id: string | null;
  file_url: string | null;
  pages: number;
  is_premium: boolean;
  status: 'draft' | 'pending' | 'published';
  views: number;
  created_at: string;
  brands?: { name: string } | null;
  models?: { name: string } | null;
}

export interface ErrorCode {
  id: string;
  code: string;
  brand_id: string | null;
  title: string;
  cause: string | null;
  created_at: string;
  brands?: { name: string } | null;
}

export interface ErrorCodeStep {
  id: string;
  error_code_id: string;
  step_order: number;
  instruction: string;
  is_premium: boolean;
}

export interface Checklist {
  id: string;
  title: string;
  created_at: string;
}

export interface ChecklistStep {
  id: string;
  checklist_id: string;
  step_order: number;
  instruction: string;
}

export interface AppUser {
  id: string;
  phone: string;
  is_premium: boolean;
  created_at: string;
}

export interface Transaction {
  id: string;
  user_id: string | null;
  plan: string;
  amount: number;
  status: string;
  created_at: string;
  app_users?: { phone: string } | null;
}

export interface MediaFile {
  id: string;
  file_name: string;
  file_type: 'pdf' | 'image' | 'video';
  size_bytes: number | null;
  storage: 'r2' | 'cloudinary';
  url: string | null;
  created_at: string;
}

export interface NotificationRow {
  id: string;
  title: string;
  body: string | null;
  status: 'draft' | 'sent';
  sent_count: number;
  created_at: string;
}
