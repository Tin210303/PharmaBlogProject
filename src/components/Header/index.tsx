// Header.tsx
import React from 'react';
import styles from './index.module.css';

interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className }) => {
  return (
    <header className={`${styles.header} ${className || ''}`}>
      <div className={styles.container}>
        {/* Logo và tiêu đề */}
        <div className={styles.brand}>
          <h1 className={styles.title}>Inner Pieces</h1>
          <p className={styles.subtitle}>Thoughts on Lifestyle & Mental Health</p>
        </div>

        {/* Menu điều hướng */}
        <nav className={styles.navigation}>
          <ul className={styles.navList}>
            <li className={styles.navItem}>
              <a href="/home" className={styles.navLink}>Home</a>
            </li>
            <li className={styles.navItem}>
              <a href="/blog" className={styles.navLink}>Blog</a>
            </li>
            <li className={styles.navItem}>
              <a href="/about" className={styles.navLink}>About</a>
            </li>
            <li className={styles.navItem}>
              <a href="/contact" className={styles.navLink}>Contact</a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;