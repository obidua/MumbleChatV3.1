import { ActionIcon, Menu } from "@mantine/core";
import { IconDots } from "@/icons/IconDots";
import { IconLogout } from "@/icons/IconLogout";

export type ConversationsMenuProps = {
  onSync: () => void;
  onSyncAll: () => void;
  onCreateDm?: () => void;
  onCreateGroup?: () => void;
  onShowQRCode?: () => void;
  onInboxTools?: () => void;
  onLogout?: () => void;
  disabled?: boolean;
  loading?: boolean;
};

export const ConversationsMenu: React.FC<ConversationsMenuProps> = ({
  onSync,
  onSyncAll,
  onCreateDm,
  onCreateGroup,
  onShowQRCode,
  onInboxTools,
  onLogout,
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
        <Menu.Label>Create</Menu.Label>
        {onCreateDm && (
          <Menu.Item
            onClick={onCreateDm}
            leftSection={
              <span style={{ fontSize: "16px" }}>💬</span>
            }>
            New Chat (DM)
          </Menu.Item>
        )}
        {onCreateGroup && (
          <Menu.Item
            onClick={onCreateGroup}
            leftSection={
              <span style={{ fontSize: "16px" }}>👥</span>
            }>
            New Group
          </Menu.Item>
        )}
        {onShowQRCode && (
          <Menu.Item
            onClick={onShowQRCode}
            leftSection={
              <span style={{ fontSize: "16px" }}>📱</span>
            }>
            Show QR Code
          </Menu.Item>
        )}
        {onLogout && (
          <Menu.Item
            onClick={onLogout}
            leftSection={<IconLogout size={16} />}
            color="red">
            Logout
          </Menu.Item>
        )}
        <Menu.Divider />
        <Menu.Label>Actions</Menu.Label>
        <Menu.Item onClick={onSync}>Sync</Menu.Item>
        <Menu.Item onClick={onSyncAll}>Sync All</Menu.Item>
        <Menu.Divider />
        <Menu.Label>Support</Menu.Label>
        {onInboxTools && (
          <Menu.Item
            onClick={onInboxTools}
            leftSection={
              <span style={{ fontSize: "16px" }}>🔧</span>
            }>
            Inbox Tools
          </Menu.Item>
        )}
      </Menu.Dropdown>
    </Menu>
  );
};
