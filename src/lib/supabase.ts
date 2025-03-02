import { createClient } from '@supabase/supabase-js';

// Supabaseの環境変数が設定されているか確認
if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Supabase環境変数が設定されていません');
}

// Supabaseクライアントを作成
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// リアルタイム変更監視のためのヘルパー関数
export function subscribeToAnswers(topicId: string, callback: (payload: any) => void) {
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
export function subscribeToTopics(callback: (payload: any) => void) {
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