'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // エラーをログに記録
    console.error('アプリケーションエラー:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold text-red-600 mb-4">エラーが発生しました</h2>
        <p className="mb-4">申し訳ありませんが、エラーが発生しました。</p>
        <p className="text-sm text-gray-500 mb-4">
          エラー詳細: {error.message || 'Unknown error'}<br />
          {error.digest && <span>Digest: {error.digest}</span>}
        </p>
        <button
          onClick={() => reset()}
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded"
        >
          再試行
        </button>
      </div>
    </div>
  );
} 