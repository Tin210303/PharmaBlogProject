// Header.tsx
import React from 'react';
import styles from './index.module.css';
import { NavLink } from 'react-router-dom';

interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className }) => {
  return (
    <header className={`${styles.header} ${className || ''}`}>
      <div className={styles.container}>
        {/* Logo và tiêu đề */}
        <div className={styles.brand}>
          <h1 className={styles.title}>Pharma News</h1>
          <p className={styles.subtitle}>From Classroom to Clinic: Learning and Applying Pharmacy</p>
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
                Home
              </NavLink>
            </li>
            <li className={styles.navItem}>
              <NavLink
                to="/blog"
                className={({ isActive }) =>
                  `${styles.navLink} ${isActive ? styles.active : ''}`
                }
              >
                Blog
              </NavLink>
            </li>
            <li className={styles.navItem}>
              <NavLink
                to="/about"
                className={({ isActive }) =>
                  `${styles.navLink} ${isActive ? styles.active : ''}`
                }
              >
                About
              </NavLink>
            </li>
            <li className={styles.navItem}>
              <NavLink
                to="/contact"
                className={({ isActive }) =>
                  `${styles.navLink} ${isActive ? styles.active : ''}`
                }
              >
                Contact
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
