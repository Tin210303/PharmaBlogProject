import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBlog } from '../../hooks/useBlog';
import type { BlogPost } from '../../types/blog';
import { Heart, MoreHorizontal, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import styles from './index.module.css';

interface BlogCardProps {
  post: BlogPost;
  onLike: (id: number) => void;
  onPostClick: (id: number) => void; // Thêm prop cho xử lý click
}

const BlogCard: React.FC<BlogCardProps> = ({ post, onLike, onPostClick }) => {
  // Xử lý click vào card (tránh trigger khi click vào button like hoặc more)
  const handleCardClick = (e: React.MouseEvent) => {
    // Kiểm tra xem có click vào button không
    const target = e.target as HTMLElement;
    if (target.closest('button')) {
      return;
    }
    onPostClick(post.id);
  };

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Ngăn event bubbling
    onLike(post.id);
  };

  const handleMoreClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Xử lý logic cho more button ở đây
    console.log('More options for post:', post.id);
  };

  return (
    <article 
      className={styles.blogCard}
      onClick={handleCardClick}
    >
      {/* Image */}
      <div className={styles.imageContainer}>
        <img 
          src={post.image} 
          alt={post.title}
          className={styles.cardImage}
        />
      </div>
      
      {/* Content */}
      <div className={styles.cardContent}>
        {/* Author & Date */}
        <div className={styles.authorSection}>
          <div className={styles.authorInfo}>
            <div className={styles.authorAvatar}>
              <User size={16} />
            </div>
            <div className={styles.authorDetails}>
              <div className={styles.authorName}>{post.author}</div>
              <div>{post.date} • {post.readTime}</div>
            </div>
          </div>
          
          <button 
            className={styles.moreButton}
            onClick={handleMoreClick}
          >
            <MoreHorizontal size={16} />
          </button>
        </div>
        
        {/* Title */}
        <h2 className={styles.cardTitle}>
          {post.title}
        </h2>
        
        {/* Subtitle */}
        <p className={styles.cardSubtitle}>
          {post.subtitle}
        </p>
        
        {/* Stats */}
        <div className={styles.cardStats}>
          <span className={styles.views}>{post.views} views</span>
          
          <button 
            onClick={handleLikeClick}
            className={`${styles.likeButton} ${post.isLiked ? styles.liked : ''}`}
          >
            <Heart size={16} />
            <span>{post.likes}</span>
          </button>
        </div>
      </div>
    </article>
  );
};

const Blog: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [page, setPage] = useState(1);

  const { t } = useTranslation();

  // Lấy posts từ hook useBlog
  const { posts, loading, error, totalPages, fetchPosts } = useBlog({
    initialParams: { per_page: 6, page: 1, orderby: "date", order: "desc" },
    autoFetch: true,
  });

  const navigate = useNavigate();

  const filters = [
    { key: "all", label: t("blog.filters.all") },
    { key: "recent", label: t("blog.filters.recent") },
    { key: "news", label: t("blog.filters.news") },
    { key: "academic", label: t("blog.filters.academic") },
    { key: "stories", label: t("blog.filters.stories") },
  ];

  // Toggle like cho 1 post
  const handleLike = (postId: number) => {
    console.log('Like post:', postId);
  };

  // Điều hướng khi click vào post
  const handlePostClick = (slug?: string) => {
    navigate(`/posts/${slug}`);
  };

  // Tải thêm post
  const handleLoadMore = () => {
    if (page < totalPages) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchPosts({ per_page: 6, page: nextPage, orderby: "date", order: "desc" }, true);
    }
  };

  return (
    <div className={styles.blogContainer}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>Blog</h1>
        
        {/* Filter Tabs */}
        <div className={styles.filterTabs}>
          {filters.map((filter) => (
            <button
              key={filter.key}
              onClick={() => setActiveFilter(filter.key)}
              className={`${styles.filterTab} ${
                activeFilter === filter.key ? styles.active : ""
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Loading / Error */}
      {loading && <p>Loading posts...</p>}
      {error && <p className={styles.error}>Error: {error}</p>}

      {/* Blog Grid */}
      <div className={styles.blogGrid}>
        {posts.map((post) => (
          <BlogCard
            key={post.id}
            post={post}
            onLike={handleLike}
            onPostClick={() => handlePostClick(post.slug)}
          />
        ))}
      </div>

      {/* Load More Button */}
      {page < totalPages && (
        <div className={styles.loadMoreWrapper}>
          <button
            onClick={handleLoadMore}
            disabled={loading}
            className={styles.loadMoreBtn}
          >
            {loading ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </div>
  );
};

export default Blog;
