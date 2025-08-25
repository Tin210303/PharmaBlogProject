// RecentPosts.tsx
import React, { useEffect, useRef, useState } from 'react';
import styles from './index.module.css';

interface RecentPost {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  imageAlt: string;
  date: string;
  readTime: string;
  comments: number;
}

interface RecentPostsProps {
  className?: string;
  posts?: RecentPost[];
}

const RecentPosts: React.FC<RecentPostsProps> = ({ 
  className,
  posts = [
    {
      id: '1',
      title: 'The one thing I would tell to my 16 year old self',
      subtitle: 'Create a blog post subtitle that summarizes your post in a few short, punchy sentences and entices your audience to continue reading....',
      image: 'https://static.wixstatic.com/media/f5af78_8a0c0c7ad0524e8c9db0ea850035c1cb~mv2_d_3000_2246_s_2.jpg/v1/fill/w_471,h_354,fp_0.50_0.50,q_90,enc_avif,quality_auto/f5af78_8a0c0c7ad0524e8c9db0ea850035c1cb~mv2_d_3000_2246_s_2.webp',
      imageAlt: 'White sneakers on concrete ground',
      date: 'May 1, 2023',
      readTime: '2 min read',
      comments: 0
    },
    {
      id: '2',
      title: "Can't stop scrolling through",
      subtitle: 'Create a blog post subtitle that summarizes your post in a few short, punchy sentences and entices your audience to continue reading....',
      image: 'https://static.wixstatic.com/media/f5af78_9340967f266a43d1a4be9b8628a4cf31~mv2_d_3000_2246_s_2.jpg/v1/fill/w_471,h_354,fp_0.50_0.50,q_90,enc_avif,quality_auto/f5af78_9340967f266a43d1a4be9b8628a4cf31~mv2_d_3000_2246_s_2.webp',
      imageAlt: 'Orange beanie on green grass',
      date: 'May 1, 2023',
      readTime: '2 min read',
      comments: 0
    },
    {
      id: '3',
      title: "5 great side effects of running with music",
      subtitle: 'Create a blog post subtitle that summarizes your post in a few short, punchy sentences and entices your audience to continue reading....',
      image: 'https://static.wixstatic.com/media/f5af78_5f1baf13e0f947e3a8edca6dfeb0113f~mv2_d_3000_2246_s_2.jpg/v1/fill/w_471,h_354,fp_0.50_0.50,q_90,enc_avif,quality_auto/f5af78_5f1baf13e0f947e3a8edca6dfeb0113f~mv2_d_3000_2246_s_2.webp',
      imageAlt: 'Orange beanie on green grass',
      date: 'May 1, 2023',
      readTime: '2 min read',
      comments: 0
    }
  ]
}) => {
  const [visiblePosts, setVisiblePosts] = useState<Set<string>>(new Set());
  const postRefs = useRef<Map<string, HTMLElement>>(new Map());

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const postId = entry.target.getAttribute('data-post-id');
          if (postId) {
            if (entry.isIntersecting) {
              setVisiblePosts(prev => new Set([...prev, postId]));
            }
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    postRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      postRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, [posts]);

  const setPostRef = (postId: string) => (el: HTMLElement | null) => {
    if (el) {
      postRefs.current.set(postId, el);
    } else {
      postRefs.current.delete(postId);
    }
  };
  return (
    <section className={`${styles.recentPosts} ${className || ''}`}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Recent Posts</h2>
        </div>

        <div className={styles.postsList}>
          {posts.map((post, index) => (
            <article 
              key={post.id} 
              ref={setPostRef(post.id)}
              data-post-id={post.id}
              className={`${styles.postItem} ${
                visiblePosts.has(post.id) ? styles.visible : ''
              }`}
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className={styles.postImage}>
                <img 
                  src={post.image} 
                  alt={post.imageAlt}
                  className={styles.postImg}
                />
              </div>
              
              <div className={styles.postContent}>
                <div className={styles.postMeta}>
                  <span className={styles.postDate}>{post.date}</span>
                  <span className={styles.separator}>•</span>
                  <span className={styles.readTime}>{post.readTime}</span>
                </div>
                
                <h3 className={styles.postTitle}>{post.title}</h3>
                <p className={styles.postSubtitle}>{post.subtitle}</p>
                
                <div className={styles.postFooter}>
                  <span className={styles.comments}>
                    {post.comments} comments
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecentPosts;