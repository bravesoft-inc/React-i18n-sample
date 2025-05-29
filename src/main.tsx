// src/main.tsx
import React, { Suspense } from 'react'; // Suspense をインポート
import ReactDOM from 'react-dom/client';
import App from './App';
import './i18n'; // i18n設定ファイルをインポートして初期化

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Suspense fallback={<div>Loading translations...</div>}> {/* <--- Suspenseでラップ */}
      <App />
    </Suspense>
  </React.StrictMode>,
);