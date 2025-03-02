import { createClient } from '@supabase/supabase-js';

// 環境変数の検証
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// 環境変数がない場合は警告を出す
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  // 開発環境では例外を投げる
  if (process.env.NODE_ENV === 'development') {
    console.error('Supabase環境変数が設定されていません - 機能が制限されます');
  }
}

// Supabaseクライアントを作成（環境変数がなくてもクラッシュしないように防御的に作成）
export const supabase = SUPABASE_URL && SUPABASE_ANON_KEY
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

// リアルタイム変更監視のためのヘルパー関数
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function subscribeToAnswers(topicId: string, callback: (payload: any) => void) {
  if (!supabase) {
    console.error('Supabaseクライアントが初期化されていないため、リアルタイム更新を購読できません');
    return { unsubscribe: () => {} }; // ダミーのunsubscribe関数を返す
  }

  return supabase
    .channel(`answers-${topicId}`)
    .on(
      'postgres_changes',
      { 
        event: '*', 
        schema: 'public', 
        table: 'Answer', 
        filter: `topicId=eq.${topicId}` 
      },
      callback
    )
    .subscribe();
}

// トピックの変更を監視するヘルパー関数
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function subscribeToTopics(callback: (payload: any) => void) {
  if (!supabase) {
    console.error('Supabaseクライアントが初期化されていないため、リアルタイム更新を購読できません');
    return { unsubscribe: () => {} }; // ダミーのunsubscribe関数を返す
  }

  return supabase
    .channel('topics')
    .on(
      'postgres_changes',
      { 
        event: '*', 
        schema: 'public', 
        table: 'Topic'
      },
      callback
    )
    .subscribe();
} 