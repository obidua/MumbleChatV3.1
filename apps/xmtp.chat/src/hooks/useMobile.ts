import { useMediaQuery } from "@mantine/hooks";

/**
 * Hook to detect if the user is on a mobile device
 * Returns true if viewport width is less than 768px (tablet breakpoint)
 *
 * IMPORTANT: Uses window.matchMedia to determine initial value for proper SSR/mobile support
 */
export const useMobile = () => {
  // Get the initial value based on window.matchMedia for proper mobile device detection
  const getInitialValue = () => {
    if (typeof window !== "undefined") {
      return window.matchMedia("(max-width: 767px)").matches;
    }
    return false;
  };

  return useMediaQuery("(max-width: 767px)", getInitialValue());
};

/**
 * Hook to detect if the user is on a small mobile device
 * Returns true if viewport width is less than 480px
 */
export const useSmallMobile = () => {
  // Get the initial value based on window.matchMedia for proper mobile device detection
  const getInitialValue = () => {
    if (typeof window !== "undefined") {
      return window.matchMedia("(max-width: 479px)").matches;
    }
    return false;
  };

  return useMediaQuery("(max-width: 479px)", getInitialValue());
};
