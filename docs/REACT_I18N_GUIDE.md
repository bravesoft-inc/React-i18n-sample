# React (TypeScript) 多言語対応 (i18n) 導入・運用ガイド (`react-i18next` 使用)

このドキュメントは、React (TypeScript) プロジェクトに `react-i18next` を用いて多言語対応機能を導入し、スプレッドシート（CSV形式）で翻訳データを効率的に管理・運用する手順を解説します。

## 1. はじめに

このガイドでは、Reactプロジェクトで人気の高い `react-i18next` ライブラリを使用し、翻訳データのメンテナンスを容易にするための実践的なステップを紹介します。基本的な考え方はVue.jsでの対応と共通する部分も多いですが、Reactのエコシステムに合わせた実装方法となります。

**対象読者:**

* Reactの基本的な知識をお持ちの方
* TypeScriptを使用したプロジェクトでの開発経験がある、または関心がある方
* 効率的な多言語対応の導入・管理方法を求めている方

## 2. 準備

### 2.1. 前提知識・環境

* Node.js (v18.x LTS版以降を推奨、本ガイドではv20.xで動作確認)
* npm (Node.jsに同梱) または yarn / pnpm
* React (v17以降) の基本的な知識
* TypeScript の基本的な知識

### 2.2. React プロジェクトの作成

まだプロジェクトがない場合は、Viteなどを使用して新しいReact (TypeScript) プロジェクトを作成します。

```bash
npm create vite@latest my-react-i18n-app -- --template react-ts
cd my-react-i18n-app
```

ウィザードに従い、プロジェクト名などを設定してください。

## 3. react-i18next の導入と基本設定

### 3.1. react-i18next と関連ライブラリのインストール

プロジェクトのルートディレクトリで、以下のコマンドを実行します。

```bash
npm install react-i18next i18next i18next-browser-languagedetector
```

* `react-i18next`: i18next のReact向けバインディング。
* `i18next`: コアとなる国際化フレームワーク。
* `i18next-browser-languagedetector`: ブラウザの言語設定を検出し、初期言語として利用するためのプラグイン（オプション）。

### 3.2. i18n設定ファイル (src/i18n.ts) の作成

`src` ディレクトリ直下に `i18n.ts` という名前で設定ファイルを作成します。

```typescript
// src/i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// 翻訳JSONファイルをインポート (これらは後述の変換スクリプトで生成されます)
import enTranslations from './locales/en.json';
import jaTranslations from './locales/ja.json';
// 新しい言語を追加する場合はここにもインポートを追加
// import frTranslations from './locales/fr.json';
// import zhTranslations from './locales/zh.json';

i18n
  .use(LanguageDetector) // ブラウザの言語設定を検出
  .use(initReactI18next) // i18nextをreact-i18nextにバインド
  .init({
    // 初期言語を明示的に指定することも可能 (LanguageDetectorより優先される場合あり)
    // lng: 'en',
    debug: process.env.NODE_ENV === 'development', // 開発モードでデバッグログを出力
    fallbackLng: 'en', // 翻訳が見つからない場合のフォールバック言語
    interpolation: {
      escapeValue: false, // ReactはXSS対策済みなのでfalseでOK
    },
    resources: {
      en: {
        translation: enTranslations,
      },
      ja: {
        translation: jaTranslations,
      },
      // fr: { // 新しい言語のリソース
      //   translation: frTranslations,
      // },
      // zh: {
      //   translation: zhTranslations,
      // },
    },
    // react-i18next特有の設定 (デフォルトでtrueですが明示)
    react: {
      useSuspense: true, // Suspenseを有効にする
    },
  });

export default i18n;
```

### 3.3. アプリケーションへの組み込み (src/main.tsx)

アプリケーションのエントリーポイント (`src/main.tsx` または `src/index.tsx`) で、作成したi18n設定ファイルをインポートし、Reactの `Suspense` コンポーネントでアプリケーションをラップします。Suspense は翻訳リソースの読み込みが完了するまでフォールバックUIを表示するために使用します。

```typescript
// src/main.tsx
import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; // プロジェクトに応じたグローバルCSS
import './i18n'; // 作成したi18n設定ファイルをインポート (これによりi18n.initが実行される)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Suspense fallback={<div>Loading translations...</div>}>
      <App />
    </Suspense>
  </React.StrictMode>,
);
```

### 3.4. src/locales ディレクトリの準備

`src` フォルダ内に `locales` という名前のディレクトリを作成します。このディレクトリに、後述する変換スクリプトによって生成される各言語のJSONファイル (`en.json`, `ja.json` など) が格納されます。

## 4. コンポーネントでの react-i18next の利用

### 4.1. useTranslation フックの利用

関数コンポーネント内で `useTranslation` フックを使用し、`t` 関数（翻訳実行）と `i18n` インスタンス（言語切り替えなどに使用）を取得します。

```typescript
// 例: src/App.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';

function App() {
  const { t, i18n } = useTranslation();

  // デバッグ用にi18nの状態を出力
  console.log('i18n object from useTranslation:', i18n);
  console.log('Is i18n initialized?', i18n.isInitialized);
  console.log('Current language (from i18n.language):', i18n.language);

  // ... (他のロジックやUI)
  return (
    <div>
      {/* ... */}
    </div>
  );
}

export default App;
```

### 4.2. 翻訳テキストの表示 (t('key'))

`t` 関数に翻訳キーを渡して、対応する翻訳文を表示します。

```typescript
// src/App.tsx 内の return 文
// ...
  return (
    <main>
      <h1>{t('greeting')}</h1>
      <p>{t('message.welcome')}</p>
      <button type="button">{t('button.submit')}</button>
      <p className="error-message">{t('error.required')}</p>
      {/* ... */}
    </main>
  );
// ...
```

### 4.3. 言語切り替え機能の実装例

`i18n.changeLanguage()` メソッドを使用して言語を切り替えます。

```typescript
// src/App.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';

function App() {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    console.log('Attempting to change language to:', lng);
    console.log('Current language before change:', i18n.language);
    if (typeof i18n.changeLanguage === 'function') {
      i18n.changeLanguage(lng).then(() => {
        console.log('Language successfully changed to:', i18n.language);
        console.log('Greeting now (after change):', t('greeting'));
      }).catch((err) => {
        console.error('Error changing language:', err);
      });
    } else {
      console.error('i18n.changeLanguage is not a function! Current i18n object:', i18n);
    }
  };

  return (
    <main style={{ fontFamily: 'sans-serif', padding: '20px' }}>
      <h1>{t('greeting')}</h1>
      <p>{t('message.welcome')}</p>
      <button type="button" style={{ backgroundColor: '#42b983', color: 'white', border: 'none', padding: '10px 15px', borderRadius: '4px', cursor: 'pointer', fontSize: '1em', marginRight: '5px', marginBottom: '5px' }}>
        {t('button.submit')}
      </button>
      <p style={{ color: 'red', fontWeight: 'bold' }} className="error-message">{t('error.required')}</p>

      <hr style={{ margin: '20px 0', border: 0, borderTop: '1px solid #eee' }} />
      <h2 style={{ color: '#34495e' }}>言語切り替え</h2>
      <button onClick={() => changeLanguage('ja')} style={{ backgroundColor: '#42b983', color: 'white', border: 'none', padding: '10px 15px', borderRadius: '4px', cursor: 'pointer', fontSize: '1em', marginRight: '5px', marginBottom: '5px' }}>日本語</button>
      <button onClick={() => changeLanguage('en')} style={{ backgroundColor: '#42b983', color: 'white', border: 'none', padding: '10px 15px', borderRadius: '4px', cursor: 'pointer', fontSize: '1em', marginRight: '5px', marginBottom: '5px' }}>English</button>
      {/* 新しい言語ボタンは後で追加 */}
      {/*
      <button onClick={() => changeLanguage('fr')}>Français</button>
      <button onClick={() => changeLanguage('zh')}>中文</button>
      */}
      <p>現在のi18n言語: {i18n.language || 'undefined'}</p>
    </main>
  );
}

export default App;
```

## 5. 翻訳データの一元管理と自動生成 (Vue版と同様のスクリプトを利用)

このセクションは、基本的にVue.js向けガイドの「5. 翻訳データの一元管理と自動生成」と同様です。変換スクリプトは特定のフロントエンドフレームワークに依存しません。

### 5.1. なぜ一元管理か？

(Vue版ガイド参照)

### 5.2. 管理方法：スプレッドシート (CSV) + 変換スクリプト

(Vue版ガイド参照)

### 5.3. translations.csv の準備

* **ファイル作成場所**: プロジェクトのルートディレクトリ (例: `my-react-i18n-app/translations.csv`)。
* **フォーマット**: Vue版ガイド参照 (1行目ヘッダー: `key,en,ja,...`、UTF-8、カンマ区切り)。

例 (`translations.csv`):

```csv
key,ja,en
greeting,こんにちは、世界！,"Hello, world!"
message.welcome,Vue I18n サンプルへようこそ,Welcome to the Vue I18n Sample
button.submit,送信,Submit
error.required,この項目は必須です。,This field is required.
```

### 5.4. 変換スクリプト (scripts/convert-translations.ts) の準備

**必要なライブラリのインストール** (Vue版ガイドと同様):

```bash
npm install papaparse dset --save-dev
npm install @types/papaparse jiti typescript @types/node --save-dev
```

(`jiti`, `typescript`, `@types/node` はReactプロジェクト作成時に既に入っている可能性もあります)

**スクリプトファイルの作成**:
プロジェクトのルートに `scripts` フォルダを作成し、その中に `convert-translations.ts` を保存します。スクリプトの内容は Vue版ガイドで提供したものと全く同じで構いません (ESM対応、エラーハンドリング強化版)。

**注意点**: スクリプト内の `OUTPUT_DIR` 定数 (`path.resolve(__dirname, '../src/locales')`) が、Reactプロジェクトの構造と合っているか確認してください。通常は `src/locales` で問題ありません。

(スクリプトの全文は長いため、Vue版ガイドのセクション5.4.2を参照してください。)

### 5.5. 変換スクリプトの実行設定

**package.json の編集**:
`package.json` の `scripts` セクションにコマンドを追加します。`jiti` を使用することを推奨します。

```json
{
  "scripts": {
    "convert-translations": "jiti ./scripts/convert-translations.ts"
  }
}
```

**コマンド実行**:

```bash
npm run convert-translations
```

`src/locales` ディレクトリに各言語のJSONファイルが生成/更新されます。

## 6. 新しい言語の追加 (例: フランス語、中国語)

### translations.csv の更新

新しい言語の列 (例: `fr`, `zh`) と翻訳文を追加します。

```csv
key,ja,en,fr,zh
greeting,こんにちは、世界！,"Hello, world!",Bonjour le monde !,你好，世界！
message.welcome,Vue I18n サンプルへようこそ,Welcome to the Vue I18n Sample,Bienvenue à l'exemple Vue I18n,欢迎来到 Vue I18n 示例
button.submit,送信,Submit,Soumettre,提交
error.required,この項目は必須です。,This field is required.,Ce champ est requis.,此字段是必需的。
```

### 変換スクリプトの再実行

```bash
npm run convert-translations
```

`src/locales/fr.json` と `src/locales/zh.json` が生成されます。

### src/i18n.ts の更新

生成された新しい言語のJSONファイルをインポートし、`i18n.init()` の `resources` オプションに追加します。

```typescript
// src/i18n.ts
// ... (他のimport文)
import frTranslations from './locales/fr.json'; // フランス語をインポート
import zhTranslations from './locales/zh.json'; // 中国語をインポート

i18n
  // ...
  .init({
    // ...
    resources: {
      en: { translation: enTranslations },
      ja: { translation: jaTranslations },
      fr: { translation: frTranslations }, // フランス語リソース追加
      zh: { translation: zhTranslations }, // 中国語リソース追加
    },
    // ...
  });
```

### 言語切り替えUIの更新 (App.tsxなど)

新しい言語に切り替えるためのボタンなどを追加します。

```typescript
// src/App.tsx 内の return 文
// ...
  <button onClick={() => changeLanguage('fr')}>Français</button>
  <button onClick={() => changeLanguage('zh')}>中文</button>
// ...
```

## 7. トラブルシューティング・FAQ (React版の文脈で)

### 変換スクリプト実行時エラー

(Vue版ガイドのセクション7と同様)

**Error: Cannot find module '...'**: 依存関係の再インストール (`rm -rf node_modules package-lock.json && npm install`) を試してください。

### react-i18next 関連のエラー

**[plugin:vite:import-analysis] Failed to resolve import "./i18n" from "src/main.tsx"**: `src/i18n.ts` (または `.js`) ファイルが正しい場所に正しい名前で存在するか確認してください。インポートパスが正しいか確認してください。

**i18n.changeLanguage is not a function または i18n.language is undefined**: i18next の初期化が完了していないか、正しく行われていません。

* `src/main.tsx` で App コンポーネントが `React.Suspense` でラップされているか確認してください。
* `src/i18n.ts` の `init()` オプション (`lng`, `fallbackLng`, `resources`) を確認してください。
* `import './i18n';` が `src/main.tsx` の早い段階で呼ばれているか確認してください。
* コンポーネント内で `console.log(i18n.isInitialized, i18n.language)` をして状態を確認してください。

**i18next::translator: missingKey <lang> translation <key> <key>**: 指定した言語の翻訳リソース内に、該当するキーが見つかりません。

* `npm run convert-translations` を実行して、`src/locales/*.json` ファイルが最新かつ正しい内容で生成されているか確認してください。
* `src/i18n.ts` の `resources` 設定で、JSONファイルが正しくインポートされ、各言語にマッピングされているか確認してください。
* 翻訳キーのタイプミスがないか確認してください。

### CSVファイルの文字コード

(Vue版ガイドと同様) UTF-8で保存してください。

## 8. まとめ

`react-i18next` を使用することで、Reactプロジェクトにも強力な多言語対応機能を導入できます。翻訳データの一元管理にCSVと変換スクリプトを用いる手法は、Vue.jsプロジェクトと同様にReactプロジェクトでも有効であり、メンテナンス性を高めます。初期設定やコンポーネントでのAPI呼び出しは異なりますが、基本的なワークフローは共通しています。