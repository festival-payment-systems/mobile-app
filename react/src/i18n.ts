import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import enUs from "./languages/en-us.ts";
import de from "./languages/de.ts";

i18n.use(initReactI18next).init({
  debug: false,
  fallbackLng: 'en',
  resources: {
    en: {
      translation: enUs,
    },
    de: {
      translation: de,
    },
  },
})


export default i18n