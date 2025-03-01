import { PrismaClient } from '@prisma/client';

// PrismaClientをグローバルに宣言して、開発環境での再接続問題を回避
declare global {
  var prisma: PrismaClient | undefined;
}

// グローバルに保存されたインスタンスを使用するか、新しいインスタンスを作成
export const db = globalThis.prisma || new PrismaClient();

// 開発環境でのみグローバル変数にPrismaClientを保存
if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = db;
} 