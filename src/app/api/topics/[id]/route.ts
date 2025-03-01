import { NextResponse } from 'next/server';
import { 
  getTopicById, 
  updateTopicStatus, 
  deleteTopic 
} from '@/services/topic-service';
import { ApiResponse, Topic } from '@/lib/types';

// URLパラメータの型定義
interface RouteParams {
  params: {
    id: string
  }
}

// 特定のトピック取得 (GET /api/topics/[id])
export async function GET(
  request: Request,
  { params }: RouteParams
) {
  try {
    const topic = await getTopicById(params.id);
    
    if (!topic) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'トピックが見つかりません'
      };
      
      return NextResponse.json(response, { status: 404 });
    }
    
    const response: ApiResponse<Topic> = {
      success: true,
      data: topic
    };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error(`Failed to fetch topic ${params.id}:`, error);
    
    const response: ApiResponse<null> = {
      success: false,
      error: error instanceof Error ? error.message : '不明なエラーが発生しました'
    };
    
    return NextResponse.json(response, { status: 500 });
  }
}

// トピック更新 (PATCH /api/topics/[id])
export async function PATCH(
  request: Request,
  { params }: RouteParams
) {
  try {
    const body = await request.json();
    
    // リクエストボディの検証
    if (typeof body.isActive !== 'boolean') {
      const response: ApiResponse<null> = {
        success: false,
        error: 'isActiveは必須かつboolean型である必要があります'
      };
      
      return NextResponse.json(response, { status: 400 });
    }
    
    const updatedTopic = await updateTopicStatus(params.id, body.isActive);
    
    const response: ApiResponse<Topic> = {
      success: true,
      data: updatedTopic
    };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error(`Failed to update topic ${params.id}:`, error);
    
    const response: ApiResponse<null> = {
      success: false,
      error: error instanceof Error ? error.message : '不明なエラーが発生しました'
    };
    
    return NextResponse.json(response, { status: 500 });
  }
}

// トピック削除 (DELETE /api/topics/[id])
export async function DELETE(
  request: Request,
  { params }: RouteParams
) {
  try {
    // トピックの存在確認
    const topic = await getTopicById(params.id);
    
    if (!topic) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'トピックが見つかりません'
      };
      
      return NextResponse.json(response, { status: 404 });
    }
    
    await deleteTopic(params.id);
    
    const response: ApiResponse<null> = {
      success: true
    };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error(`Failed to delete topic ${params.id}:`, error);
    
    const response: ApiResponse<null> = {
      success: false,
      error: error instanceof Error ? error.message : '不明なエラーが発生しました'
    };
    
    return NextResponse.json(response, { status: 500 });
  }
} 