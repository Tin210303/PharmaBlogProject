// AboutSection.tsx
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import logo from '../../../assets/imgs/logo.jpg';
import styles from './index.module.css';

interface AboutSectionProps {
  className?: string;
  name?: string;
  title?: string;
  description?: string;
  additionalText?: string;
  image?: string;
  imageAlt?: string;
  buttonText?: string;
  onButtonClick?: () => void;
}

const AboutSection: React.FC<AboutSectionProps> = ({ 
  className,
  image = logo,
  imageAlt = 'Portrait of Dena in purple jacket',
  buttonText = "Read More",
  onButtonClick
}) => {
  const { t, i18n } = useTranslation();

  const [isVisible, setIsVisible] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);

  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    // Determine greeting based on current hour
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting(`${t("about.greeting.morning")}`);
    } else if (hour < 18) {
      setGreeting(`${t("about.greeting.afternoon")}`);
    } else {
      setGreeting(`${t("about.greeting.evening")}`);
    }
  }, [i18n.language]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const handleButtonClick = () => {
    if (onButtonClick) {
      onButtonClick();
    }
  };

  return (
    <section 
      ref={sectionRef}
      className={`${styles.aboutSection} ${className || ''} ${
        isVisible ? styles.visible : ''
      }`}
    >
      <div className={styles.container}>
        {/* Left side - Image */}
        <div className={styles.imageSection}>
          <div className={styles.imageWrapper}>
            <img 
              src={image} 
              alt={imageAlt}
              className={styles.profileImage}
            />
          </div>
        </div>

        {/* Right side - Content */}
        <div className={styles.contentSection}>
          <div className={styles.content}>
            <h2 className={styles.greeting}>{greeting}</h2>
            
            <p className={styles.titleText}>{t("about.title")}</p>
            
            <p className={styles.description}>{t("about.description")}</p>
            
            {buttonText && (
              <button 
                className={styles.readMoreBtn}
                onClick={handleButtonClick}
              >
                {t("about.readMore")}
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;