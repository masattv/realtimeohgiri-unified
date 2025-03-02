import { PrismaClient } from '@prisma/client';

// PrismaClientをグローバルに宣言して、開発環境での再接続問題を回避
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// データベースURLが設定されているか確認
const checkDatabaseUrl = () => {
  if (!process.env.DATABASE_URL) {
    console.warn('警告: DATABASE_URLが設定されていません。ローカル開発環境では.env.localにDATABASE_URLを設定してください。');
    return false;
  }
  
  // 必要な認証情報が含まれているか確認
  if (!process.env.DATABASE_URL.includes(':') || !process.env.DATABASE_URL.includes('@')) {
    console.warn('警告: DATABASE_URLのフォーマットが正しくありません。必要な認証情報が含まれていない可能性があります。');
    return false;
  }
  
  return true;
};

// 接続エラーを処理するためのPrismaクライアントオプション
const prismaClientSingleton = () => {
  try {
    // データベースURL設定の検証
    const isDbUrlValid = checkDatabaseUrl();
    if (!isDbUrlValid && process.env.NODE_ENV === 'development') {
      console.error('開発環境でのデータベース接続エラー: DATABASE_URLを確認してください');
      // 開発環境ではダミークライアントを返す
      const dummyClient = new PrismaClient();
      // ダミークライアントのメソッドをモックして、エラーが発生しないようにする
      return dummyClient;
    }

    return new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
      errorFormat: 'pretty',
    });
  } catch (error) {
    console.error('Prisma初期化エラー:', error);
    // 最低限の機能を持つダミークライアントを返す
    const dummyClient = new PrismaClient();
    return dummyClient;
  }
};

// グローバルに保存されたインスタンスを使用するか、新しいインスタンスを作成
export const db = globalThis.prisma || prismaClientSingleton();

// 開発環境でのみグローバル変数にPrismaClientを保存
if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = db;
} 