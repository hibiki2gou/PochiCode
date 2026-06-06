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
**原因:** Expoの初期テンプレートに含まれる「Expo Router（`app` フォルダ）」機能と競合している、または `App.js` を見失っている。
**解決策:** 複雑なルーティングを解除し、シンプルな `App.js` 構成に戻す。
1. `app` フォルダが存在する場合は、フォルダごと削除する。
2. `package.json` の `"main"` を `"expo/AppEntry.js"` に書き換える。
3. プロジェクトのルートディレクトリ（一番上の階層）に `App.js` を作成し、コードを記述する。
4. `npx expo start -c` で再起動する。
```