import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';

i18n
  .use(HttpBackend)
  .use(initReactI18next)
  .init({
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    lng: 'da', // Default language
    ns: ['translation'],
    defaultNS: 'translation',
    fallbackLng: 'en',
    interpolation: {
      prefix: '{{',
      suffix: '}}' // Matcher placeholder-syntax
    },
    react: {
      useSuspense: true
    },
  });

export default i18n;
