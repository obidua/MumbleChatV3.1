import { ActionIcon, Menu } from "@mantine/core";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { EditNickname } from "@/components/Contacts/EditNickname";
import { useClientPermissions } from "@/hooks/useClientPermissions";
import { IconDots } from "@/icons/IconDots";

export type ConversationMenuProps = {
  conversationId: string;
  type: "group" | "dm";
  onSync: () => void;
  disabled?: boolean;
  otherMemberAddress?: string | null;
  onMenuOpen?: () => void;
  onMenuClose?: () => void;
};

export const ConversationMenu: React.FC<ConversationMenuProps> = ({
  conversationId,
  type,
  onSync,
  disabled,
  otherMemberAddress,
  onMenuOpen,
  onMenuClose,
}) => {
  const navigate = useNavigate();
  const clientPermissions = useClientPermissions(conversationId);
  const [nicknameModalOpen, setNicknameModalOpen] = useState(false);
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

  return (
    <>
      <Menu
        shadow="md"
        disabled={disabled}
        position="bottom-end"
        onOpen={onMenuOpen}
        onClose={onMenuClose}>
        <Menu.Target>
          <ActionIcon variant="default">
            <IconDots />
          </ActionIcon>
        </Menu.Target>
        <Menu.Dropdown miw={200}>
          {type === "dm" && otherMemberAddress && (
            <>
              <Menu.Label>Contact</Menu.Label>
              <Menu.Item
                onClick={() => {
                  setNicknameModalOpen(true);
                }}>
                Set Nickname
              </Menu.Item>
            </>
          )}
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
                  <Menu.Item
                    onClick={() => void navigate("manage/permissions")}>
                    Permissions
                  </Menu.Item>
                )}
              </>
            )}
          <Menu.Label>Actions</Menu.Label>
          <Menu.Item onClick={onSync}>Sync</Menu.Item>
        </Menu.Dropdown>
      </Menu>
      {type === "dm" && otherMemberAddress && (
        <EditNickname
          address={otherMemberAddress}
          opened={nicknameModalOpen}
          onClose={() => {
            setNicknameModalOpen(false);
          }}
        />
      )}
    </>
  );
};
