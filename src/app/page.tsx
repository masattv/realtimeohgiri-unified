import Link from "next/link";
import { getActiveTopics } from "@/services/topic-service";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Home() {
  const topics = await getActiveTopics();

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">リアルタイム大喜利</h1>
        <p className="text-gray-600 dark:text-gray-400">
          面白いお題に回答して、みんなで盛り上がろう！
        </p>
      </header>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">アクティブなお題</h2>
        {topics.length === 0 ? (
          <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg text-center">
            <p>現在アクティブなお題はありません。</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {topics.map((topic) => (
              <Link
                key={topic.id}
                href={`/topics/${topic.id}`}
                className="block bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="font-medium mb-2">{topic.content}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  回答数: {topic.answers?.length || 0}
                </div>
                <div className="mt-4">
                  <span className="inline-block bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 text-xs px-2 py-1 rounded">
                    アクティブ
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">お題を投稿する</h2>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <form className="space-y-4" action="/api/topics" method="POST">
            <div>
              <label htmlFor="content" className="block mb-2 text-sm font-medium">
                お題の内容
              </label>
              <textarea
                id="content"
                name="content"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="面白いお題を入力してください..."
                required
              ></textarea>
            </div>
            <div>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                投稿する
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
