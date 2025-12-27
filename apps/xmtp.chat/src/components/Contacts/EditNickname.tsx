import {
  ActionIcon,
  Button,
  Group,
  Modal,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useCallback, useEffect, useState } from "react";
import { IconEdit } from "@/icons/IconEdit";
import { useContactNickname } from "@/stores/contacts";
import classes from "./EditNickname.module.css";

// Standalone mode - component manages its own modal state
interface EditNicknameStandaloneProps {
  address: string;
  displayName?: string | null;
  variant?: "icon" | "button";
  size?: "xs" | "sm" | "md";
  onNicknameChanged?: (nickname: string | null) => void;
  opened?: never;
  onClose?: never;
}

// Controlled mode - parent controls modal state
interface EditNicknameControlledProps {
  address: string;
  displayName?: string | null;
  opened: boolean;
  onClose: () => void;
  onNicknameChanged?: (nickname: string | null) => void;
  variant?: never;
  size?: never;
}

type EditNicknameProps =
  | EditNicknameStandaloneProps
  | EditNicknameControlledProps;

export const EditNickname: React.FC<EditNicknameProps> = (props) => {
  const { address, displayName, onNicknameChanged } = props;
  const isControlled = "opened" in props && props.opened !== undefined;

  const [internalOpened, { open, close: internalClose }] = useDisclosure(false);
  const opened = isControlled ? props.opened : internalOpened;
  const close = isControlled ? props.onClose : internalClose;

  const { nickname, setNickname, removeNickname } = useContactNickname(address);
  const [inputValue, setInputValue] = useState(nickname ?? "");

  // Reset input when modal opens
  useEffect(() => {
    if (opened) {
      setInputValue(nickname ?? "");
    }
  }, [opened, nickname]);

  const handleOpen = useCallback(() => {
    setInputValue(nickname ?? "");
    open();
  }, [nickname, open]);

  const handleSave = useCallback(() => {
    const trimmed = inputValue.trim();
    if (trimmed) {
      setNickname(trimmed);
      onNicknameChanged?.(trimmed);
    } else {
      removeNickname();
      onNicknameChanged?.(null);
    }
    close();
  }, [inputValue, setNickname, removeNickname, onNicknameChanged, close]);

  const handleRemove = useCallback(() => {
    removeNickname();
    onNicknameChanged?.(null);
    close();
  }, [removeNickname, onNicknameChanged, close]);

  const truncatedAddress = `${address.slice(0, 6)}...${address.slice(-4)}`;

  const variant = !isControlled ? (props.variant ?? "icon") : undefined;
  const size = !isControlled ? (props.size ?? "sm") : undefined;

  return (
    <>
      {!isControlled && variant === "icon" && (
        <ActionIcon
          variant="subtle"
          size={size}
          onClick={handleOpen}
          title="Edit nickname"
          className={classes.editButton}>
          <IconEdit
            width={size === "xs" ? 14 : size === "sm" ? 16 : 18}
            height={size === "xs" ? 14 : size === "sm" ? 16 : 18}
          />
        </ActionIcon>
      )}
      {!isControlled && variant === "button" && (
        <Button
          variant="light"
          size={size}
          leftSection={<IconEdit width={16} height={16} />}
          onClick={handleOpen}>
          {nickname ? "Edit Nickname" : "Set Nickname"}
        </Button>
      )}

      <Modal
        opened={opened}
        onClose={close}
        title="Set Contact Nickname"
        centered
        size="sm"
        className={classes.modal}
        styles={{
          content: {
            background: "linear-gradient(180deg, #1a252f 0%, #17212b 100%)",
            border: "1px solid rgba(10, 255, 241, 0.2)",
            borderRadius: "16px",
            boxShadow:
              "0 20px 40px rgba(0, 0, 0, 0.4), 0 0 20px rgba(10, 255, 241, 0.1)",
          },
          header: {
            background: "transparent",
            borderBottom: "1px solid rgba(10, 255, 241, 0.1)",
            padding: "16px 20px",
          },
          title: {
            color: "#ffffff",
            fontWeight: 600,
            fontSize: "18px",
          },
          close: {
            color: "rgba(255, 255, 255, 0.6)",
          },
          body: {
            padding: "20px",
          },
        }}>
        <Stack gap="md">
          <Text size="sm" c="dimmed">
            Set a custom name for this contact. This helps you recognize them
            easily.
          </Text>

          <Stack gap="xs">
            <Text size="xs" c="dimmed">
              Address
            </Text>
            <Text
              size="sm"
              ff="monospace"
              className={classes.addressText}
              style={{
                background: "rgba(0, 0, 0, 0.3)",
                padding: "8px 12px",
                borderRadius: "6px",
                border: "1px solid rgba(255, 255, 255, 0.1)",
              }}>
              {truncatedAddress}
            </Text>
          </Stack>

          {displayName && displayName !== truncatedAddress && (
            <Stack gap="xs">
              <Text size="xs" c="dimmed">
                ENS/Basename
              </Text>
              <Text size="sm">{displayName}</Text>
            </Stack>
          )}

          <TextInput
            label="Nickname"
            placeholder="Enter a nickname..."
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSave();
              }
            }}
            autoFocus
            styles={{
              input: {
                background: "rgba(0, 0, 0, 0.3)",
                border: "1px solid rgba(10, 255, 241, 0.2)",
                color: "#ffffff",
                borderRadius: "8px",
              },
              label: {
                color: "rgba(255, 255, 255, 0.7)",
                fontWeight: 500,
                marginBottom: "6px",
              },
            }}
          />

          <Group justify="space-between" mt="md">
            {nickname ? (
              <Button
                variant="subtle"
                color="red"
                onClick={handleRemove}
                styles={{
                  root: {
                    color: "#ef4444",
                    "&:hover": {
                      background: "rgba(239, 68, 68, 0.1)",
                    },
                  },
                }}>
                Remove
              </Button>
            ) : (
              <div />
            )}
            <Group gap="sm">
              <Button
                variant="default"
                onClick={close}
                styles={{
                  root: {
                    background: "rgba(255, 255, 255, 0.1)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    color: "#ffffff",
                    "&:hover": {
                      background: "rgba(255, 255, 255, 0.15)",
                    },
                  },
                }}>
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                styles={{
                  root: {
                    background:
                      "linear-gradient(135deg, #10b981 0%, #0d9488 100%)",
                    border: "none",
                    "&:hover": {
                      background:
                        "linear-gradient(135deg, #059669 0%, #0f766e 100%)",
                    },
                  },
                }}>
                Save
              </Button>
            </Group>
          </Group>
        </Stack>
      </Modal>
    </>
  );
};
