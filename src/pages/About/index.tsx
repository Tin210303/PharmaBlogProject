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
  title = "A mental health advocate & blogger",
  image = "https://static.wixstatic.com/media/f5af78_b580b4e87e1c4faca352062721acce80~mv2_d_6720_4480_s_4_2.jpg/v1/crop/x_2554,y_0,w_3618,h_4480/fill/w_442,h_547,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/about_page_image.jpg",
  content = {
    paragraph1: "I'm a paragraph. Click here to add your own text and edit me. It's easy. Just click \"Edit Text\" or double click me to add your own content and make changes to the font. Feel free to drag and drop me anywhere you like on your page. I'm a great place for you to tell a story and let your users know a little more about you.",
    paragraph2: "This is a great space to write long text about your company and your services. You can use this space to go into a little more detail about your company. Talk about your team and what services you provide. Tell your visitors the story of how you came up with the idea for your business and what makes you different from your competitors. Make your company stand out and show your visitors who you are.",
    paragraph3: "At Wix we're passionate about making templates that allow you to build fabulous websites and it's all thanks to the support and feedback from users like you! Keep up to date with New Releases and what's Coming Soon in Wix ellaneous in Support. Feel free to tell us what you think and give us feedback in the Wix Forum. If you'd like to benefit from a professional designer's touch, head to the Wix Arena and connect with one of our Wix Pro designers. Or if you need more help you can simply type your questions into the Support Forum and get instant answers. To keep up to date with everything Wix, including tips and things we think are cool, just head to the Wix Blog!"
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