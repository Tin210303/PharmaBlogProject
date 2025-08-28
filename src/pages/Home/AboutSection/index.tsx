// AboutSection.tsx
import React, { useEffect, useRef, useState } from 'react';
import styles from './index.module.css';
import { useTranslation } from 'react-i18next';

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
  name = "Dena",
  title = "A pharmacy blogger. Passionate about sharing knowledge, experiences, and insights on healthcare and everything that helps improve well-being.",
  description = "I'm a paragraph. Click here to add your own text and edit me. It's easy. Just click \"Edit Text\" or double click me to add your own content and make changes to the font. Feel free to drag and drop me anywhere you like on your page. I'm a great place for you to tell a story and let your users know a little more about you.",
  image = 'https://static.wixstatic.com/media/f5af78_6af31cb479544a4cb2d3897da7841094~mv2_d_6720_4480_s_4_2.jpg/v1/crop/x_2553,y_0,w_3425,h_4480/fill/w_420,h_548,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/about_HP_image.jpg',
  imageAlt = 'Portrait of Dena in purple jacket',
  buttonText = "Read More",
  onButtonClick
}) => {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

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
            <h2 className={styles.greeting}>{t("about.greeting")} {name}</h2>
            
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