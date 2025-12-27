import { useEffect, useRef, useState, type FC, type ReactNode } from "react";
import classes from "../LandingPages.module.css";

interface AnimatedSectionProps {
  children: ReactNode;
  animation?:
    | "fade-up"
    | "fade-down"
    | "slide-left"
    | "slide-right"
    | "scale-up"
    | "blur-in";
  delay?: number;
  threshold?: number;
}

export const AnimatedSection: FC<AnimatedSectionProps> = ({
  children,
  animation = "fade-up",
  delay = 0,
  threshold = 0.1,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold },
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [threshold]);

  const animationClass = {
    "fade-up": classes.animateFadeUp,
    "fade-down": classes.animateFadeDown,
    "slide-left": classes.animateSlideLeft,
    "slide-right": classes.animateSlideRight,
    "scale-up": classes.animateScaleUp,
    "blur-in": classes.animateBlurIn,
  }[animation];

  return (
    <div
      ref={ref}
      className={`${classes.animatedSection} ${isVisible ? animationClass : classes.animateHidden}`}
      style={{ animationDelay: `${delay}s` }}>
      {children}
    </div>
  );
};
