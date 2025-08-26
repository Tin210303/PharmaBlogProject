// RecentPosts.tsx
import React, { useEffect, useRef, useState } from 'react';
import styles from './index.module.css';
import { useBlog } from '../../../hooks/useBlog';
import { useNavigate } from 'react-router-dom';

interface RecentPostsProps {
  className?: string;
}

const RecentPosts: React.FC<RecentPostsProps> = ({ className }) => {
  const { posts, loading, error } = useBlog({
    initialParams: { per_page: 3, orderby: 'date', order: 'desc' },
    autoFetch: true
  });

  const [visiblePosts, setVisiblePosts] = useState<Set<number>>(new Set());
  const postRefs = useRef<Map<number, HTMLElement>>(new Map());
  
  useEffect(() => {
    if (!posts.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const postId = entry.target.getAttribute('data-post-id');
          if (postId) {
            const idNum = parseInt(postId);
            if (entry.isIntersecting) {
              setVisiblePosts((prev) => new Set([...prev, idNum]));
            }
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px',
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

  const setPostRef = (postId: number) => (el: HTMLElement | null) => {
    if (el) {
      postRefs.current.set(postId, el);
    } else {
      postRefs.current.delete(postId);
    }
  };
  
  const navigate = useNavigate();

  return (
    <section className={`${styles.recentPosts} ${className || ''}`}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Recent Posts</h2>
        </div>

        {loading && <p>Loading posts...</p>}
        {error && <p className={styles.error}>Error: {error}</p>}

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
              onClick={() => navigate(`/posts/${post.slug}`)} 
            >
              <div className={styles.postImage}>
                <img
                  src={post.image}
                  alt={post.title}
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
                    {post.likes} likes • {post.views} views
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
