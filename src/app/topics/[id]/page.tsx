import Link from "next/link";
import { notFound } from "next/navigation";
import { getTopicById } from "@/services/topic-service";

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

  // 回答を得点順にソート
  const sortedAnswers = [...(topic.answers || [])].sort((a, b) => {
    // まず選択されている回答を優先
    if (a.isSelected && !b.isSelected) return -1;
    if (!a.isSelected && b.isSelected) return 1;
    // 次に得点で降順ソート
    return b.score - a.score;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link
          href="/"
          className="text-blue-600 dark:text-blue-400 hover:underline mb-4 inline-block"
        >
          ← ホームに戻る
        </Link>
        <h1 className="text-2xl font-bold mb-2">お題: {topic.content}</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            投稿日: {new Date(topic.createdAt).toLocaleDateString('ja-JP')}
          </span>
          <span
            className={`inline-block text-xs px-2 py-1 rounded ${
              topic.isActive
                ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100"
                : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300"
            }`}
          >
            {topic.isActive ? "アクティブ" : "終了"}
          </span>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">回答一覧</h2>
        {sortedAnswers.length === 0 ? (
          <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg text-center">
            <p>まだ回答がありません。最初の回答者になりましょう！</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedAnswers.map((answer) => (
              <div
                key={answer.id}
                className={`p-4 rounded-lg border ${
                  answer.isSelected
                    ? "border-yellow-400 dark:border-yellow-600 bg-yellow-50 dark:bg-yellow-900/20"
                    : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="font-medium">{answer.content}</div>
                  <div className="flex items-center gap-2">
                    {answer.isSelected && (
                      <span className="bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-100 text-xs px-2 py-1 rounded">
                        ベスト回答
                      </span>
                    )}
                    <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 text-xs px-2 py-1 rounded">
                      {answer.score}点
                    </span>
                  </div>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(answer.createdAt).toLocaleString('ja-JP')}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {topic.isActive && (
        <div>
          <h2 className="text-xl font-semibold mb-4">回答を投稿する</h2>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
            <form
              className="space-y-4"
              action="/api/answers"
              method="POST"
            >
              <input type="hidden" name="topicId" value={topic.id} />
              <div>
                <label htmlFor="content" className="block mb-2 text-sm font-medium">
                  あなたの回答
                </label>
                <textarea
                  id="content"
                  name="content"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="面白い回答を入力してください..."
                  required
                ></textarea>
              </div>
              <div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  回答する
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 