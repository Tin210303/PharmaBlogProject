import { Eye, Heart } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBlog } from "../../../hooks/useBlog";
import { useTranslation } from "react-i18next";
import styles from '../index.module.css';

export const RecentPostsSection = () => {
    const { t } = useTranslation();

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
        <section className={styles.recentPostsSection}>
            <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>{t("recentPosts.title")}</h2>
                <button 
                    className={styles.seeAllButton}
                    onClick={() => navigate("/blog")}
                >
                    {t("recentPosts.seeall")}
                </button>
            </div>

            {loading && <p>{t("recentPosts.loading")}</p>}
            {error && <p className={styles.error}>{t("recentPosts.error")}: {error}</p>}
        
            <div className={styles.recentPostsGrid}>
                {posts.map((recentPost) => (
                    <article 
                        key={recentPost.id} 
                        ref={setPostRef(recentPost.id)}
                        className={`${styles.recentPostCard} ${
                            visiblePosts.has(recentPost.id) ? styles.visible : ''
                        }`}
                        onClick={() => navigate(`/posts/${recentPost.slug}`)}
                    >
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