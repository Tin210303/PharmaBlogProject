import React, { useState, useEffect } from "react";
import { ChevronUp } from "lucide-react";
import styles from "./index.module.css";

const ScrollToTopButton: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 200) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    visible && (
      <button className={styles.scrollToTopBtn} onClick={scrollToTop}>
        <ChevronUp size={20} />
      </button>
    )
  );
};

export default ScrollToTopButton;
