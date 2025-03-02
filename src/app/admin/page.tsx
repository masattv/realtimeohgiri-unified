import { getActiveTopics, getAllTopics } from '@/services/topic-service';
import AdminDashboard from './admin-dashboard';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminPage() {
  // すべてのトピックを取得
  const allTopics = await getAllTopics();
  
  // アクティブなトピックを取得
  const activeTopics = await getActiveTopics();
  
  return (
    <AdminDashboard 
      initialTopics={allTopics}
      initialActiveTopics={activeTopics}
    />
  );
} 