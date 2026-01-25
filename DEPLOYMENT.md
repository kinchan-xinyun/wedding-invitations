# Firebase Hosting デプロイ手順

このドキュメントでは、GitHub ActionsでFirebase Hostingに自動デプロイする設定方法を説明します。

## セットアップ手順

### 1. Firebase Service Accountの作成

#### 方法A: Firebase コンソールから（推奨）

1. [Firebase Console](https://console.firebase.google.com/)にアクセス
2. プロジェクト（li-oda-wedding）を選択
3. プロジェクト設定（⚙️アイコン）→ **サービスアカウント**
4. **新しい秘密鍵の生成** をクリック
5. JSONファイルがダウンロードされます（安全に保管してください）

#### 方法B: Firebase CLIから

```bash
firebase login:ci
```

このコマンドでトークンが表示されます。

### 2. GitHub Repository Secretsの設定

#### Firebase Service Accountを使用する場合（推奨）

1. GitHubリポジトリにアクセス
2. **Settings** → **Secrets and variables** → **Actions**
3. **New repository secret** をクリック
4. **Name**: `FIREBASE_SERVICE_ACCOUNT`
5. **Secret**: ダウンロードしたJSONファイルの内容全体をコピー＆ペースト
6. **Add secret** をクリック

#### Firebase Tokenを使用する場合

1. GitHubリポジトリにアクセス
2. **Settings** → **Secrets and variables** → **Actions**
3. **New repository secret** をクリック
4. **Name**: `FIREBASE_TOKEN`
5. **Secret**: `firebase login:ci`で取得したトークンを貼り付け
6. **Add secret** をクリック

### 3. デプロイの実行

#### 自動デプロイ
mainブランチにpushすると、自動的にFirebase Hostingにデプロイされます。

```bash
git add .
git commit -m "Update website"
git push origin main
```

#### 手動デプロイ
GitHubリポジトリの **Actions** タブから：
1. **Deploy to Firebase Hosting** ワークフローを選択
2. **Run workflow** をクリック
3. ブランチを選択して **Run workflow**

### 4. デプロイ状況の確認

- **GitHub Actions**: リポジトリの **Actions** タブでデプロイ状況を確認
- **Firebase Console**: [Firebase Console](https://console.firebase.google.com/) の **Hosting** セクションでデプロイ履歴を確認

## トラブルシューティング

### デプロイが失敗する場合

1. **Secretsが正しく設定されているか確認**
   - GitHub Settings → Secrets and variables → Actions

2. **Firebase プロジェクトIDが正しいか確認**
   - `.firebaserc` ファイルのプロジェクトID: `li-oda-wedding`

3. **Service Accountの権限を確認**
   - Firebase ConsoleでService Accountに適切な権限が付与されているか確認

4. **ログを確認**
   - GitHub Actionsの **Actions** タブで詳細なエラーログを確認

## ローカルでのテスト

ローカル環境でデプロイをテストする場合：

```bash
# Firebase CLIをインストール（未インストールの場合）
npm install -g firebase-tools

# ログイン
firebase login

# ローカルサーバーを起動
firebase serve

# 本番環境にデプロイ
firebase deploy
```

## 参考リンク

- [Firebase Hosting Documentation](https://firebase.google.com/docs/hosting)
- [GitHub Actions for Firebase](https://github.com/FirebaseExtended/action-hosting-deploy)
- [Firebase CLI Reference](https://firebase.google.com/docs/cli)
