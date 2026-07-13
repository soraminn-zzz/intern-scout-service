# intern-scout-service

インターン生と企業をマッチングするスカウトサービスのプロトタイプです。

バックエンドは Rails API、フロントエンドは Next.js で実装しています。

## 技術構成

- Backend: Ruby on Rails API
- Frontend: Next.js / TypeScript
- Database: SQLite
- API: REST API
- Repository: Monorepo

## 主な機能

### 必須要件

- インターン生登録
- 企業登録
- ログイン
- インターン生プロフィール登録・編集
- 企業によるインターン生一覧・詳細閲覧
- 企業からインターン生へのスカウトメッセージ送信
- メッセージ一覧・詳細確認

### 追加機能

- 企業による募集掲載
- 募集一覧・詳細表示
- 募集検索・絞り込み
  - キーワード
  - 勤務地
  - 必要スキル
- 企業によるインターン生お気に入り保存
- インターン生による募集保存
- メッセージ既読管理

## 画面

```text
/                       トップページ
/register               ユーザー登録
/login                  ログイン
/dashboard              ダッシュボード
/profile                インターン生プロフィール編集
/interns                企業向けインターン生一覧
/interns/:id            インターン生詳細・スカウト送信
/favorite-interns       企業向けお気に入りインターン生一覧
/jobs                   募集一覧・検索
/jobs/:id               募集詳細
/company/jobs/new       企業向け募集掲載
/saved-jobs             インターン生向け保存済み募集
/messages               メッセージ一覧
/messages/:id           メッセージ詳細
```

## ディレクトリ構成

```text
intern-scout-service/
├── backend/     # Rails API
├── frontend/    # Next.js
├── README.md
└── .gitignore
```

## DB設計

### users

インターン生と企業を `role` で区別します。

```text
id
name
email
password_digest
auth_token_digest
role
created_at
updated_at
```

### intern_profiles

```text
id
user_id
school_name
graduation_year
bio
skills
desired_position
created_at
updated_at
```

### company_profiles

```text
id
user_id
company_name
description
website_url
created_at
updated_at
```

### messages

```text
id
sender_id
receiver_id
body
read_at
created_at
updated_at
```

### job_posts

```text
id
company_id
title
description
required_skills
location
is_active
created_at
updated_at
```

### favorite_interns

企業がお気に入り登録したインターン生を管理します。

```text
id
company_id
intern_id
created_at
updated_at
```

### saved_job_posts

インターン生が保存した募集を管理します。

```text
id
intern_id
job_post_id
created_at
updated_at
```

## API

### 認証

```text
POST /api/v1/register
POST /api/v1/login
GET  /api/v1/me
```

認証が必要なAPIでは、登録・ログイン時に返る token を指定します。

```text
Authorization: Bearer <token>
```

### インターン生プロフィール

```text
GET   /api/v1/intern_profile
PATCH /api/v1/intern_profile
```

### インターン生閲覧

```text
GET /api/v1/interns
GET /api/v1/interns/:id
```

### メッセージ

```text
GET  /api/v1/messages
GET  /api/v1/messages/:id
POST /api/v1/messages
```

### 募集

```text
GET   /api/v1/job_posts
GET   /api/v1/job_posts/:id
POST  /api/v1/job_posts
PATCH /api/v1/job_posts/:id
```

募集一覧は以下のクエリで絞り込みできます。

```text
GET /api/v1/job_posts?keyword=rails&location=tokyo&skill=ruby
```

### お気に入り

```text
GET    /api/v1/favorite_interns
POST   /api/v1/favorite_interns
DELETE /api/v1/favorite_interns/:id
```

### 保存済み募集

```text
GET    /api/v1/saved_job_posts
POST   /api/v1/saved_job_posts
DELETE /api/v1/saved_job_posts/:id
```

## 起動方法

### Backend

```powershell
cd backend
rails server -p 3000
```

### Frontend

別のターミナルで起動します。

```powershell
cd frontend
npm run dev -- -p 3001
```

ブラウザで以下を開きます。

```text
http://localhost:3001
```

## 動作確認の流れ

1. `/register` でインターン生として登録する
2. `/profile` でプロフィールを登録する
3. ログアウトする
4. `/register` で企業として登録する
5. `/interns` でインターン生一覧を確認する
6. `/interns/:id` からスカウトメッセージを送信する
7. `/company/jobs/new` から募集を掲載する
8. `/jobs` で募集検索・絞り込みを確認する
9. インターン生でログインし直し、`/messages` でメッセージを確認する
10. `/jobs` で募集を保存し、`/saved-jobs` で確認する

## テスト・検証

### Backend

```powershell
cd backend
rails test
```

### Frontend

```powershell
cd frontend
npm run lint
npm run build
```

## 実装メモ

- Rails API と Next.js を分離し、REST API で連携しています。
- ユーザーは `users.role` で `intern` と `company` を管理しています。
- 認証はプロトタイプ向けに Bearer token を利用しています。
- 企業だけがインターン生へスカウトメッセージを送信できます。
- 企業だけが募集を掲載できます。
- インターン生は募集を保存でき、企業はインターン生をお気に入り保存できます。
