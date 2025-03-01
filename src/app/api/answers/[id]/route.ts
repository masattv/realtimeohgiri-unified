import { NextResponse } from 'next/server';
import { selectBestAnswer, deleteAnswer } from '@/services/answer-service';
import { ApiResponse, Answer } from '@/lib/types';

// URLパラメータの型定義
interface RouteParams {
  params: {
    id: string
  }
}

// 回答を最優秀回答として選択 (PATCH /api/answers/[id])
export async function PATCH(
  request: Request,
  { params }: RouteParams
) {
  try {
    const body = await request.json();
    
    // actionパラメータの検証
    if (body.action !== 'select') {
      const response: ApiResponse<null> = {
        success: false,
        error: 'サポートされていないアクションです。"select"のみが有効です'
      };
      
      return NextResponse.json(response, { status: 400 });
    }
    
    const updatedAnswer = await selectBestAnswer(params.id);
    
    const response: ApiResponse<Answer> = {
      success: true,
      data: updatedAnswer
    };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error(`Failed to update answer ${params.id}:`, error);
    
    const response: ApiResponse<null> = {
      success: false,
      error: error instanceof Error ? error.message : '不明なエラーが発生しました'
    };
    
    return NextResponse.json(response, { status: 500 });
  }
}

// 回答削除 (DELETE /api/answers/[id])
export async function DELETE(
  request: Request,
  { params }: RouteParams
) {
  try {
    await deleteAnswer(params.id);
    
    const response: ApiResponse<null> = {
      success: true
    };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error(`Failed to delete answer ${params.id}:`, error);
    
    const response: ApiResponse<null> = {
      success: false,
      error: error instanceof Error ? error.message : '不明なエラーが発生しました'
    };
    
    return NextResponse.json(response, { status: 500 });
  }
} 