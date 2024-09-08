import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import translationDE from './locales/de/translation.json';
import translationEN from './locales/en/translation.json';

const resources = {
   en: {
      translation: translationEN,
   },
   de: {
      translation: translationDE,
   },
};

i18n
   .use(initReactI18next)
   .init({
      resources,
      lng: 'en',
      fallbackLng: 'en',
      interpolation: {
         escapeValue: false,
      },
   });

export default i18n;