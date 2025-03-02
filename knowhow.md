# Next.js アプリケーションのエラー解決ノウハウ

このドキュメントでは、当プロジェクト（realtimeohgiri-unified）で発生したエラーとその解決方法について説明します。今後同様の問題が発生した場合の参考にしてください。

## 目次

1. [プリロードエラーの解決](#プリロードエラーの解決)
2. [ESLintエラーの解決](#eslintエラーの解決)
3. [Next.js設定エラーの解決](#nextjs設定エラーの解決)

## プリロードエラーの解決

### 問題
画像やCSSリソースのプリロードに関するエラー：「プリロードされたがウィンドウのロードイベントから数秒以内に使用されていない」

### 解決方法

1. **リソースプリロードの最適化**
   ```tsx
   // src/app/layout.tsx
   <head>
     <link 
       rel="preload"
       href="/next/static/css/app/layout.css"
       as="style"
       fetchPriority="high"
     />
     <meta name="next-size-adjust" />
   </head>
   ```

2. **画像処理の改善**
   - sharp ライブラリをインストール
   ```bash
   npm install --save-dev sharp
   ```
   - next.config.ts で開発環境では画像最適化を無効化
   ```typescript
   images: {
     domains: ['realtimeohgiri-unified.vercel.app'],
     unoptimized: process.env.NODE_ENV === 'development',
   }
   ```

3. **パフォーマンス設定の調整**
   ```typescript
   // next.config.ts
   webpack: (config) => {
     config.optimization = {
       ...config.optimization,
       moduleIds: 'deterministic',
     };
     return config;
   }
   ```

4. **フォントローディングの最適化**
   ```typescript
   // fonts.tsxなど
   const geistSans = Geist({
     variable: "--font-geist-sans",
     subsets: ["latin"],
     display: "swap", // フォントの表示方法を「swap」に設定
   });
   ```

## ESLintエラーの解決

### 問題
1. 未使用のインポートエラー
   ```
   'Suspense' is defined but never used. @typescript-eslint/no-unused-vars
   'dynamic' is defined but never used. @typescript-eslint/no-unused-vars
   ```

2. 不適切な型の使用（any型）
   ```
   Unexpected any. Specify a different type. @typescript-eslint/no-explicit-any
   ```

### 解決方法

1. **未使用のインポートを削除**
   ```typescript
   // 修正前
   import { useEffect, useState, Suspense } from 'react';
   import dynamic from 'next/dynamic';
   
   // 修正後
   import { useEffect, useState } from 'react';
   ```

2. **any型をunknown型に変更し、適切な型チェックを追加**
   ```typescript
   // 修正前
   catch (dbError: any) {
     console.error(`データベースエラー:`, dbError);
     throw new Error(`エラー: ${dbError.message}`);
   }
   
   // 修正後
   catch (dbError: unknown) {
     console.error(`データベースエラー:`, dbError);
     const errorMessage = dbError instanceof Error ? dbError.message : '不明なエラー';
     throw new Error(`エラー: ${errorMessage}`);
   }
   ```

## Next.js設定エラーの解決

### 問題
```
Invalid next.config.ts options detected:
Expected object, received boolean at "experimental.serverActions"
```

### 解決方法
1. **正しい設定形式に修正**
   ```typescript
   // 誤った設定
   experimental: {
     serverActions: true
   }
   
   // 正しい設定（Next.js 15.2.0以降）
   experimental: {
     serverActions: {
       allowedOrigins: ['localhost:3000']
     }
   }
   ```

2. **Turbopackの設定を適切に行う**
   - webpackとTurbopackの設定が競合する場合、どちらかに統一する
   ```typescript
   // package.jsonのスクリプト
   "dev": "next dev", // Turbopackを使用しない場合
   // または
   "dev": "next dev --turbopack", // Turbopackを使用する場合
   ```

## ベストプラクティス

1. **未使用のインポートを避ける**
   - 使用しないコンポーネントやフックは、インポートしない
   - 定期的にコードの整理とリファクタリングを行う

2. **型安全性を保つ**
   - `any`型は極力使用せず、具体的な型または`unknown`型を使用する
   - エラーハンドリングでは適切な型チェックを行う

3. **Next.jsの設定変更時の注意点**
   - 公式ドキュメントで最新のAPI仕様を確認する
   - 設定変更後は必ず動作確認を行う

4. **画像とスタイルの最適化**
   - 適切なプリロードヒントを使用する
   - 開発環境では不要な最適化を無効化してビルド時間を短縮する

## 参考リンク

- [Next.js公式ドキュメント](https://nextjs.org/docs)
- [TypeScriptのエラーハンドリングベストプラクティス](https://typescript-jp.gitbook.io/deep-dive/type-system/exceptions)
- [Next.jsのパフォーマンス最適化](https://nextjs.org/docs/app/building-your-application/optimizing) 