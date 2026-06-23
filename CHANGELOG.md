# Changelog

## [Unreleased] - 2026-06-23

### 変更の背景
ClaudeCode（クロちゃん）を初めて本格活用して行った大規模なリファクタリング。

### Added
- `App.tsx` — ルートコンポーネントをTypeScriptで新規作成
- `src/types.ts` — `TabType`・`Selection` の型定義ファイル
- `src/styles.ts` — スタイルをTypeScript化して分離
- `src/components/MainArea.tsx` — エディタとWebViewプレビューを切り替えるコンポーネント

### Changed
- `App.js` → `App.tsx` へ移行（TypeScript型付き）
- `src/components/Header.js` → `Header.tsx` へ移行
- `src/components/SnippetBar.js` → `SnippetBar.tsx` へ移行
- `src/styles.js` → `src/styles.ts` へ移行

### Removed
- Expoデフォルトテンプレートの不要コンポーネント群を削除
  - `animated-icon`, `app-tabs`, `external-link`, `hint-row`
  - `themed-text`, `themed-view`, `web-badge`, `ui/collapsible`
  - `src/constants/theme.ts`, `src/global.css`
  - `src/hooks/` 以下のフック群
  - `scripts/reset-project.js`

### 実装済み機能
| 機能 | 説明 |
|------|------|
| コードエディタ | `TextInput` によるモノスペースフォントのコード入力エリア |
| HTMLプレビュー | `WebView` でエディタの内容をリアルタイムHTMLとして描画 |
| タブ切り替え | ヘッダーのボタンでエディタ↔プレビューを切り替え |
| スニペットバー | よく使う記号（`<`, `>`, `{`, `(` など）をワンタップで入力 |
| 自動閉じカッコ補完 | `{`, `(`, `"` 等を入力すると閉じカッコを自動挿入 |
| 閉じカッコスキップ | 既に閉じカッコがある場合はカーソルのみ前進 |
