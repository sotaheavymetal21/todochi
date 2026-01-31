# Todochi 開発セッションログ

## セッション: 2026-01-30 - Phase 2 認証機能実装

### 実施内容

#### 1. 依存関係のインストール
```bash
npm install @supabase/ssr @supabase/supabase-js zod
```
- `@supabase/ssr`: Next.js App Router用のSupabaseクライアント
- `@supabase/supabase-js`: Supabase JavaScript SDK
- `zod`: スキーマバリデーション

#### 2. 環境変数テンプレート作成
- `env.example` を作成（.env.localとしてコピーして使用）
- 必要な環境変数:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `NEXT_PUBLIC_SITE_URL`

#### 3. Supabaseクライアント作成
3種類のクライアントを用途別に作成：

| ファイル | 用途 | 特徴 |
|---------|------|------|
| `src/lib/supabase/client.ts` | ブラウザ（Client Components） | シングルトン、環境変数チェック付き |
| `src/lib/supabase/server.ts` | サーバー（Server Actions, Route Handlers） | cookies()使用 |
| `src/lib/supabase/middleware.ts` | ミドルウェア | セッションリフレッシュ、認証チェック |

#### 4. Next.js Middleware実装
`src/middleware.ts`:
- トークン自動リフレッシュ
- 保護ルート（/projects/*）への未認証アクセスを/loginへリダイレクト
- 認証済みユーザーを/login, /signupから/projectsへリダイレクト
- `redirectTo`パラメータでログイン後のリダイレクト先を保持

#### 5. AuthContext実装
`src/contexts/AuthContext.tsx`:
- `useAuth()`フック提供: `{ user, loading, signOut }`
- `onAuthStateChange`でリアルタイム認証状態同期
- 環境変数未設定時のグレースフルデグレード対応

#### 6. 認証フォーム作成

**ログイン** (`src/app/(auth)/login/`):
- `actions.ts`: Server Action（Zodバリデーション）
- `page.tsx`: ログインページ
- `LoginForm.tsx`: フォームコンポーネント

**サインアップ** (`src/app/(auth)/signup/`):
- `actions.ts`: Server Action（パスワード強度チェック含む）
- `page.tsx`: サインアップページ
- `SignupForm.tsx`: フォームコンポーネント（成功時メール確認メッセージ表示）

**バリデーションルール**:
- Email: 有効なメールアドレス形式
- Password: 8文字以上、英字・数字を含む
- Name: 必須

#### 7. メール確認ハンドラー
`src/app/(auth)/auth/confirm/route.ts`:
- Supabaseからのメール確認リンクを処理
- `verifyOtp`でトークン検証
- 成功時: /projects へリダイレクト
- 失敗時: /login?error=confirmation_failed へリダイレクト

#### 8. UI更新

**Sidebar** (`src/components/ui/Sidebar.tsx`):
- UserMenuコンポーネントを下部に追加

**UserMenu** (`src/components/auth/UserMenu.tsx`):
- ユーザー名・メールアドレス表示
- ログアウトボタン
- ローディング状態対応

**アイコン追加** (`src/components/icons/index.tsx`):
- `UserIcon`: ユーザーアバター用
- `LogoutIcon`: ログアウトボタン用

**RootLayout** (`src/app/layout.tsx`):
- `AuthProvider`でアプリ全体をラップ

#### 9. 型定義追加
`src/types/index.ts`:
```typescript
export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  avatar_url: string | null;
  email_confirmed_at: string | null;
  created_at: string;
}
```

### 解決した問題

#### 1. useActionState互換性問題
- **問題**: `useActionState`はReact 19の機能でReact 18では使用不可
- **解決**: `useFormState` + `useFormStatus`（react-dom）を使用

#### 2. ビルド時の環境変数エラー
- **問題**: ビルド時にSupabase環境変数がないとエラー
- **解決**:
  - 認証・ダッシュボードレイアウトに`export const dynamic = "force-dynamic"`を追加
  - ミドルウェアで環境変数未設定時はパススルー

#### 3. ESLint require()エラー
- **問題**: 動的インポートに`require()`を使用したらESLintエラー
- **解決**: 直接`createBrowserClient`をインポートして条件分岐で使用

### ファイル一覧（変更・追加）

```
新規作成:
├── env.example
├── src/
│   ├── middleware.ts
│   ├── contexts/
│   │   └── AuthContext.tsx
│   ├── lib/supabase/
│   │   ├── client.ts
│   │   ├── server.ts
│   │   └── middleware.ts
│   ├── app/(auth)/
│   │   ├── login/actions.ts
│   │   ├── signup/actions.ts
│   │   └── auth/confirm/route.ts
│   └── components/auth/
│       ├── LoginForm.tsx
│       ├── SignupForm.tsx
│       └── UserMenu.tsx

更新:
├── package.json (依存関係追加)
├── CLAUDE.md (Phase 2完了を反映)
├── src/
│   ├── app/
│   │   ├── layout.tsx (AuthProvider追加)
│   │   ├── (auth)/
│   │   │   ├── layout.tsx (dynamic = "force-dynamic")
│   │   │   ├── login/page.tsx (LoginForm使用)
│   │   │   └── signup/page.tsx (SignupForm使用)
│   │   └── (dashboard)/
│   │       └── layout.tsx (dynamic = "force-dynamic")
│   ├── components/
│   │   ├── ui/Sidebar.tsx (UserMenu追加)
│   │   └── icons/index.tsx (UserIcon, LogoutIcon追加)
│   └── types/index.ts (AuthUser型追加)
```

### 次回セッションへの引き継ぎ事項

#### 即座に必要な作業（ユーザー側）
1. **Supabaseプロジェクト作成**
   - https://supabase.com でプロジェクト作成
   - Project URL と anon key を取得

2. **環境変数設定**
   ```bash
   cp env.example .env.local
   # .env.local を編集してSupabaseの値を設定
   ```

3. **Supabaseダッシュボード設定**
   - Authentication > Providers > Email 有効化
   - Authentication > URL Configuration:
     - Site URL: `http://localhost:3000`
     - Redirect URLs: `http://localhost:3000/auth/confirm`

4. **profilesテーブル作成**
   - SQL Editor で CLAUDE.md に記載のSQLを実行

#### Phase 3: プロジェクトCRUD（次のフェーズ）

**実装予定**:
1. projectsテーブル作成（Supabase）
2. プロジェクト一覧ページ（Server Component）
3. プロジェクト作成フォーム（Server Action）
4. プロジェクト詳細ページ
5. 編集・削除機能
6. Loading UI、Error Boundary

**参考設計**:
```sql
CREATE TABLE projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own projects" ON projects
  FOR ALL USING (auth.uid() = owner_id);
```

### 技術的メモ

#### Supabase Auth フロー
```
1. サインアップ
   → signUp() → 確認メール送信 → /auth/confirm でトークン検証 → /projects

2. ログイン
   → signInWithPassword() → セッションCookie設定 → /projects

3. ページアクセス
   → middleware → getUser()でJWT検証 → 認証状態に応じてリダイレクト

4. ログアウト
   → signOut() → セッションCookie削除 → /login
```

#### React 18 Server Actions パターン
```tsx
// actions.ts
"use server";
export async function myAction(prevState: State, formData: FormData): Promise<State> {
  // バリデーション → DB操作 → redirect() or return state
}

// Form.tsx
"use client";
import { useFormState, useFormStatus } from "react-dom";

function SubmitButton() {
  const { pending } = useFormStatus();
  return <button disabled={pending}>Submit</button>;
}

export default function Form() {
  const [state, formAction] = useFormState(myAction, initialState);
  return <form action={formAction}>...</form>;
}
```

---
作成日: 2026-01-30
