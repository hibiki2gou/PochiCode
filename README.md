# PochiCode (ポチコード)

ベッドで寝転がりながら「たのしくやろう」を体現する、ポチポチ入力エディタ。
フリック入力のストレスをなくし、iPhone上で快適にWebフロントエンドのコーディングができる開発支援アプリです。

## 🛠 必須環境 (Prerequisites)
* **Mac:** Node.js がインストールされていること
* **iPhone:** App Storeから「Expo Go」アプリがインストールされていること

## 🚀 開発環境のセットアップ (Setup)

**【必須環境】**
* **Mac:** Node.js がインストールされていること
* **iPhone:** App Storeから「Expo Go」アプリがインストールされていること

**【起動手順】**
1. リポジトリをローカルにクローン（または配置）し、VS Codeで開きます。
2. ターミナルで以下のコマンドを実行し、依存パッケージをインストールします。
   ```bash
   npm install --legacy-peer-deps
   ```
3. 開発サーバーを起動します。（`-c` はキャッシュクリアのオプションです）
   ```bash
   npx expo start -c
   ```
4. ターミナルに表示されたQRコードを、iPhoneの「Expo Go」アプリ（またはカメラ）で読み取ります。

---

## 📁 プロジェクト構成 (Project Structure)

```
PochiCode/
├── App.tsx                      # ルートコンポーネント（状態管理・スニペットロジック）
├── src/
│   ├── types.ts                 # 型定義（TabType, Selection）
│   ├── styles.ts                # スタイル定義
│   └── components/
│       ├── Header.tsx           # タブ切り替えヘッダー（エディタ / プレビュー）
│       ├── MainArea.tsx         # メインエリア（TextInput or WebView）
│       └── SnippetBar.tsx       # スニペットボタンバー
└── CHANGELOG.md                 # 変更履歴
```

### 主な機能
| 機能 | 説明 |
|------|------|
| コードエディタ | モノスペースフォントのコード入力エリア |
| HTMLプレビュー | WebViewでHTMLをリアルタイム描画 |
| スニペットバー | `<`, `>`, `{`, `(` などをワンタップ入力 |
| 自動閉じカッコ | `{`, `(`, `"` 入力時に閉じカッコを自動補完 |

---

## ⚠️ トラブルシューティング (Troubleshooting)

### Q1. 「Project is incompatible with this version of Expo Go」というエラーが出る
**原因:** Mac側のExpoのバージョンが新しすぎることによる、iPhoneのExpo Goアプリとの互換性エラー。
**解決策:** iPhoneのExpo Goが対応しているバージョン（例: SDK 54）にダウングレードする。
```bash
# バージョンの競合を強制突破してインストール
npm install expo@~54.0.0 --legacy-peer-deps
npx expo install --fix -- --legacy-peer-deps
npx expo start -c
```

### Q2. 赤い画面で「Element type is invalid...」または「Unable to resolve "../../App"」というエラーが出る
**原因:** Expoの初期テンプレートに含まれる「Expo Router（`app` フォルダ）」機能と競合している、または `App.tsx` を見失っている。
**解決策:** 複雑なルーティングを解除し、シンプルな `App.tsx` 構成に戻す。
1. `app` フォルダが存在する場合は、フォルダごと削除する。
2. `package.json` の `"main"` を `"expo/AppEntry.js"` に書き換える。
3. プロジェクトのルートディレクトリ（一番上の階層）に `App.tsx` を作成し、コードを記述する。
4. `npx expo start -c` で再起動する。
```