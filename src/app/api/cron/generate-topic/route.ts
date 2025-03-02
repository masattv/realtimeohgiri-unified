import { NextResponse } from 'next/server';
import { createAutoGeneratedTopic } from '@/services/topic-service';
import { ApiResponse, Topic } from '@/lib/types';

// CRONジョブによって呼び出されるAPIエンドポイント
// 4時間ごとに新しいお題を生成する
export async function GET(request: Request) {
  try {
    // 認証キーの検証（セキュリティのため）
    // Note: 本番環境ではより堅牢な認証を実装すべき
    const { searchParams } = new URL(request.url);
    const authKey = searchParams.get('key');
    const secretKey = process.env.CRON_SECRET_KEY;
    
    if (!secretKey || authKey !== secretKey) {
      return NextResponse.json(
        { success: false, error: '認証エラー' },
        { status: 401 }
      );
    }
    
    // 新しいお題を生成
    const newTopic = await createAutoGeneratedTopic();
    
    const response: ApiResponse<Topic> = {
      success: true,
      data: newTopic
    };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Failed to auto-generate topic:', error);
    
    const response: ApiResponse<null> = {
      success: false,
      error: error instanceof Error ? error.message : '不明なエラーが発生しました'
    };
    
    return NextResponse.json(response, { status: 500 });
  }
} 