import { useState, useEffect } from "react";
import styles from "../index.module.css";
import { User } from "lucide-react";

interface Comment {
  id: number;
  author_name: string;
  date: string;
  content: { rendered: string };
  author_avatar_urls?: { [key: string]: string };
}

interface CommentsSectionProps {
  postId: number;
}

// OAuth constants
const CLIENT_ID = "123712";
const REDIRECT_URI = "https://pharmanews.vercel.app/oauth/callback";
const WP_OAUTH_URL = `https://public-api.wordpress.com/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=global`;

export const CommentsSection = ({ postId }: CommentsSectionProps) => {
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState<any>(null);

  // Kiểm tra trạng thái đăng nhập khi component mount
  useEffect(() => {
    const token = localStorage.getItem("wp_token");
    if (token) {
      setIsLoggedIn(true);
      // Lấy thông tin user từ WordPress API
      fetchUserInfo(token);
    }
  }, []);

  // Fetch thông tin user
  const fetchUserInfo = async (token: string) => {
    try {
      const response = await fetch("https://public-api.wordpress.com/rest/v1/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const userData = await response.json();
        setUserInfo(userData);
      } else {
        // Token có thể đã hết hạn
        localStorage.removeItem("wp_token");
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
      localStorage.removeItem("wp_token");
      setIsLoggedIn(false);
    }
  };

  useEffect(() => {
    if (!postId) return;
    setLoading(true);
    fetch(
      `https://public-api.wordpress.com/wp/v2/sites/clinpharmanews.wordpress.com/comments?post=${postId}`
    )
      .then((res) => res.json())
      .then((data) => {
        setComments(data);
        setLoading(false);
        console.log(data);
      })
      .catch((err) => {
        console.error("Error fetching comments:", err);
        setLoading(false);
      });
  }, [postId]);

  // Xử lý đăng nhập OAuth
  const handleLogin = () => {
    // Chuyển hướng đến WordPress OAuth
    window.location.href = WP_OAUTH_URL;
  };

  // Xử lý đăng xuất
  const handleLogout = () => {
    localStorage.removeItem("wp_token");
    setIsLoggedIn(false);
    setUserInfo(null);
  };

  // Xử lý gửi comment (có thể gửi lên WordPress API nếu đã đăng nhập)
  const handleCommentSubmit = async () => {
    if (!commentText.trim()) return;

    if (isLoggedIn) {
      const token = localStorage.getItem("wp_token");
      if (token) {
        try {
          // Gửi comment lên WordPress API
          const response = await fetch(
            `https://public-api.wordpress.com/wp/v2/sites/clinpharmanews.wordpress.com/comments`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                post: postId,
                content: commentText,
              }),
            }
          );

          if (response.ok) {
            const newComment = await response.json();
            // Thêm comment mới vào danh sách
            setComments([newComment, ...comments]);
            setCommentText("");
            console.log("Comment posted successfully!");
          } else {
            console.error("Failed to post comment");
          }
        } catch (error) {
          console.error("Error posting comment:", error);
        }
      }
    } else {
      console.log("Comment submitted:", commentText);
      setCommentText("");
      // Hiển thị thông báo cần đăng nhập để post comment
      alert("Vui lòng đăng nhập để đăng comment!");
    }
  };

  return (
    <section className={styles.commentsSection}>
      <h2 className={styles.commentsTitle}>Comments</h2>

      {/* Comment Form */}
      <div className={styles.commentForm}>
        <textarea
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder={
            isLoggedIn 
              ? "Write a comment..." 
              : "Please log in to write a comment..."
          }
          className={styles.commentInput}
          rows={4}
          disabled={!isLoggedIn}
        />

        <div className={styles.commentActions}>
          <div className={styles.commentTools}>
            <button 
              className={styles.commentTool} 
              title="Add emoji"
              disabled={!isLoggedIn}
            >
              😊
            </button>
            <button 
              className={styles.commentTool} 
              title="Add image"
              disabled={!isLoggedIn}
            >
              📷
            </button>
            <button 
              className={styles.commentTool} 
              title="Add GIF"
              disabled={!isLoggedIn}
            >
              GIF
            </button>
            <button 
              className={styles.commentTool} 
              title="Add video"
              disabled={!isLoggedIn}
            >
              🎥
            </button>
          </div>

          <div className={styles.commentSubmitActions}>
            {/* Hiển thị nút login/logout dựa vào trạng thái */}
            {isLoggedIn ? (
              <div className={styles.userInfo}>
                <span>Bình luận với tư cách {userInfo?.display_name || userInfo?.username}!</span>
                <button onClick={handleLogout} className={styles.logoutButton}>
                  Đăng xuất
                </button>
              </div>
            ) : (
              <button onClick={handleLogin} className={styles.loginLink}>
                Log in to publish as a member
              </button>
            )}
            
            <div className={styles.submitButtons}>
              <button
                onClick={() => setCommentText("")}
                className={styles.cancelButton}
                disabled={!isLoggedIn}
              >
                Cancel
              </button>
              <button
                onClick={handleCommentSubmit}
                className={styles.publishButton}
                disabled={!commentText.trim() || !isLoggedIn}
              >
                {isLoggedIn ? "Publish" : "Login to Publish"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Comments List */}
      {loading ? (
        <p>Loading comments...</p>
      ) : comments.length === 0 ? (
        <div className={styles.noComments}>
          <p>No comments yet. Be the first to share your thoughts!</p>
        </div>
      ) : (
        <div className={styles.commentsList}>
          {comments.map((comment) => (
            <div key={comment.id} className={styles.comment}>
              <div className={styles.commentAvatar}>
                {comment.author_avatar_urls ? (
                  <img
                    src={comment.author_avatar_urls["48"]}
                    alt={comment.author_name}
                  />
                ) : (
                  <User size={16} />
                )}
              </div>
              <div className={styles.commentContent}>
                <div className="d-flex gap-8px align-center">
                  <div className={styles.commentAuthor}>
                    {comment.author_name}
                  </div>
                  <div className={styles.commentDate}>
                    {new Date(comment.date).toLocaleString()}
                  </div>
                </div>
                <div
                  className={styles.commentText}
                  dangerouslySetInnerHTML={{
                    __html: comment.content.rendered,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};