// BlogSection.tsx
import React from 'react';
import styles from './index.module.css';
import RecentPosts from './RecentPosts';
import QuoteSection from './QuoteSection';
import AboutSection from './AboutSection';

interface BlogPost {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  imageAlt: string;
}

interface BlogSectionProps {
  className?: string;
  posts?: BlogPost[];
}

const Home: React.FC<BlogSectionProps> = ({ 
  className,
  posts = [
    {
      id: '1',
      title: 'Detoxing my social media feed',
      subtitle: 'Create a blog post subtitle that summarizes your post in a few short, punchy sentences and entices your audience to continue reading....',
      image: 'https://static.wixstatic.com/media/f5af78_81b23a68d5ac4cb699ddd6f7fbd93035~mv2_d_3000_2246_s_2.jpg/v1/fill/w_440,h_440,fp_0.50_0.50,q_90,enc_avif,quality_auto/f5af78_81b23a68d5ac4cb699ddd6f7fbd93035~mv2_d_3000_2246_s_2.webp',
      imageAlt: 'Cherry blossoms against blue sky'
    }
  ]
}) => {
  return (
    <section className={`${styles.blogSection} ${className || ''}`}>
      <div className={styles.container}>
        {/* Left side - Hero image */}
        <div className={styles.heroSection}>
          <div className={styles.heroImage}>
            <img 
              src="https://static.wixstatic.com/media/11062b_eba6e758b75443d68f803b72f9cc5969~mv2.jpg/v1/fill/w_1470,h_1407,al_c,q_90/11062b_eba6e758b75443d68f803b72f9cc5969~mv2.webp" 
              alt="Person lying on grass with orange beanie" 
              className={styles.heroImg}
            />
          </div>
        </div>

        {/* Right side - Blog content */}
        <div className={styles.contentSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>My Thoughts</h2>
          </div>

          <div className={styles.blogPosts}>
            {posts.map((post) => (
              <article key={post.id} className={styles.blogPost}>
                <div className={styles.postImage}>
                  <img 
                    src={post.image} 
                    alt={post.imageAlt}
                    className={styles.postImg}
                  />
                </div>
                
                <div className={styles.postContent}>
                  <h3 className={styles.postTitle}>{post.title}</h3>
                  <p className={styles.postSubtitle}>{post.subtitle}</p>
                </div>

                <div className={styles.btnContainer}>
                  <button className={styles.seeAllBtn}>All Posts</button>
                </div>
               
              </article>
            ))}
          </div>
        </div>
      </div>
      <RecentPosts />
      <QuoteSection />
      <AboutSection />
    </section>
  );
};

export default Home;