// Header.tsx
import React, { useEffect, useRef, useState } from 'react';
import styles from './index.module.css';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface HeaderProps {
  className?: string;
}

const languages = {
  en: {
    name: 'English',
    flag: 'https://flagcdn.com/w40/gb.png', // Cờ Mỹ
    alt: 'US Flag'
  },
  vi: {
    name: 'Tiếng Việt',
    flag: 'https://flagcdn.com/w40/vn.png', // Cờ Việt Nam
    alt: 'Vietnam Flag'
  }
};

const Header: React.FC<HeaderProps> = ({ className }) => {
  const { t, i18n } = useTranslation();

  const [open, setOpen] = useState(false);
  
  const menuRef = useRef<HTMLDivElement>(null);

  // Hàm đổi ngôn ngữ
  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    setOpen(false);
  };

  // Lấy ngôn ngữ hiện tại
  const currentLanguage = languages[i18n.language as keyof typeof languages] || languages.en;

  // Đóng menu khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className={`${styles.header} ${className || ''}`}>
      <div className={styles.container}>
        {/* Logo và tiêu đề */}
        <div className={styles.brand}>
          <h1 className={styles.title}>Pharma News</h1>
          <p className={styles.subtitle}>{t("subtitle")}</p>
        </div>

        {/* Menu điều hướng */}
        <nav className={styles.navigation}>
          <ul className={styles.navList}>
            <li className={styles.navItem}>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `${styles.navLink} ${isActive ? styles.active : ''}`
                }
              >
                {t("nav.home")}
              </NavLink>
            </li>
            <li className={styles.navItem}>
              <NavLink
                to="/blog"
                className={({ isActive }) =>
                  `${styles.navLink} ${isActive ? styles.active : ''}`
                }
              >
                {t("nav.blog")}
              </NavLink>
            </li>
            <li className={styles.navItem}>
              <NavLink
                to="/about"
                className={({ isActive }) =>
                  `${styles.navLink} ${isActive ? styles.active : ''}`
                }
              >
                {t("nav.about")}
              </NavLink>
            </li>
            <li className={styles.navItem}>
              <NavLink
                to="/contact"
                className={({ isActive }) =>
                  `${styles.navLink} ${isActive ? styles.active : ''}`
                }
              >
                {t("nav.contact")}
              </NavLink>
            </li>
          </ul>
        </nav>

        {/* Language Selector với hình ảnh địa cầu và cờ */}
        <div className={styles.languageWrapper} ref={menuRef}>
          <button
            className={styles.globeButton}
            onClick={() => setOpen((prev) => !prev)}
            aria-label="Change language"
          >
            {/* Cờ của ngôn ngữ hiện tại */}
            <img 
              src={currentLanguage.flag} 
              alt={currentLanguage.alt}
              className={styles.currentFlag}
            />

            {/* Hình ảnh địa cầu */}
            <img 
              src="https://cdn-icons-png.flaticon.com/512/814/814513.png" 
              alt="Globe" 
              className={styles.globeImage}
            />
          </button>

          {/* Menu chọn ngôn ngữ */}
          {open && (
            <div className={styles.languageMenu}>
              {Object.entries(languages).map(([code, lang]) => (
                <button 
                  key={code}
                  onClick={() => changeLanguage(code)}
                  className={`${styles.languageOption} ${
                    i18n.language === code ? styles.active : ''
                  }`}
                >
                  <img 
                    src={lang.flag} 
                    alt={lang.alt}
                    className={styles.flagImage}
                  />
                  <span className={styles.languageName}>{lang.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
