# Todochi - プロジェクトドキュメント

## 概要

**Todochi** - Notion風タスク管理アプリ（React/Next.js学習用）

## 現在の状態

- **Phase 1: プロジェクト初期設定** - ✅ 完了
- **Phase 2: 認証機能** - ✅ 完了（Email/Password認証実装済み、ソーシャルログインは後回し）
- Phase 3〜12: 未着手

## 技術スタック

| カテゴリ | 技術 | バージョン |
|---------|------|-----------|
| フレームワーク | Next.js (App Router) | 14.2.28 |
| 言語 | TypeScript | ^5 |
| UI | Tailwind CSS | ^3.4.3 |
| アイコン | カスタムSVG | - |
| 認証 | Supabase Auth (@supabase/ssr) | - |
| バリデーション | Zod | - |
| (予定) D&D | dnd-kit | - |
| (予定) DB | Supabase (PostgreSQL) | - |
| (予定) テスト | Vitest + Playwright | - |
| (予定) デプロイ | Vercel | - |

### 技術的な決定事項

1. **MUI不採用**: Next.js 14/15とMUI 5/6/7の互換性問題（SSRでのuseContext null問題）があり、Phase 1ではTailwind CSSのみで実装。MUIは後のフェーズで検討可能。

2. **lucide-react不採用**: SSRビルド時にuseContext問題が発生したため、カスタムSVGアイコンコンポーネントを作成。

3. **Tailwind v3使用**: Tailwind v4はNext.js 14との互換性に問題があったためv3を使用。

4. **ビルド時の注意**: `NODE_ENV=production npm run build` で明示的に環境変数を設定する必要がある（開発環境の設定による）。

5. **認証フォーム**: React 18互換のため`useFormState`/`useFormStatus`を使用（React 19の`useActionState`ではなく）。

6. **Supabaseクライアント分離**: client.ts（ブラウザ用）、server.ts（Server Actions用）、middleware.ts（ミドルウェア用）の3種類を用途別に作成。

## ディレクトリ構成

```
todochi/
├── src/
│   ├── app/                          # App Router
│   │   ├── layout.tsx                # ルートレイアウト（AuthProvider）
│   │   ├── page.tsx                  # ホームページ
│   │   ├── not-found.tsx             # 404ページ
│   │   ├── globals.css               # グローバルスタイル
│   │   ├── (auth)/                   # 認証グループ（動的レンダリング）
│   │   │   ├── layout.tsx            # 認証ページ用レイアウト
│   │   │   ├── login/
│   │   │   │   ├── page.tsx          # ログインページ
│   │   │   │   └── actions.ts        # ログインServer Action
│   │   │   ├── signup/
│   │   │   │   ├── page.tsx          # サインアップページ
│   │   │   │   └── actions.ts        # サインアップServer Action
│   │   │   └── auth/confirm/
│   │   │       └── route.ts          # メール確認ハンドラー
│   │   └── (dashboard)/              # ダッシュボード（動的レンダリング）
│   │       ├── layout.tsx            # サイドバー付きレイアウト
│   │       └── projects/
│   │           ├── page.tsx          # プロジェクト一覧
│   │           └── [projectId]/
│   │               ├── page.tsx      # リスト表示
│   │               └── board/page.tsx # Kanban表示（スタブ）
│   │
│   ├── components/
│   │   ├── auth/
│   │   │   ├── LoginForm.tsx         # ログインフォーム
│   │   │   ├── SignupForm.tsx        # サインアップフォーム
│   │   │   └── UserMenu.tsx          # ユーザーメニュー
│   │   ├── icons/index.tsx           # カスタムSVGアイコン
│   │   └── ui/
│   │       └── Sidebar.tsx           # サイドバーコンポーネント
│   │
│   ├── contexts/
│   │   └── AuthContext.tsx           # 認証コンテキスト
│   │
│   ├── lib/supabase/
│   │   ├── client.ts                 # ブラウザ用クライアント
│   │   ├── server.ts                 # サーバー用クライアント
│   │   └── middleware.ts             # ミドルウェア用
│   │
│   ├── middleware.ts                 # Next.jsミドルウェア
│   │
│   └── types/
│       └── index.ts                  # 型定義（Task, Project, Tag, AuthUser等）
│
├── env.example                       # 環境変数テンプレート
├── tailwind.config.ts                # Tailwind設定
├── postcss.config.mjs                # PostCSS設定
├── next.config.mjs                   # Next.js設定
├── tsconfig.json                     # TypeScript設定
├── .eslintrc.json                    # ESLint設定
└── package.json
```

## 環境変数

`env.example`を`.env.local`にコピーして設定：

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Site URL (for authentication redirects)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## コマンド

```bash
# 開発サーバー起動
npm run dev

# 本番ビルド（NODE_ENV明示必須）
NODE_ENV=production npm run build

# 本番サーバー起動
npm run start

# Lint実行
npm run lint
```

## Supabase設定

### ダッシュボードで設定

1. **Authentication > Providers**: Email 有効化
2. **Authentication > URL Configuration**:
   - Site URL: `http://localhost:3000`
   - Redirect URLs: `http://localhost:3000/auth/confirm`

### profilesテーブル作成（SQL）

```sql
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

## データベース設計（予定）

```
profiles (users)
├── id (PK, UUID) → auth.users
├── email, name, avatar_url
└── created_at, updated_at

projects
├── id (PK, UUID)
├── name, description
├── owner_id (FK → profiles)
└── created_at, updated_at

tasks
├── id (PK, UUID)
├── title, description
├── status (todo/in_progress/done)
├── priority (low/medium/high)
├── due_date, position
├── project_id (FK → projects)
└── created_by (FK → profiles)

tags
├── id (PK, UUID)
├── name, color
└── project_id (FK → projects)

task_tags (N:M)
├── task_id (FK → tasks)
└── tag_id (FK → tags)
```

## 開発フェーズ

### Phase 1: プロジェクト初期設定 ✅ 完了
- [x] Next.js + TypeScript + Tailwind初期化
- [x] 基本レイアウト構造
- [x] Route Groups設定（(auth), (dashboard)）
- [x] カスタムアイコンコンポーネント
- [x] 型定義ファイル

### Phase 2: 認証機能 ✅ 完了
- [x] Supabaseクライアント（client/server/middleware分離）
- [x] AuthContext実装
- [x] ログイン/サインアップフォーム（Zod + Server Actions）
- [x] 認証ミドルウェア（保護ルート、リダイレクト）
- [x] メール確認ハンドラー
- [x] UserMenuコンポーネント
- [ ] ソーシャルログイン（Google, GitHub）← 後回し

### Phase 3: プロジェクトCRUD（次のステップ）
- [ ] プロジェクト一覧（Server Component）
- [ ] プロジェクト作成（Server Action）
- [ ] プロジェクト詳細（Dynamic Route）
- [ ] 編集/削除機能
- [ ] Loading UI、Error Boundary

### Phase 4: タスクCRUD
- [ ] タスク一覧表示（リスト形式）
- [ ] タスク作成フォーム（モーダル）
- [ ] タスク詳細/編集/削除
- [ ] ステータス・優先度設定

### Phase 5: タグ/ラベル機能
- [ ] タグ管理UI（CRUD）
- [ ] カラーピッカー
- [ ] タスクへのタグ付け

### Phase 6: 期限日設定
- [ ] DatePicker統合
- [ ] 期限切れ表示
- [ ] 今日/今週フィルター

### Phase 7: 検索・フィルター
- [ ] 検索バー（デバウンス付き）
- [ ] ステータス/優先度/タグフィルター
- [ ] URLパラメータ同期

### Phase 8: Kanbanボード
- [ ] dnd-kit設定
- [ ] KanbanBoard/Column/Card
- [ ] カラム間ドラッグ（ステータス変更）
- [ ] カラム内並び替え（position）
- [ ] Optimistic UI

### Phase 9: 表示切り替え
- [ ] ViewToggleコンポーネント
- [ ] URLパラメータでモード管理

### Phase 10: ダークモード
- [ ] ThemeContext実装
- [ ] Tailwindダークモード
- [ ] システム設定連携
- [ ] 切り替えUI

### Phase 11: テスト
- [ ] Vitest設定 + コンポーネントテスト
- [ ] カスタムフックテスト
- [ ] Playwright E2Eテスト

### Phase 12: デプロイ
- [ ] Vercelデプロイ
- [ ] 環境変数設定
- [ ] パフォーマンス最適化

## 重要ファイル

| ファイル | 役割 |
|---------|------|
| `src/app/layout.tsx` | ルートレイアウト、AuthProvider |
| `src/app/(dashboard)/layout.tsx` | サイドバー付きレイアウト |
| `src/middleware.ts` | 認証ミドルウェア |
| `src/contexts/AuthContext.tsx` | 認証状態管理 |
| `src/lib/supabase/` | Supabaseクライアント群 |
| `src/components/ui/Sidebar.tsx` | ナビゲーションサイドバー |
| `src/components/auth/` | 認証関連コンポーネント |
| `src/components/icons/index.tsx` | カスタムSVGアイコン |
| `src/types/index.ts` | 型定義（Task, Project, Tag, AuthUser等） |

## 既知の問題・注意点

1. **NODE_ENV警告**: 開発環境で非標準のNODE_ENV値が設定されている可能性。ビルド時は `NODE_ENV=production` を明示的に指定。

2. **Next.js脆弱性警告**: Next.js 14.2.28にセキュリティ脆弱性の警告あり。本番デプロイ前にパッチ適用版への更新を検討。

3. **MUI統合**: 将来的にMUIを使用する場合は、Emotion CacheのApp Router対応設定が必要。

4. **Supabase環境変数**: ビルド時に環境変数がない場合、ミドルウェアはパススルーするよう設計されている。本番環境では必ず設定が必要。

## 参考リソース

- [Next.js App Router](https://nextjs.org/docs/app)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Supabase Auth for Next.js](https://supabase.com/docs/guides/auth/server-side/nextjs)
- [dnd-kit](https://dndkit.com/)

---
最終更新: 2026-01-30
Phase 2完了時点
