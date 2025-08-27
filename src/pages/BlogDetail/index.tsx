import React, { useEffect, useState, useRef } from 'react';
import { User, MoreHorizontal, Heart, Eye, Facebook, Twitter, Linkedin, Share, X, ZoomIn } from 'lucide-react';
import styles from './index.module.css';
import { useParams } from 'react-router-dom';
import { blogService } from '../../service/blogService';

interface BlogPost {
  id: number;
  title: string;
  subtitle: string;
  content: string;
  image: string;
  author: string;
  date: string;
  readTime: string;
  views: number;
  likes: number;
  isLiked?: boolean;
}

interface RecentPost {
  id: number;
  title: string;
  image: string;
  views: number;
  likes: number;
}

interface Comment {
  id: number;
  author: string;
  content: string;
  date: string;
  avatar?: string;
}

// Image Zoom Modal Component
const ImageZoomModal: React.FC<{
  src: string;
  alt: string;
  isOpen: boolean;
  onClose: () => void;
}> = ({ src, alt, isOpen, onClose }) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className={styles.imageZoomModal} 
      onClick={onClose}
      role="dialog"
      aria-label="Zoomed image"
    >
      <div className={styles.modalOverlay} />
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <img 
          src={src} 
          alt={alt} 
          className={styles.zoomedImage}
        />
      </div>
    </div>
  );
};

const BlogDetail: React.FC = () => {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { slug } = useParams<{ slug: string }>();
  const [comments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState('');
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

  const handleCommentSubmit = () => {
    if (commentText.trim()) {
      // Handle comment submission logic here
      console.log('Comment submitted:', commentText);
      setCommentText('');
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

      {/* Comments Section */}
      <section className={styles.commentsSection}>
        <h2 className={styles.commentsTitle}>Comments</h2>
        
        {/* Comment Form */}
        <div className={styles.commentForm}>
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Write a comment..."
            className={styles.commentInput}
            rows={4}
          />
          
          <div className={styles.commentActions}>
            <div className={styles.commentTools}>
              <button className={styles.commentTool} title="Add emoji">
                😊
              </button>
              <button className={styles.commentTool} title="Add image">
                📷
              </button>
              <button className={styles.commentTool} title="Add GIF">
                GIF
              </button>
              <button className={styles.commentTool} title="Add video">
                🎥
              </button>
            </div>
            
            <div className={styles.commentSubmitActions}>
              <button className={styles.loginLink}>
                Log in to publish as a member
              </button>
              <div className={styles.submitButtons}>
                <button 
                  onClick={() => setCommentText('')}
                  className={styles.cancelButton}
                >
                  Cancel
                </button>
                <button 
                  onClick={handleCommentSubmit}
                  className={styles.publishButton}
                  disabled={!commentText.trim()}
                >
                  Publish
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Comments List */}
        {comments.length === 0 ? (
          <div className={styles.noComments}>
            <p>No comments yet. Be the first to share your thoughts!</p>
          </div>
        ) : (
          <div className={styles.commentsList}>
            {comments.map((comment) => (
              <div key={comment.id} className={styles.comment}>
                <div className={styles.commentAvatar}>
                  <User size={16} />
                </div>
                <div className={styles.commentContent}>
                  <div className={styles.commentAuthor}>{comment.author}</div>
                  <div className={styles.commentText}>{comment.content}</div>
                  <div className={styles.commentDate}>{comment.date}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

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