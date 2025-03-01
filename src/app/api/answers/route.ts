import { NextResponse } from 'next/server';
import { createAnswer, getAnswersByTopicId } from '@/services/answer-service';
import { ApiResponse, Answer, CreateAnswerInput } from '@/lib/types';

// 回答一覧取得 (GET /api/answers?topicId=xxx)
export async function GET(
  request: Request
) {
  try {
    // URLからクエリパラメータを取得
    const { searchParams } = new URL(request.url);
    const topicId = searchParams.get('topicId');
    
    if (!topicId) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'topicIdクエリパラメータは必須です'
      };
      
      return NextResponse.json(response, { status: 400 });
    }
    
    const answers = await getAnswersByTopicId(topicId);
    
    const response: ApiResponse<Answer[]> = {
      success: true,
      data: answers
    };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Failed to fetch answers:', error);
    
    const response: ApiResponse<null> = {
      success: false,
      error: error instanceof Error ? error.message : '不明なエラーが発生しました'
    };
    
    return NextResponse.json(response, { status: 500 });
  }
}

// 回答作成 (POST /api/answers)
export async function POST(
  request: Request
) {
  try {
    const body = await request.json();
    
    // リクエストボディの検証
    if (!body.content || typeof body.content !== 'string') {
      const response: ApiResponse<null> = {
        success: false,
        error: '回答の内容は必須です'
      };
      
      return NextResponse.json(response, { status: 400 });
    }
    
    if (!body.topicId || typeof body.topicId !== 'string') {
      const response: ApiResponse<null> = {
        success: false,
        error: 'トピックIDは必須です'
      };
      
      return NextResponse.json(response, { status: 400 });
    }
    
    const answerData: CreateAnswerInput = {
      content: body.content,
      topicId: body.topicId
    };
    
    const newAnswer = await createAnswer(answerData);
    
    const response: ApiResponse<Answer> = {
      success: true,
      data: newAnswer
    };
    
    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('Failed to create answer:', error);
    
    const response: ApiResponse<null> = {
      success: false,
      error: error instanceof Error ? error.message : '不明なエラーが発生しました'
    };
    
    return NextResponse.json(response, { status: 500 });
  }
} 