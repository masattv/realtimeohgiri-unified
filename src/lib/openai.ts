import OpenAI from 'openai';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY environment variable is not set');
}

// OpenAIのクライアントインスタンスを作成
export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 大喜利回答の評価関数
export async function evaluateAnswer(topic: string, answer: string): Promise<number> {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { 
          role: 'system', 
          content: '大喜利の回答を0〜10点で評価してください。面白さ、意外性、的確さを総合的に判断してください。数字のみを返してください。' 
        },
        { 
          role: 'user', 
          content: `お題: ${topic}\n回答: ${answer}` 
        }
      ],
      temperature: 0.7,
      max_tokens: 5
    });

    const scoreText = response.choices[0]?.message.content?.trim() || '0';
    const score = parseInt(scoreText, 10);
    return isNaN(score) ? 0 : Math.min(Math.max(score, 0), 10);
  } catch (error) {
    console.error('Error evaluating answer:', error);
    return 0;
  }
}

// 大喜利のお題を自動生成する関数
export async function generateTopic(): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { 
          role: 'system', 
          content: '面白い大喜利のお題を考えてください。短く、シンプルで、多様な回答が可能なお題にしてください。お題のみを返してください。' 
        },
        { 
          role: 'user', 
          content: '大喜利のお題を1つ考えてください。例: 「AIが人間に勝ったときの一言」「最強の乗り物の名前とその特徴」など' 
        }
      ],
      temperature: 0.9,
      max_tokens: 100
    });

    return response.choices[0]?.message.content?.trim() || '一番美味しい食べ物の意外な使い方は？';
  } catch (error) {
    console.error('Error generating topic:', error);
    return '一番美味しい食べ物の意外な使い方は？'; // エラー時のデフォルトお題
  }
}

// AIによる回答の評価コメント生成関数
export async function generateReviewComment(topic: string, answer: string, score: number): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { 
          role: 'system', 
          content: `大喜利の回答に対する短いレビューコメントを書いてください。この回答は${score}点（10点満点）です。` 
        },
        { 
          role: 'user', 
          content: `お題: ${topic}\n回答: ${answer}\n\n50文字以内で簡潔なレビューを書いてください。` 
        }
      ],
      temperature: 0.7,
      max_tokens: 100
    });

    return response.choices[0]?.message.content?.trim() || '面白い回答ですね！';
  } catch (error) {
    console.error('Error generating review comment:', error);
    return '面白い回答ですね！'; // エラー時のデフォルトコメント
  }
} 