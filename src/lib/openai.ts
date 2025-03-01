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