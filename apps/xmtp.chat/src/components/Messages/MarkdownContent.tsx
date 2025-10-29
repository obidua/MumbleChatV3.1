import { Paper } from "@mantine/core";
import { Markdown } from "@/components/Markdown";
import classes from "./MarkdownContent.module.css";

export type MarkdownContentProps = {
  content: string;
  align?: "left" | "right";
};

export const MarkdownContent: React.FC<MarkdownContentProps> = ({
  content,
  align = "left",
}) => {
  const bubbleClass = align === "right" ? classes.outbound : classes.inbound;
  return (
    <Paper
      className={[classes.root, bubbleClass].join(" ")}
      onClick={(event) => {
        event.stopPropagation();
      }}
      py="xs"
      px="sm"
      radius="md">
      <Markdown markdown={content} />
    </Paper>
  );
};
