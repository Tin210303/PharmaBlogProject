// Header.tsx
import React, { useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from "../../context/AuthContext";
import { ChevronDown, LogIn, LogOut, User } from 'lucide-react';
import logo from '../../assets/imgs/logo.jpg';
import styles from './index.module.css';

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

  const { isLoggedIn, userInfo, login, logout } = useAuth();

  const [userMenuOpen, setUserMenuOpen] = useState(false);
  
  const userMenuRef = useRef(null);

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
        <div className='d-flex align-center gap-16px'>
          <img src={logo} alt='Logo' className={styles.logo}/>
          <div className={styles.brand}>
            <h1 className={styles.title}>Pharma News</h1>
            <p className={styles.subtitle}>{t("subtitle")}</p>
          </div>
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
          </ul>
        </nav>

        <div className='d-flex align-center gap-16px'>
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
  
          {/* Authentication */}
          {!isLoggedIn ? (
            <button
              onClick={login}
              className={styles.authButton}
            >
              <LogIn className="w-16" />
              <span>{t("auth.login")}</span>
            </button>
          ) : (
            <div className={styles.userMenuWrapper} ref={userMenuRef}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className={styles.userMenuButton}
              >
                {userInfo?.avatar_URL ? (
                  <img 
                    src={userInfo.avatar_URL} 
                    alt="User Avatar"
                    className={styles.userAvatar}
                  />
                ) : (
                  <div className={styles.userAvatarFallback}>
                    <User className={styles.userAvatarFallbackIcon} />
                  </div>
                )}
                <div className={styles.userInfoBlock}>
                  <p className={styles.userInfoName}>
                    {userInfo?.display_name || userInfo?.username || 'User'}
                  </p>
                  <p className={styles.userInfoEmail}>{userInfo?.email}</p>
                </div>
                <ChevronDown className={`${styles.chevron} ${userMenuOpen ? styles.chevronOpen : ''}`} />
              </button>
  
              {userMenuOpen && (
                <div className={styles.userDropdown}>
                  {/* User Info (mobile) */}
                  <div className={styles.userDropdownInfoMobile}>
                    <p className={styles.userDropdownInfoMobileName}>
                      {userInfo?.display_name || userInfo?.username || 'User'}
                    </p>
                    <p className={styles.userDropdownInfoMobileEmail}>{userInfo?.email}</p>
                  </div>
                  
                  {/* Menu Items */}
                  {/* <button className={styles.userDropdownItem}>
                    <User className="w-16" />
                    <span>{t("auth.profile")}</span>
                  </button>
                  
                  <button className={styles.userDropdownItem}>
                    <svg className="w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c..."/>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0..."/>
                    </svg>
                    <span>{t("auth.settings")}</span>
                  </button>
                  
                  <div className={styles.userDropdownDivider}></div> */}
                  
                  <button
                    onClick={logout}
                    className={`${styles.userDropdownItem} ${styles.userDropdownItemDanger}`}
                  >
                    <LogOut className="w-16" />
                    <span>{t("auth.logout")}</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
