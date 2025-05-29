// src/i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// ★★★ これらのインポートパスが正しく、ファイルが存在し、中身が正しいか確認 ★★★
import enTranslations from './locales/en.json';
import jaTranslations from './locales/ja.json';
import frTranslations from './locales/fr.json';
import zhTranslations from './locales/zh.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    lng: 'en', // 初期言語
    debug: process.env.NODE_ENV === 'development',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    resources: {
      en: {
        translation: enTranslations, // enTranslations は空でないか？
      },
      ja: {
        translation: jaTranslations, // jaTranslations は空でないか？
      },
      fr: {
        translation: frTranslations, // frTranslations は空でないか？
      },
      zh: {
        translation: zhTranslations, // zhTranslations は空でないか？
      },
    },
  });

export default i18n;