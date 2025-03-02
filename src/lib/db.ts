import { PrismaClient } from '@prisma/client';

// PrismaClientをグローバルに宣言して、開発環境での再接続問題を回避
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// 接続エラーを処理するためのPrismaクライアントオプション
const prismaClientSingleton = () => {
  try {
    return new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
      errorFormat: 'pretty',
    });
  } catch (error) {
    console.error('Prisma初期化エラー:', error);
    // 最低限の機能を持つダミークライアントを返す
    return new PrismaClient();
  }
};

// グローバルに保存されたインスタンスを使用するか、新しいインスタンスを作成
export const db = globalThis.prisma || prismaClientSingleton();

// 開発環境でのみグローバル変数にPrismaClientを保存
if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = db;
} 