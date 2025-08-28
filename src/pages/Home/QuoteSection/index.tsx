// QuoteSection.tsx
import React, { useEffect, useRef, useState } from 'react';
import styles from './index.module.css';
import { useTranslation } from 'react-i18next';

interface Quote {
  text: string;
  author: string;
  source?: string;
}

interface QuoteSectionProps {
  className?: string;
  quote?: Quote;
  image?: string;
  imageAlt?: string;
}

const QuoteSection: React.FC<QuoteSectionProps> = ({ 
  className,
  quote = {
    text: "I always get to where I'm going by walking away from where I have been.",
    author: "Winnie the Pooh",
    source: "A.A. Milne"
  },
  image = 'https://static.wixstatic.com/media/f5af78_81b23a68d5ac4cb699ddd6f7fbd93035~mv2_d_3000_2246_s_2.jpg/v1/fill/w_440,h_440,fp_0.50_0.50,q_90,enc_avif,quality_auto/f5af78_81b23a68d5ac4cb699ddd6f7fbd93035~mv2_d_3000_2246_s_2.webp',
  imageAlt = 'Hand reaching towards light'
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
        threshold: 0.3,
        rootMargin: '0px 0px -100px 0px'
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

  return (
    <section 
      ref={sectionRef}
      className={`${styles.quoteSection} ${className || ''} ${
        isVisible ? styles.visible : ''
      }`}
    >
      <div className={styles.container}>
        {/* Left side - Quote */}
        <div className={styles.quoteContent}>
          <div className={styles.quoteWrapper}>
            <div className={styles.openQuote}>"</div>
            <blockquote className={styles.quoteText}>
              {t("quote.defaultText")}
            </blockquote>
            <div className={styles.closeQuote}>"</div>
          </div>
          
          <div className={styles.attribution}>
            <span className={styles.author}>— {quote.author}</span>
            {quote.source && (
              <span className={styles.source}>, {quote.source}</span>
            )}
          </div>
        </div>

        {/* Right side - Image */}
        <div className={styles.imageSection}>
          <div className={styles.imageWrapper}>
            <img 
              src={image} 
              alt={imageAlt}
              className={styles.quoteImage}
            />
            <div className={styles.imageOverlay}></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default QuoteSection;