import { ActionIcon, Menu, Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import { useMemo } from "react";
import { useNavigate } from "react-router";
import { useClientPermissions } from "@/hooks/useClientPermissions";
import { IconDots } from "@/icons/IconDots";
import { useActions } from "@/stores/inbox/hooks";

export type ConversationMenuProps = {
  conversationId: string;
  type: "group" | "dm";
  onSync: () => void;
  disabled?: boolean;
};

export const ConversationMenu: React.FC<ConversationMenuProps> = ({
  conversationId,
  type,
  onSync,
  disabled,
}) => {
  const navigate = useNavigate();
  const { removeConversation } = useActions();
  const clientPermissions = useClientPermissions(conversationId);
  const canManageMembers = useMemo(() => {
    return (
      clientPermissions.canAddMembers || clientPermissions.canRemoveMembers
    );
  }, [clientPermissions]);
  const canManageMetadata = useMemo(() => {
    return (
      clientPermissions.canChangeGroupName ||
      clientPermissions.canChangeGroupDescription ||
      clientPermissions.canChangeGroupImage
    );
  }, [clientPermissions]);

  const handleDeleteConversation = () => {
    modals.openConfirmModal({
      title: "Delete Conversation",
      centered: true,
      children: (
        <Text size="sm">
          Are you sure you want to delete this conversation? This will only
          remove it from your device. You can sync again to restore it.
        </Text>
      ),
      labels: { confirm: "Delete", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onConfirm: () => {
        removeConversation(conversationId);
        void navigate("/conversations");
      },
    });
  };

  return (
    <Menu shadow="md" disabled={disabled} position="bottom-end">
      <Menu.Target>
        <ActionIcon variant="default">
          <IconDots />
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown miw={200}>
        <Menu.Label>Manage</Menu.Label>
        <Menu.Item onClick={() => void navigate("manage/consent")}>
          Consent
        </Menu.Item>
        {type === "group" &&
          (canManageMembers ||
            canManageMetadata ||
            clientPermissions.canChangePermissionsPolicy) && (
            <>
              {canManageMembers && (
                <Menu.Item onClick={() => void navigate("manage/members")}>
                  Members
                </Menu.Item>
              )}
              {canManageMetadata && (
                <Menu.Item onClick={() => void navigate("manage/metadata")}>
                  Metadata
                </Menu.Item>
              )}
              {clientPermissions.canChangePermissionsPolicy && (
                <Menu.Item onClick={() => void navigate("manage/permissions")}>
                  Permissions
                </Menu.Item>
              )}
            </>
          )}
        <Menu.Label>Actions</Menu.Label>
        <Menu.Item onClick={onSync}>Sync</Menu.Item>
        <Menu.Divider />
        <Menu.Item color="red" onClick={handleDeleteConversation}>
          Delete Conversation
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};
