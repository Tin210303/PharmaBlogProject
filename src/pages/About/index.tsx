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
    paragraph1: "Chào mừng bạn đến với Pharma News – nơi cập nhật những điểm tin mới nhất về ngành Dược.",
    paragraph2: "Pharma News được thành lập với sứ mệnh tạo ra một không gian học thuật đáng tin cậy, nơi bạn đọc có thể tìm thấy những kiến thức chuyên sâu về Dược lý và Dược lâm sàng. Bên cạnh đó, chúng tôi cũng mang đến những câu chuyện thú vị và chia sẻ hữu ích, góp phần giúp bạn đọc có thêm góc nhìn về cuộc sống và công việc trong ngành.",
    paragraph3: "Pharma News kỳ vọng sẽ trở thành một kênh thông tin học thuật uy tín, đồng hành cùng bạn đọc trên con đường học tập và làm việc."
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