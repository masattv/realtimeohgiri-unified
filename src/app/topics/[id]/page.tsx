import { notFound } from "next/navigation";
import { getTopicById } from "@/services/topic-service";
import { getAnswersByTopicId } from "@/services/answer-service";
import TopicClient from "./page-client";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface TopicPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function TopicPage(props: TopicPageProps) {
  const { id } = await props.params;

  const topic = await getTopicById(id);

  if (!topic) {
    notFound();
  }

  // トピックIDに関連する回答を取得
  const answers = await getAnswersByTopicId(id);

  // クライアントコンポーネントにデータを渡す
  return <TopicClient initialTopic={topic} initialAnswers={answers} />;
} 