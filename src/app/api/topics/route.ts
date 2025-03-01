import { NextResponse } from 'next/server';
import { 
  getAllTopics, 
  getActiveTopics, 
  createTopic 
} from '@/services/topic-service';
import { ApiResponse, Topic, CreateTopicInput } from '@/lib/types';

// トピック一覧取得 (GET /api/topics)
export async function GET(
  request: Request
) {
  try {
    // URLからクエリパラメータを取得
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get('active') === 'true';
    
    // アクティブなトピックのみを取得するかどうかで分岐
    const topics = activeOnly 
      ? await getActiveTopics() 
      : await getAllTopics();
    
    const response: ApiResponse<Topic[]> = {
      success: true,
      data: topics
    };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Failed to fetch topics:', error);
    
    const response: ApiResponse<null> = {
      success: false,
      error: error instanceof Error ? error.message : '不明なエラーが発生しました'
    };
    
    return NextResponse.json(response, { status: 500 });
  }
}

// トピック作成 (POST /api/topics)
export async function POST(
  request: Request
) {
  try {
    const body = await request.json();
    
    // リクエストボディの検証
    if (!body.content || typeof body.content !== 'string') {
      const response: ApiResponse<null> = {
        success: false,
        error: 'トピックの内容は必須です'
      };
      
      return NextResponse.json(response, { status: 400 });
    }
    
    const topicData: CreateTopicInput = {
      content: body.content
    };
    
    const newTopic = await createTopic(topicData);
    
    const response: ApiResponse<Topic> = {
      success: true,
      data: newTopic
    };
    
    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('Failed to create topic:', error);
    
    const response: ApiResponse<null> = {
      success: false,
      error: error instanceof Error ? error.message : '不明なエラーが発生しました'
    };
    
    return NextResponse.json(response, { status: 500 });
  }
} 