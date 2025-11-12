import { useMediaQuery } from "@mantine/hooks";

export const useCollapsedMediaQuery = () => {
  // Get the initial value based on window.matchMedia for proper mobile device detection
  const getInitialValue = () => {
    if (typeof window !== "undefined") {
      return window.matchMedia("(max-width: 1080px)").matches;
    }
    return false;
  };

  return useMediaQuery("(max-width: 1080px)", getInitialValue());
};
