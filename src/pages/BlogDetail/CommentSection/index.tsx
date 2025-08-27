import { useState } from "react";
import styles from '../index.module.css';
import { User } from "lucide-react";

interface Comment {
    id: number;
    author: string;
    content: string;
    date: string;
    avatar?: string;
}

export const CommentsSection = () => {
    const [commentText, setCommentText] = useState('');
    const [comments] = useState<Comment[]>([]);

    const handleCommentSubmit = () => {
        if (commentText.trim()) {
            // Handle comment submission logic here
            console.log('Comment submitted:', commentText);
            setCommentText('');
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
    )
}