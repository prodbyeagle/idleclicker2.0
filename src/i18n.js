// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Importiere die Übersetzungsdateien
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
   .use(initReactI18next) // Bindung von i18next an React
   .init({
      resources,
      lng: 'en', // Standard-Sprache
      fallbackLng: 'en', // Fallback-Sprache, falls die aktuelle nicht verfügbar ist
      interpolation: {
         escapeValue: false, // React benötigt dies nicht
      },
   });

export default i18n;
