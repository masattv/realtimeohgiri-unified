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
  try {
    const { id } = await props.params;

    try {
      const topic = await getTopicById(id);

      if (!topic) {
        notFound();
      }

      // トピックIDに関連する回答を取得
      const answers = await getAnswersByTopicId(id);

      // クライアントコンポーネントにデータを渡す
      return <TopicClient initialTopic={topic} initialAnswers={answers} />;
    } catch (dbError: unknown) {
      console.error(`データベースエラー (トピックID: ${id}):`, dbError);
      const errorMessage = dbError instanceof Error ? dbError.message : '不明なエラー';
      throw new Error(`トピックの取得中にエラーが発生しました: ${errorMessage}`);
    }
  } catch (paramsError: unknown) {
    console.error("パラメータ取得エラー:", paramsError);
    throw new Error("ページパラメータの取得中にエラーが発生しました");
  }
} 