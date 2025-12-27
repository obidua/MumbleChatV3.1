import { useEffect, useState, type FC } from "react";
import classes from "../LandingPages.module.css";

export const ScrollProgress: FC = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setProgress(scrollPercent);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className={classes.scrollProgress}>
      <div 
        className={classes.scrollProgressBar} 
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};
