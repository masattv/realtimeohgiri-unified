import { notFound } from "next/navigation";
import { getTopicById } from "@/services/topic-service";
import { getAnswersByTopicId } from "@/services/answer-service";
import TopicClient from "./page-client";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface TopicPageProps {
  params: {
    id: string;
  };
}

export default async function TopicPage({ params }: TopicPageProps) {
  const topic = await getTopicById(params.id);

  if (!topic) {
    notFound();
  }

  // トピックIDに関連する回答を取得
  const answers = await getAnswersByTopicId(params.id);

  // クライアントコンポーネントにデータを渡す
  return <TopicClient initialTopic={topic} initialAnswers={answers} />;
} 