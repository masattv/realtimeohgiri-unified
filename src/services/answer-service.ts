import { db } from '@/lib/db';
import { CreateAnswerInput, Answer } from '@/lib/types';
import { evaluateAnswer, generateReviewComment } from '@/lib/openai';
import { Prisma } from '@prisma/client';

export async function getAnswersByTopicId(topicId: string): Promise<Answer[]> {
  return db.answer.findMany({
    where: {
      topicId,
    },
    orderBy: [
      {
        score: 'desc',
      },
      {
        createdAt: 'desc',
      },
    ],
    include: {
      topic: true,
    },
  });
}

export async function createAnswer(data: CreateAnswerInput): Promise<Answer> {
  // トピックの存在確認
  const topic = await db.topic.findUnique({
    where: { id: data.topicId },
  });

  if (!topic) {
    throw new Error('トピックが見つかりません');
  }

  if (!topic.isActive) {
    throw new Error('このトピックは現在アクティブではありません');
  }

  // OpenAIで回答を評価
  const score = await evaluateAnswer(topic.content, data.content);
  
  // 評価コメントを生成
  const reviewComment = await generateReviewComment(topic.content, data.content, score);

  // 回答を作成
  return db.answer.create({
    data: {
      content: data.content,
      topicId: data.topicId,
      score,
      reviewComment,
    },
  });
}

export async function selectBestAnswer(answerId: string): Promise<Answer> {
  // 回答の存在確認
  const answer = await db.answer.findUnique({
    where: { id: answerId },
    include: { topic: true },
  });

  if (!answer) {
    throw new Error('回答が見つかりません');
  }

  // トランザクションを使用して、同じトピックの他の回答のisSelectedをfalseに設定
  return db.$transaction(async (tx: Prisma.TransactionClient) => {
    // 同じトピックの他の回答をリセット
    await tx.answer.updateMany({
      where: {
        topicId: answer.topicId,
        id: { not: answerId },
      },
      data: {
        isSelected: false,
      },
    });

    // 選択された回答をマーク
    return tx.answer.update({
      where: { id: answerId },
      data: {
        isSelected: true,
      },
    });
  });
}

export async function deleteAnswer(id: string): Promise<void> {
  await db.answer.delete({
    where: { id },
  });
} 