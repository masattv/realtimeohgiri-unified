'use client';

import { useState, useEffect } from 'react';
import { Topic } from '@/lib/types';
import Link from 'next/link';
import { subscribeToTopics } from '@/lib/supabase';

interface AdminDashboardProps {
  initialTopics: Topic[];
  initialActiveTopics: Topic[];
}

export default function AdminDashboard({ initialTopics, initialActiveTopics }: AdminDashboardProps) {
  const [topics, setTopics] = useState<Topic[]>(initialTopics);
  const [, setActiveTopics] = useState<Topic[]>(initialActiveTopics);
  const [newTopicContent, setNewTopicContent] = useState('');
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    // トピックの変更をリアルタイムに監視
    const subscription = subscribeToTopics(() => {
      fetchTopics();
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  const fetchTopics = async () => {
    try {
      // すべてのトピックを取得
      const allResponse = await fetch('/api/topics');
      const allData = await allResponse.json();
      
      // アクティブなトピックを取得
      const activeResponse = await fetch('/api/topics?active=true');
      const activeData = await activeResponse.json();
      
      if (allData.success) {
        setTopics(allData.data);
      }
      
      if (activeData.success) {
        setActiveTopics(activeData.data);
      }
    } catch (error) {
      console.error('トピックの取得に失敗しました:', error);
    }
  };
  
  const handleCreateTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newTopicContent.trim()) return;
    
    setLoading(true);
    
    try {
      const response = await fetch('/api/topics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: newTopicContent }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setNewTopicContent('');
        fetchTopics();
      }
    } catch (error) {
      console.error('トピックの作成に失敗しました:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleGenerateTopic = async () => {
    setLoading(true);
    
    try {
      const response = await fetch('/api/cron/generate-topic', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      
      if (data.success) {
        fetchTopics();
      }
    } catch (error) {
      console.error('トピックの自動生成に失敗しました:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleToggleActive = async (topicId: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/topics/${topicId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: !isActive }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        fetchTopics();
      }
    } catch (error) {
      console.error('トピックのステータス変更に失敗しました:', error);
    }
  };
  
  const handleDeleteTopic = async (topicId: string) => {
    if (!confirm('本当にこのトピックを削除しますか？関連する回答もすべて削除されます。')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/topics/${topicId}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (data.success) {
        fetchTopics();
      }
    } catch (error) {
      console.error('トピックの削除に失敗しました:', error);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">管理者ダッシュボード</h1>
          <Link 
            href="/"
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
          >
            ホームに戻る
          </Link>
        </div>
        <p className="text-gray-600">トピックの管理や新しいお題の作成ができます</p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* 左カラム: 新しいトピックの作成 */}
        <div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm mb-6">
            <h2 className="text-xl font-semibold mb-4">新しいお題を作成</h2>
            <form onSubmit={handleCreateTopic} className="space-y-4">
              <div>
                <label htmlFor="content" className="block mb-2 text-sm font-medium">
                  お題の内容
                </label>
                <textarea
                  id="content"
                  rows={3}
                  value={newTopicContent}
                  onChange={(e) => setNewTopicContent(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="面白いお題を入力してください..."
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? '処理中...' : 'トピックを作成'}
              </button>
            </form>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">AIによるお題自動生成</h2>
            <p className="mb-4 text-sm text-gray-600">
              AIによって新しいお題を自動生成します。既存のアクティブなお題は非アクティブになります。
            </p>
            <button
              onClick={handleGenerateTopic}
              disabled={loading}
              className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
            >
              {loading ? '生成中...' : 'AIでお題を生成'}
            </button>
          </div>
        </div>
        
        {/* 右カラム: トピック一覧 */}
        <div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">トピック管理</h2>
            
            {topics.length === 0 ? (
              <p className="text-center text-gray-500 py-4">トピックがありません</p>
            ) : (
              <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {topics.map((topic) => (
                  <li key={topic.id} className="py-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <p className="font-medium">{topic.content}</p>
                        <p className="text-sm text-gray-500">
                          作成日時: {new Date(topic.createdAt).toLocaleString('ja-JP')}
                        </p>
                        <div className="flex space-x-2">
                          {topic.isActive ? (
                            <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                              アクティブ
                            </span>
                          ) : (
                            <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                              非アクティブ
                            </span>
                          )}
                          {topic.isAutoGenerated && (
                            <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                              AI生成
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleToggleActive(topic.id, topic.isActive)}
                          className={`px-3 py-1 text-xs rounded ${
                            topic.isActive
                              ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                              : 'bg-green-100 text-green-800 hover:bg-green-200'
                          }`}
                        >
                          {topic.isActive ? '非アクティブにする' : 'アクティブにする'}
                        </button>
                        <button
                          onClick={() => handleDeleteTopic(topic.id)}
                          className="px-3 py-1 text-xs bg-red-100 text-red-800 rounded hover:bg-red-200"
                        >
                          削除
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 