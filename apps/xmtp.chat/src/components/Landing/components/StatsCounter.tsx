import { useEffect, useRef, useState, type FC } from "react";
import classes from "../LandingPages.module.css";

interface StatsCounterProps {
  end: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  label: string;
  duration?: number;
}

export const StatsCounter: FC<StatsCounterProps> = ({
  end,
  prefix = "",
  suffix = "",
  decimals = 0,
  label,
  duration = 2500,
}) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.3 },
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const startTime = performance.now();
    const step = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Enhanced easing function (ease-out-expo with bounce)
      let eased: number;
      if (progress < 0.9) {
        eased = 1 - Math.pow(2, -12 * progress);
      } else {
        // Small overshoot and settle
        const bounceProgress = (progress - 0.9) / 0.1;
        eased = 1 + Math.sin(bounceProgress * Math.PI) * 0.02;
      }

      setCount(Math.min(eased * end, end));

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setCount(end);
        setIsComplete(true);
      }
    };

    requestAnimationFrame(step);
  }, [isVisible, end, duration]);

  const formattedCount = count.toFixed(decimals);
  
  // Add thousands separator for large numbers
  const displayCount = Number(formattedCount).toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return (
    <div 
      ref={ref} 
      className={`${classes.statItem} ${isVisible ? classes.statVisible : ''} ${isComplete ? classes.statComplete : ''}`}
    >
      <span className={classes.statNumber}>
        {prefix}
        {displayCount}
        {suffix}
      </span>
      <span className={classes.statLabel}>{label}</span>
    </div>
  );
};
