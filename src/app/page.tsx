import { getActiveTopics } from "@/services/topic-service";
import HomeClient from "./page-client";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Home() {
  const topics = await getActiveTopics();

  // クライアントコンポーネントにデータを渡す
  return <HomeClient initialTopics={topics} />;
}
