import { ActionIcon, Badge, Text, Tooltip } from "@mantine/core";
import { useClipboard } from "@mantine/hooks";
import { shortenAddress } from "@/helpers/address";
import { IconCopy } from "@/icons/IconCopy";
import classes from "./BadgeWithCopy.module.css";

type CopyIconProps = {
  value: string;
};

const CopyIcon: React.FC<CopyIconProps> = ({ value }) => {
  const clipboard = useClipboard({ timeout: 1000 });

  const handleCopy = () => {
    clipboard.copy(value);
  };

  const handleKeyboardCopy = (
    event: React.KeyboardEvent<HTMLButtonElement>,
  ) => {
    if (event.key === "Enter" || event.key === " ") {
      handleCopy();
    }
  };

  return (
    <Tooltip
      label={
        clipboard.copied ? (
          <Text size="xs">Copied!</Text>
        ) : (
          <Text size="xs">{value}</Text>
        )
      }
      withArrow
      events={{ hover: true, focus: true, touch: true }}>
      <ActionIcon
        variant="transparent"
        onClick={handleCopy}
        onKeyDown={handleKeyboardCopy}
        aria-label="Copy"
        className={classes.button}>
        <IconCopy />
      </ActionIcon>
    </Tooltip>
  );
};

export type BadgeWithCopyProps = {
  value: string;
  shorten?: boolean;
  startLength?: number;
  endLength?: number;
};

export const BadgeWithCopy: React.FC<BadgeWithCopyProps> = ({
  value,
  shorten = true,
  startLength = 6,
  endLength = 4,
}) => {
  const displayValue = shorten
    ? shortenAddress(value, startLength, endLength)
    : value;

  return (
    <Badge
      variant="filled"
      className={classes.badge}
      w="100%"
      size="xl"
      styles={{
        label: {
          textTransform: "none",
          fontWeight: 400,
          textAlign: "left",
        },
      }}
      rightSection={<CopyIcon value={value} />}>
      {displayValue}
    </Badge>
  );
};
