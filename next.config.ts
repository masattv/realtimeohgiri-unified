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
  // Turbopackの設定（dev:turboコマンド用）
  // これにより、TurbopackとWebpackの競合警告が解消されます
  turbo: {
    // TurbopackとWebpackの競合を解消するための設定
    resolveAlias: {
      // 必要に応じて追加のエイリアス設定を行う
    },
  },
  // serverActionsの設定を修正
  experimental: {
    serverActions: {
      allowedOrigins: [
        'localhost:3000', 
        'localhost:3001', 
        'localhost:3002', 
        'localhost:3003',
        'realtimeohgiri-unified.vercel.app'
      ]
    }
  }
};

export default nextConfig;
