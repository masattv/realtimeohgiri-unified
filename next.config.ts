import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['realtimeohgiri-unified.vercel.app'],
    // プリロードの問題を軽減するためにImageの最適化設定
    unoptimized: process.env.NODE_ENV === 'development',
  },
  // 静的アセットのキャッシュを制御
  assetPrefix: process.env.NODE_ENV === 'production' ? 'https://realtimeohgiri-unified.vercel.app' : undefined,
  // バンドラー分析ツールを無効化（エラーの原因となる可能性がある）
  webpack: (config) => {
    // パフォーマンス設定を追加
    config.optimization = {
      ...config.optimization,
      moduleIds: 'deterministic',
    };
    return config;
  },
  // serverActionsの設定をオブジェクト形式で追加
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', 'localhost:3001', 'localhost:3002']
    }
  }
};

export default nextConfig;
