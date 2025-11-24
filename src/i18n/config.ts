import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import es from './locales/es.json';

const resources = {
  en: {
    translation: en
  },
  es: {
    translation: es
  }
};

// Get language from localStorage or default to Spanish
const savedLanguage = localStorage.getItem('i18nextLng') || 'es';

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: savedLanguage,
    fallbackLng: 'es',
    interpolation: {
      escapeValue: false
    },
    react: {
      useSuspense: false,
      bindI18n: 'languageChanged'
    }
  });

// Save language preference on change
i18n.on('languageChanged', (lng) => {
  localStorage.setItem('i18nextLng', lng);
});

export default i18n;
