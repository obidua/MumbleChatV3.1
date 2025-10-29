import { Paper } from "@mantine/core";
import { BreakableText } from "@/components/Messages/BreakableText";
import classes from "./TextContent.module.css";

export type TextContentProps = {
  text: string;
  align?: "left" | "right";
};

export const TextContent: React.FC<TextContentProps> = ({ text, align = "left" }) => {
  const bubbleClass = align === "right" ? classes.outbound : classes.inbound;
  return (
    <Paper
      className={[classes.text, bubbleClass].join(" ")}
      onClick={(event) => {
        event.stopPropagation();
      }}
      shadow="sm"
      py="xs"
      px="sm"
      radius="lg">
      <BreakableText>{text}</BreakableText>
    </Paper>
  );
};
