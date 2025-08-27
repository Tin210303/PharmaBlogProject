import { Eye, Heart } from "lucide-react";
import { useState } from "react";
import styles from '../index.module.css';

interface RecentPost {
    id: number;
    title: string;
    image: string;
    views: number;
    likes: number;
}

export const RecentPostsSection = () => {
    const [recentPosts] = useState<RecentPost[]>([
        {
          id: 2,
          title: "Can't stop scrolling through your friends'...",
          image: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&h=300&fit=crop",
          views: 785,
          likes: 21
        },
        {
          id: 3,
          title: "How I stopped being afraid of being weak",
          image: "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=400&h=300&fit=crop",
          views: 641,
          likes: 21
        },
        {
          id: 4,
          title: "5 great side effects of running with music",
          image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
          views: 505,
          likes: 8
        }
    ]);

    return (
        <section className={styles.recentPostsSection}>
            <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Recent Posts</h2>
                <button className={styles.seeAllButton}>See All</button>
            </div>

            <div className={styles.recentPostsGrid}>
                {recentPosts.map((recentPost) => (
                    <article key={recentPost.id} className={styles.recentPostCard}>
                        <div className={styles.recentPostImage}>
                            <img 
                                src={recentPost.image} 
                                alt={recentPost.title}
                            />
                        </div>
                        <div className={styles.recentPostContent}>
                            <h3 className={styles.recentPostTitle}>{recentPost.title}</h3>
                            <div className={styles.recentPostStats}>
                                <span className={styles.recentPostViews}>
                                    <Eye size={14} />
                                    {recentPost.views}
                                </span>
                                <span className={styles.recentPostLikes}>
                                    <Heart size={14} />
                                    {recentPost.likes}
                                </span>
                            </div>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    )
}