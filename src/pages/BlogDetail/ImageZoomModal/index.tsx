import { useEffect } from "react";
import styles from '../index.module.css';

export const ImageZoomModal: React.FC<{
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