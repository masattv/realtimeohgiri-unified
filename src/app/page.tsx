import { getActiveTopics } from "@/services/topic-service";
import HomeClient from "./page-client";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Home() {
  try {
    const topics = await getActiveTopics();
    
    // クライアントコンポーネントにデータを渡す
    return <HomeClient initialTopics={topics} />;
  } catch (error) {
    console.error("トピック取得エラー:", error);
    
    // エラーが発生した場合は空の配列を渡す
    return <HomeClient initialTopics={[]} />;
  }
}
