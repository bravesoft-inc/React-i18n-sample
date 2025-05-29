# React i18n サンプルプロジェクト (react-i18next)

このプロジェクトは、React, TypeScript, および `react-i18next` を使用して多言語対応 (i18n) を実装したサンプルアプリケーションです。翻訳文言はCSVファイルで一元管理し、Node.jsスクリプトでJSON形式に変換します。

## 主な特徴

* **多言語対応**: `react-i18next` による日本語、英語 (および拡張可能) のサポート。
* **TypeScript**: 型安全な開発。
* **React Hooks**: `useTranslation` フックによるシンプルなAPI利用。
* **翻訳データの一元管理**: `translations.csv` ファイルで翻訳文言を管理。
* **自動変換スクリプト**: CSVから各言語のJSONファイルを生成。
* **ESM環境**: プロジェクトは `"type": "module"` で構成。
* **React Suspense**: 翻訳リソースのロード中のフォールバック表示。

## 技術スタック

* React
* TypeScript
* Vite
* `react-i18next`, `i18next`, `i18next-browser-languagedetector`
* `papaparse` (CSVパース用)
* `dset` (ネストオブジェクト設定用)
* `jiti` (TypeScriptスクリプト実行用)

## セットアップと実行

### 前提条件

* Node.js (v18.x LTS版以降推奨)
* npm (Node.js に同梱)

### 手順

1.  **リポジトリをクローン** (もしあれば):
    ```bash
    # git clone <repository-url>
    # cd my-react-i18n-app
    ```

2.  **依存関係をインストール**:
    ```bash
    npm install
    ```
    (もし `papaparse`, `dset`, `jiti` などがpackage.jsonに含まれていなければ、別途インストールしてください: `npm install papaparse dset jiti @types/papaparse --save-dev`)

3.  **開発サーバーを起動**:
    ```bash
    npm run dev
    ```
    ブラウザで `http://localhost:5173` (または表示されたポート) を開きます。

## 多言語対応 (i18n) の運用

### 1. i18nライブラリと設定

* **ライブラリ**: `react-i18next`, `i18next`
* **設定ファイル**: `src/i18n.ts` で `i18next.init()` を使用して初期化します。翻訳リソース、フォールバック言語などを設定します。
* **アプリケーションへの組み込み**: `src/main.tsx` で `import './i18n';` を行い、`<App />` を `<React.Suspense fallback="...">` でラップします。

### 2. 翻訳文言の管理 (`translations.csv`)

* プロジェクトルートにある `translations.csv` ファイルで、すべての翻訳文言を一元管理します。
* **フォーマット**: 1行目ヘッダー (`key,ja,en,...`)、2行目以降データ。UTF-8推奨。

### 3. 翻訳ファイルの生成 (`npm run convert-translations`)

* `translations.csv` を編集後、以下のコマンドを実行して `src/locales/*.json` ファイルを生成・更新します。
    ```bash
    npm run convert-translations
    ```
    このコマンドは `scripts/convert-translations.ts` (CSVをJSONに変換するNode.jsスクリプト) を `jiti` を使って実行します。

### 4. コンポーネントでの使用

* `useTranslation` フックから `t` 関数を取得し、`t('your.key')` のように使用します。

### 5. 言語切り替え

* `useTranslation` フックから `i18n` インスタンスを取得し、`i18n.changeLanguage('new-lang-code')` を呼び出します。

### 6. 新しい言語の追加手順 (要点)

1.  `translations.csv` に新しい言語の列と翻訳データを追加します。
2.  `npm run convert-translations` を実行してJSONファイルを生成します。
3.  `src/i18n.ts` の `resources` オプションに新しい言語とその翻訳JSONをインポートして追加します。
4.  (任意) UIに新しい言語への切り替えオプションを追加します。

## 主要なnpmスクリプトコマンド

* `npm run dev`: 開発サーバーを起動します。
* `npm run build`: プロダクション用にプロジェクトをビルドします。
* `npm run preview`: ビルドされた成果物をローカルでプレビューします。
* `npm run convert-translations`: `translations.csv` から言語JSONファイルを生成します。
* `npm run lint`: (設定されていれば) ESLintでコードをチェックします。