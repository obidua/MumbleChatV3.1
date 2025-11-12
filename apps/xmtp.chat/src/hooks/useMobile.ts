import { useMediaQuery } from "@mantine/hooks";

/**
 * Hook to detect if the user is on a mobile device
 * Returns true if viewport width is less than 768px (tablet breakpoint)
 */
export const useMobile = () => {
  return useMediaQuery("(max-width: 767px)", false);
};

/**
 * Hook to detect if the user is on a small mobile device
 * Returns true if viewport width is less than 480px
 */
export const useSmallMobile = () => {
  return useMediaQuery("(max-width: 479px)", false);
};
