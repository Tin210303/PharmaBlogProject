import React from 'react';
import logo from '../../assets/imgs/logo.jpg';
import { useTranslation } from 'react-i18next';
import styles from './index.module.css';

const About: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section className={styles.aboutSection}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Left Column - Image */}
          <div className={styles.imageColumn}>
            <div className={styles.imageContainer}>
              <img 
                src={logo}
                alt='Image'
                className={styles.profileImage}
              />
            </div>
          </div>

          {/* Right Column - Content */}
          <div className={styles.contentColumn}>
            <div className={styles.header}>
              <h1 className={styles.mainTitle}>
                {t("about.content.greeting")},
              </h1>
            </div>

            <div className={styles.content}>
              <p className={styles.paragraph}>
                {t("about.content.paragraph1")}
              </p>

              <p className={styles.paragraph}>
                {t("about.content.paragraph2")}
              </p>

              <p className={styles.paragraph}>
                {t("about.content.paragraph3")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;