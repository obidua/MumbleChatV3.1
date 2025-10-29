import { ActionIcon, Menu } from "@mantine/core";
import { IconDots } from "@/icons/IconDots";

export type ConversationsMenuProps = {
  onSync: () => void;
  onSyncAll: () => void;
  disabled?: boolean;
  loading?: boolean;
};

export const ConversationsMenu: React.FC<ConversationsMenuProps> = ({
  onSync,
  onSyncAll,
  disabled,
  loading,
}) => {
  return (
    <Menu shadow="md" disabled={disabled} position="bottom-end">
      <Menu.Target>
        <ActionIcon
          variant="light"
          loading={loading}
          radius="xl"
          size="lg"
          style={{
            background:
              "linear-gradient(130deg, rgba(10, 255, 241, 0.16), rgba(151, 114, 251, 0.24))",
            border: "1px solid rgba(10, 255, 241, 0.25)",
            color: "var(--mantine-color-gray-0)",
            boxShadow: "0 14px 26px rgba(10, 255, 241, 0.18)",
          }}>
          <IconDots />
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown miw={200}>
        <Menu.Label>Actions</Menu.Label>
        <Menu.Item onClick={onSync}>Sync</Menu.Item>
        <Menu.Item onClick={onSyncAll}>Sync All</Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};
