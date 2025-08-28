import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import en from './en/translation.json';
import vi from './vi/translation.json';

// Định nghĩa các resource (ngôn ngữ)
const resources = {
    en: { translation: en },
    vi: { translation: vi }
};

i18n
  .use(LanguageDetector) // tự động phát hiện ngôn ngữ từ trình duyệt/localStorage
  .use(initReactI18next) // kết nối với react
  .init({
    resources,
    fallbackLng: "en", // nếu không tìm thấy ngôn ngữ -> mặc định English
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
