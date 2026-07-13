# intern-scout-service

インターン生と企業をマッチングするスカウトサービスのプロトタイプです。

Rails API と Next.js を分離した構成で開発します。

## 技術構成

- Backend: Ruby on Rails API
- Frontend: Next.js
- Database: 未定（開発初期は SQLite、提出時は PostgreSQL も検討）
- API: REST API
- Repository: Monorepo

## 作る機能

### 必須機能

- インターン生が登録できる
- 企業が登録できる
- 企業がインターン生一覧を閲覧できる
- 企業がインターン生にメッセージを送信できる
- インターン生が受信メッセージを確認できる

### 余裕があれば追加する機能

- 企業が募集を掲載できる
- インターン生が募集を閲覧できる
- プロフィールにスキルタグを設定できる
- メッセージの既読管理

## ディレクトリ構成予定

```text
intern-scout-service/
├── README.md
├── backend/
│   ├── app/
│   ├── config/
│   ├── db/
│   └── Gemfile
├── frontend/
│   ├── app/
│   ├── components/
│   ├── lib/
│   └── package.json
└── docs/
    ├── api.md
    ├── architecture.md
    └── db_design.md
```

## 初期DB設計案

### users

ログインするユーザーを管理します。
インターン生と企業は `role` で区別します。

```text
id
name
email
password_digest
role
created_at
updated_at
```

### intern_profiles

インターン生固有のプロフィールを管理します。

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

企業固有のプロフィールを管理します。

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

企業からインターン生へのスカウトメッセージを管理します。

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

余裕がある場合に実装する募集掲載機能です。

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

## API設計案

```text
POST   /api/v1/register
POST   /api/v1/login
GET    /api/v1/me

GET    /api/v1/interns
GET    /api/v1/interns/:id
PATCH  /api/v1/intern_profile

GET    /api/v1/messages
POST   /api/v1/messages

GET    /api/v1/job_posts
POST   /api/v1/job_posts
PATCH  /api/v1/job_posts/:id
```

## APIの使い方

Rails API は開発環境では `http://localhost:3000` で起動する想定です。

認証が必要なAPIでは、ログインまたは登録時に返る `token` を `Authorization` ヘッダーに指定します。

```text
Authorization: Bearer <token>
```

### ユーザー登録

```http
POST /api/v1/register
Content-Type: application/json
```

```json
{
  "user": {
    "name": "山田太郎",
    "email": "taro@example.com",
    "password": "password123",
    "password_confirmation": "password123",
    "role": "intern"
  }
}
```

`role` は `intern` または `company` を指定します。

### ログイン

```http
POST /api/v1/login
Content-Type: application/json
```

```json
{
  "user": {
    "email": "taro@example.com",
    "password": "password123"
  }
}
```

### ログイン中ユーザー取得

```http
GET /api/v1/me
Authorization: Bearer <token>
```

### インターン生プロフィール作成・更新

インターン生ユーザーのみ利用できます。

```http
PATCH /api/v1/intern_profile
Authorization: Bearer <token>
Content-Type: application/json
```

```json
{
  "intern_profile": {
    "school_name": "テスト大学",
    "graduation_year": 2027,
    "bio": "Rails と TypeScript を学習しています。",
    "skills": "Ruby, Rails, TypeScript",
    "desired_position": "Webエンジニア"
  }
}
```

### インターン生一覧・詳細

企業ユーザーのみ利用できます。

```http
GET /api/v1/interns
Authorization: Bearer <token>
```

```http
GET /api/v1/interns/:id
Authorization: Bearer <token>
```

### メッセージ送信

企業ユーザーのみ利用できます。

```http
POST /api/v1/messages
Authorization: Bearer <token>
Content-Type: application/json
```

```json
{
  "message": {
    "receiver_id": 1,
    "body": "弊社のインターンに興味はありませんか？"
  }
}
```

### メッセージ一覧・詳細

ログインユーザーが送受信したメッセージのみ取得できます。

```http
GET /api/v1/messages
Authorization: Bearer <token>
```

```http
GET /api/v1/messages/:id
Authorization: Bearer <token>
```

受信者が詳細APIを開くと `read_at` がセットされます。

## 実装順

1. Rails API プロジェクトを `backend/` に作成する
2. Next.js プロジェクトを `frontend/` に作成する
3. User / InternProfile / CompanyProfile / Message のモデルを作成する
4. 登録・ログインAPIを作成する
5. インターン生一覧APIを作成する
6. メッセージ送信APIを作成する
7. フロントエンドで登録・ログイン画面を作成する
8. インターン生一覧・詳細画面を作成する
9. メッセージ送信・一覧画面を作成する

## 起動方法

### Backend

```powershell
cd backend
rails server
```

### Frontend

別のターミナルで起動します。

```powershell
cd frontend
npm run dev -- -p 3001
```

フロントエンドは `http://localhost:3001` で確認します。

APIの接続先を変える場合は、frontend 側で `NEXT_PUBLIC_API_BASE_URL` を設定します。
