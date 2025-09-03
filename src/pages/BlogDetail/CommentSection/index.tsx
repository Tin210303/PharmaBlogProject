import { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import styles from "../index.module.css";
import { User } from "lucide-react";
import { useTranslation } from "react-i18next";

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

export const CommentsSection = ({ postId }: CommentsSectionProps) => {
  const [commentText, setCommentText] = useState("");

  const [comments, setComments] = useState<Comment[]>([]);

  const [loading, setLoading] = useState(false);

  const { isLoggedIn, userInfo, login } = useAuth();

  const { t } = useTranslation();

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
      })
      .catch((err) => {
        console.error("Error fetching comments:", err);
        setLoading(false);
      });
  }, [postId]);

  const handleCommentSubmit = async () => {
    if (!commentText.trim()) return;

    const token = localStorage.getItem("wp_token");
    if (isLoggedIn && token) {
      try {
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
          setComments([newComment, ...comments]);
          setCommentText("");
        } else {
          console.error("Failed to post comment");
        }
      } catch (error) {
        console.error("Error posting comment:", error);
      }
    } else {
      alert("Vui lòng đăng nhập để đăng comment!");
    }
  };

  return (
    <section className={styles.commentsSection}>
      <h2 className={styles.commentsTitle}>{t("comments.title")}</h2>

      <div className={styles.commentForm}>
        <textarea
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder={
            isLoggedIn ? `${t("comments.write")}` : `${t("comments.please")}`
          }
          className={styles.commentInput}
          rows={4}
          disabled={!isLoggedIn}
        />

        <div className={styles.commentActions}>
          <div className={styles.commentTools}>
            <button disabled={!isLoggedIn}>😊</button>
            <button disabled={!isLoggedIn}>📷</button>
          </div>

          <div className={styles.commentSubmitActions}>
            {isLoggedIn ? (
              <div className={styles.userInfo}>
                <span>
                  {t("comments.comment")} {userInfo?.display_name || userInfo?.username}
                </span>
              </div>
            ) : (
              <button onClick={login} className={styles.loginLink}>
                {t("comments.request")}
              </button>
            )}

            <div className={styles.submitButtons}>
              <button
                onClick={() => setCommentText("")}
                className={styles.cancelButton}
                disabled={!isLoggedIn}
              >
                {t("comments.cancel")}
              </button>
              <button
                onClick={handleCommentSubmit}
                className={styles.publishButton}
                disabled={!commentText.trim() || !isLoggedIn}
              >
                {isLoggedIn ? `${t("comments.publish")}` : `${t("comments.logtopublish")}`}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Comments list */}
      {loading ? (
        <p>{t("comments.loading")}</p>
      ) : comments.length === 0 ? (
        <div className={styles.noComments}>
          <p>{t("comments.nocomment")}</p>
        </div>
      ) : (
        <div className={styles.commentsList}>
          {comments.map((comment) => (
            <div key={comment.id} className={styles.comment}>
              <div className={styles.commentAvatar}>
                {comment.author_avatar_urls ? (
                  <img src={comment.author_avatar_urls["48"]} alt={comment.author_name} />
                ) : (
                  <User size={16} />
                )}
              </div>
              <div className={styles.commentContent}>
                <div>
                  <strong>{comment.author_name}</strong>{" "}
                  <span>{new Date(comment.date).toLocaleString()}</span>
                </div>
                <div
                  dangerouslySetInnerHTML={{ __html: comment.content.rendered }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
