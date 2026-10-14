import { useEffect, useState, useCallback } from 'react';
import { supabase } from './supabase';

/** Hook đọc 1 bảng Supabase: rows / loading / error / reload */
export function useTable<T>(table: string, select = '*', orderBy = 'created_at') {
  const [rows, setRows] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    const { data, error } = await supabase
      .from(table)
      .select(select)
      .order(orderBy, { ascending: false });
    if (error) setError(error.message);
    else setRows((data || []) as T[]);
    setLoading(false);
  }, [table, select, orderBy]);

  useEffect(() => {
    load();
  }, [load]);

  return { rows, loading, error, reload: load };
}

/** Đếm số dòng 1 bảng */
export async function countRows(table: string): Promise<number> {
  const { count } = await supabase.from(table).select('*', { count: 'exact', head: true });
  return count || 0;
}
