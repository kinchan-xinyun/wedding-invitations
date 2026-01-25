# 招待コード一括インポート手順

このドキュメントでは、CSVファイルからFirestoreに招待コードを一括登録する方法を説明します。

## 📋 準備

### 1. 必要なパッケージをインストール

**Python版**（推奨）:

```bash
pip3 install -r requirements.txt
```

または

```bash
python3 -m pip install -r requirements.txt
```

**Node.js版**（オプション）:

```bash
npm install
```

## 📝 CSVファイルの作成

### ファイル形式

`invitations.csv` ファイルを編集して、招待リストを作成します。

**フォーマット:**

```csv
inviteCode,guestName,maxGuests,whichGuest,notes
ABC123XYZ,山田太郎,2,新郎,友人
DEF456ABC,佐藤花子,1,新婦,会社同僚
```

### カラム説明

| カラム名 | 必須 | 説明 | 例 |
|---------|------|------|-----|
| `inviteCode` | ✅ | 招待コード（ユニーク） | `ABC123XYZ` |
| `guestName` | - | ゲストの名前 | `山田太郎` |
| `maxGuests` | - | 最大ゲスト数（デフォルト: 1） | `2` |
| `whichGuest` | - | 新郎側/新婦側 | `新郎` または `新婦` |
| `notes` | - | メモ（管理用） | `友人` |
| `guestEmail` | - | ゲストのメールアドレス（オプション） | `yamada@example.com` |

### 招待コードの生成方法

招待コードは以下のルールで作成することを推奨します：

- **長さ**: 8-12文字
- **文字種**: 英数字大文字（A-Z, 0-9）
- **例**: `ABC123XYZ`, `XY7890DEF`

**生成ツール（オプション）:**
```javascript
// ランダム招待コード生成
function generateInviteCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 9; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}
```

## 🚀 実行方法

### 既存の招待コードを確認

**Python版**（推奨）:

```bash
python3 import_invitations.py list
```

または

```bash
npm run list
```

**Node.js版**:

```bash
node import-invitations.js list
```

### CSVファイルからインポート

**Python版**（推奨）:

デフォルト（`invitations.csv`を使用）:

```bash
python3 import_invitations.py
```

または

```bash
npm run import
```

カスタムCSVファイルを指定:

```bash
python3 import_invitations.py path/to/custom.csv
```

**Node.js版**:

```bash
node import-invitations.js
node import-invitations.js path/to/custom.csv
```

### 実行フロー

1. CSVファイルを読み込み
2. 既存の招待コードを表示
3. 確認プロンプト（Enter キーで続行）
4. Firestoreにインポート
5. 完了後、更新された招待コード一覧を表示

## ⚠️ 注意事項

### 上書き動作

- 同じ`invite_code`が既に存在する場合、データは**上書き**されます
- 削除ではなく、マージ（`merge: true`）で更新されます

### データ検証

- `invite_code`が空のレコードはスキップされます
- `max_guests`は整数に変換されます（変換できない場合は1）

### セキュリティ

- Admin SDK認証ファイル（`*-adminsdk-*.json`）は`.gitignore`に含まれています
- **絶対にGitにコミットしないでください**

## 📊 実行例

```bash
$ python3 import_invitations.py

============================================================
  招待コード一括インポートツール
============================================================

📄 CSVファイルを読み込み中: invitations.csv
✅ 5件のレコードを読み込みました

📋 既存の招待コード一覧:

  ABC123XYZ - 山田太郎 (最大2名)
  DEF456ABC - 佐藤花子 (最大1名)

合計: 2件

⚠️  注意: 既存の招待コードは上書きされます
続行するには Enter キーを押してください（キャンセルは Ctrl+C）...

📥 5件の招待コードをインポート中...

✅ ABC123XYZ - 山田太郎 (最大2名)
✅ DEF456ABC - 佐藤花子 (最大1名)
✅ GHI789DEF - 鈴木一郎 (最大4名)
✅ JKL012GHI - 田中美咲 (最大2名)
✅ MNO345JKL - 高橋健太 (最大3名)

🎉 完了！合計 5件の招待コードをインポートしました

📋 既存の招待コード一覧:

  ABC123XYZ - 山田太郎 (最大2名)
  DEF456ABC - 佐藤花子 (最大1名)
  GHI789DEF - 鈴木一郎 (最大4名)
  JKL012GHI - 田中美咲 (最大2名)
  MNO345JKL - 高橋健太 (最大3名)

合計: 5件

✨ すべての処理が完了しました！
```

## 🔧 トラブルシューティング

### エラー: CSVファイルが見つかりません

```bash
❌ エラー: CSVファイルが見つかりません: invitations.csv
```

**解決方法**: `invitations.csv`ファイルがプロジェクトルートに存在するか確認してください。

### エラー: Firebase Admin認証エラー

```bash
❌ エラーが発生しました: Error: Could not load the default credentials
```

**解決方法**: Admin SDK認証ファイル（`li-oda-wedding-firebase-adminsdk-*.json`）が存在し、正しいパスが指定されているか確認してください。

### エラー: Permission denied

```bash
❌ エラーが発生しました: 7 PERMISSION_DENIED
```

**解決方法**: 
1. Firestore Rulesで`invitations`コレクションへの書き込み権限を確認
2. Admin SDKには制限がないはずなので、認証情報を確認

## 📚 補足情報

### Firestoreデータ構造

インポート後、Firestoreには以下の形式でデータが保存されます：

**コレクション**: `invitations`  
**ドキュメントID**: `invite_code`の値

**フィールド**:
```javascript
{
  inviteCode: "ABC123XYZ",
  guestName: "山田太郎",
  maxGuests: 2,
  whichGuest: "新郎",
  notes: "友人",
  guestEmail: "yamada@example.com", // オプション
  createdAt: Timestamp,
  isActive: true
}
```

### バッチ処理

- Firestoreの制限により、500件ごとにコミットされます
- 大量のデータ（数千件）でも安全に処理できます

## 🎯 次のステップ

1. ✅ CSVファイルを編集して招待リストを作成
2. ✅ `npm run import`でインポート
3. ✅ `npm run list`で確認
4. ✅ Firestore Rulesをデプロイ: `firebase deploy --only firestore:rules`
5. ✅ Webサイトで招待コードをテスト
