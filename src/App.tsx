// src/App.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';

function App() {
  const { t, i18n } = useTranslation();

  // --- デバッグ用ログを追加 ---
  console.log('i18n object from useTranslation:', i18n);
  console.log('Is i18n initialized?', i18n.isInitialized);
  console.log('Current language (from i18n.language):', i18n.language);
  // --- ここまで ---

  const changeLanguage = (lng: string) => {
    console.log('Attempting to change language to:', lng);
    console.log('Current language before change:', i18n.language);
    // エラーが起きているため、一旦 changeLanguage の中身はコメントアウトするか、
    // i18n オブジェクトが期待通りか確認してから呼び出すようにします。
    if (typeof i18n.changeLanguage === 'function') {
      i18n.changeLanguage(lng).then(() => {
        console.log('Language successfully changed to:', i18n.language);
        console.log('Greeting now:', t('greeting'));
      }).catch((err) => {
        console.error('Error changing language:', err);
      });
    } else {
      console.error('i18n.changeLanguage is not a function! Current i18n object:', i18n);
    }
  };

  return (
    <main>
      <h1>{t('greeting')}</h1>
      <p>{t('message.welcome')}</p>
      <button type="button">{t('button.submit')}</button>
      <p className="error-message">{t('error.required')}</p>

      <hr />
      <h2>言語切り替え</h2>
      <button onClick={() => changeLanguage('ja')}>日本語</button>
      <button onClick={() => changeLanguage('en')}>English</button>
      <button onClick={() => changeLanguage('fr')}>Français</button>
      <button onClick={() => changeLanguage('zh')}>中文</button>
      <p>現在のi18n言語: {i18n.language || 'undefined'}</p> {/* undefinedの場合の表示も考慮 */}
    </main>
  );
}

export default App;