import React, { useEffect, useState, useRef } from 'react';
import { User, MoreHorizontal, Heart, Facebook, Twitter, Linkedin, Share } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { blogService } from '../../service/blogService';
import { ImageZoomModal } from './ImageZoomModal';
import { CommentsSection } from './CommentSection';
import { RecentPostsSection } from './RecentPostsSection';
import type { BlogPost } from '../../types/blog';
import styles from './index.module.css';

const BlogDetail: React.FC = () => {
  const [post, setPost] = useState<BlogPost | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  const { slug } = useParams<{ slug: string }>();

  const [isLiked, setIsLiked] = useState(false);

  const [likesCount, setLikesCount] = useState(0);
  
  // Image zoom states
  const [zoomModal, setZoomModal] = useState({
    isOpen: false,
    src: '',
    alt: ''
  });
  
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);

    blogService
      .getPostBySlug(slug)
      .then((data) => {
        if (data) setPost(data);
        else setError("Post not found");
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to fetch post"))
      .finally(() => setLoading(false));
  }, [slug]);

  // Add click listeners to images in post content
  useEffect(() => {
    if (!contentRef.current) return;

    const handleImageClick = (e: Event) => {
      const target = e.target as HTMLElement;
      
      if (target.tagName === 'IMG') {
        const img = target as HTMLImageElement;
        setZoomModal({
          isOpen: true,
          src: img.src,
          alt: img.alt || 'Image'
        });
      }
    };

    const contentElement = contentRef.current;
    contentElement.addEventListener('click', handleImageClick);

    return () => {
      contentElement.removeEventListener('click', handleImageClick);
    };
  }, [post?.content]);

  const closeZoomModal = () => {
    setZoomModal({ isOpen: false, src: '', alt: '' });
  };

  if (loading) return <p>Loading post...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!post) return <p>No post found</p>;

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const title = post.title;
    
    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${url}&text=${title}`, '_blank');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        alert('Link copied to clipboard!');
        break;
    }
  };

  return (
    <div className={styles.blogDetailContainer}>
      <article className={styles.blogPost}>
        {/* Header */}
        <header className={styles.postHeader}>
          <div className={styles.authorSection}>
            <div className={styles.authorInfo}>
              <div className={styles.authorAvatar}>
                <User size={20} />
              </div>
              <div className={styles.authorDetails}>
                <div className={styles.authorName}>{post.author}</div>
                <div className={styles.postMeta}>
                  {post.date} • {post.readTime}
                </div>
              </div>
            </div>
            
            <button className={styles.moreButton}>
              <MoreHorizontal size={20} />
            </button>
          </div>

          <h1 className={styles.postTitle}>{post.title}</h1>
        </header>

        {/* Featured Image */}
        <div className={styles.imageContainer}>
          <img 
            src={post.image} 
            alt={post.title}
            className={styles.featuredImage}
            onClick={() => setZoomModal({
              isOpen: true,
              src: post.image,
              alt: post.title
            })}
            style={{ cursor: 'zoom-in' }}
          />
        </div>

        {/* Content */}
        <div className={styles.postContent} ref={contentRef}>
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>

        {/* Social Share */}
        <div className={styles.shareSection}>
          <button 
            onClick={() => handleShare('facebook')}
            className={styles.shareButton}
            aria-label="Share on Facebook"
          >
            <Facebook size={20} />
          </button>
          <button 
            onClick={() => handleShare('twitter')}
            className={styles.shareButton}
            aria-label="Share on Twitter"
          >
            <Twitter size={20} />
          </button>
          <button 
            onClick={() => handleShare('linkedin')}
            className={styles.shareButton}
            aria-label="Share on LinkedIn"
          >
            <Linkedin size={20} />
          </button>
          <button 
            onClick={() => handleShare('copy')}
            className={styles.shareButton}
            aria-label="Copy link"
          >
            <Share size={20} />
          </button>
        </div>

        {/* Post Stats */}
        <div className={styles.postStats}>
          <span className={styles.views}>
            {post.views.toLocaleString()} views
          </span>
          <button 
            onClick={handleLike}
            className={`${styles.likeButton} ${isLiked ? styles.liked : ''}`}
          >
            <Heart size={16} fill={isLiked ? '#ff6b6b' : 'none'} />
            <span>{likesCount}</span>
          </button>
        </div>
      </article>

      {/* Recent Posts Section */}
      <RecentPostsSection />

      {/* Comments Section */}
      <CommentsSection />

      {/* Image Zoom Modal */}
      <ImageZoomModal
        src={zoomModal.src}
        alt={zoomModal.alt}
        isOpen={zoomModal.isOpen}
        onClose={closeZoomModal}
      />
    </div>
  );
};

export default BlogDetail;