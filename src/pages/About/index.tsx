import React from 'react';
import styles from './index.module.css';

interface AboutProps {
  name?: string;
  title?: string;
  image?: string;
  content?: {
    paragraph1?: string;
    paragraph2?: string;
    paragraph3?: string;
  };
}

const About: React.FC<AboutProps> = ({
  name = "Dena",
  title = "A pharmacy researcher & blogger",
  image = "https://static.wixstatic.com/media/f5af78_b580b4e87e1c4faca352062721acce80~mv2_d_6720_4480_s_4_2.jpg/v1/crop/x_2554,y_0,w_3618,h_4480/fill/w_442,h_547,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/about_page_image.jpg",
  content = {
    paragraph1: "I have a strong passion for the world of pharmacy and the way it shapes modern healthcare. My journey began with a curiosity about how medicines work and how they can be used safely to improve people’s lives. Over time, this curiosity grew into a commitment to explore, learn, and share insights that make the science of pharmacy more approachable for everyone.",
    paragraph2: "Through this blog, I write about a wide range of topics related to pharmacy: medication safety, proper usage, new research findings, and practical health tips. My goal is to translate complex pharmaceutical knowledge into simple, useful information that readers can easily apply in their daily lives. Whether you are a student, a healthcare professional, or simply someone interested in health, I hope my writing helps you gain clearer understanding and confidence when it comes to medicines and wellness.",
    paragraph3: "For me, pharmacy is not just about drugs and prescriptions—it’s about people, their health journeys, and the science that supports better quality of life. By combining research with real-world stories, I want to create a community where knowledge is shared, curiosity is encouraged, and learning about health feels both meaningful and inspiring. This blog is my way of contributing to a healthier future, one post at a time."
  }
}) => {
  return (
    <section className={styles.aboutSection}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Left Column - Image */}
          <div className={styles.imageColumn}>
            <div className={styles.imageContainer}>
              <img 
                src={image}
                alt={`${name} - ${title}`}
                className={styles.profileImage}
              />
            </div>
          </div>

          {/* Right Column - Content */}
          <div className={styles.contentColumn}>
            <div className={styles.header}>
              <h1 className={styles.mainTitle}>
                Hi! I'm {name},
              </h1>
              <h2 className={styles.subtitle}>
                {title}
              </h2>
            </div>

            <div className={styles.content}>
              <p className={styles.paragraph}>
                {content.paragraph1}
              </p>

              <p className={styles.paragraph}>
                {content.paragraph2}
              </p>

              <p className={styles.paragraph}>
                {content.paragraph3}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;