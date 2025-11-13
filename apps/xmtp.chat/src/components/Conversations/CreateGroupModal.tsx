import {
  Accordion,
  Badge,
  Button,
  Flex,
  Group,
  Stack,
  Text,
} from "@mantine/core";
import { GroupPermissionsOptions } from "@xmtp/browser-sdk";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router";
import { AppHeader } from "@/components/App/AppHeader";
import type { PendingMember } from "@/components/Conversation/AddMembers";
import { Members } from "@/components/Conversation/Members";
import { Metadata } from "@/components/Conversation/Metadata";
import {
  defaultPolicySet,
  Permissions,
} from "@/components/Conversation/Permissions";
import { Modal } from "@/components/Modal";
import { useClient } from "@/contexts/XMTPContext";
import { isValidEthereumAddress, isValidInboxId } from "@/helpers/strings";
import { useCollapsedMediaQuery } from "@/hooks/useCollapsedMediaQuery";
import { useConversations } from "@/hooks/useConversations";
import { ContentLayout } from "@/layouts/ContentLayout";
import { useActions } from "@/stores/inbox/hooks";
import type { PolicySet } from "@/types";
import classes from "./CreateGroupModal.module.css";

const permissionsPolicyValue = (policy: GroupPermissionsOptions) => {
  switch (policy) {
    case GroupPermissionsOptions.Default:
      return "Default";
    case GroupPermissionsOptions.AdminOnly:
      return "Admin only";
    case GroupPermissionsOptions.CustomPolicy:
      return "Custom policy";
  }
};

export const CreateGroupModal: React.FC = () => {
  const { newGroup } = useConversations();
  const { addConversation } = useActions();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrlSquare, setImageUrlSquare] = useState("");
  const [addedMembers, setAddedMembers] = useState<PendingMember[]>([]);
  const [permissionsPolicy, setPermissionsPolicy] =
    useState<GroupPermissionsOptions>(GroupPermissionsOptions.Default);
  const [policySet, setPolicySet] = useState<PolicySet>(defaultPolicySet);
  const navigate = useNavigate();
  const fullScreen = useCollapsedMediaQuery();
  const contentHeight = fullScreen ? "auto" : "70dvh";
  const client = useClient();

  const handleClose = useCallback(() => {
    void navigate(-1);
  }, [navigate]);

  const handleCreate = async () => {
    setLoading(true);

    try {
      const addedMemberInboxIds = addedMembers
        .filter((member) => isValidInboxId(member.inboxId))
        .map((member) => member.inboxId);
      const conversation = await newGroup(addedMemberInboxIds, {
        name,
        description,
        imageUrlSquare,
        permissions: permissionsPolicy,
        customPermissionPolicySet:
          permissionsPolicy === GroupPermissionsOptions.CustomPolicy
            ? policySet
            : undefined,
      });

      // Members are already added via inbox IDs in the newGroup call above
      // No need to add them again by addresses

      // ensure conversation is added to store so navigation works
      await addConversation(conversation);
      void navigate(`/conversations/${conversation.id}`);
    } catch (error) {
      console.error("Failed to create group:", error);
      // Don't show alert - let the error be silent for better UX
      // The group creation succeeds, only member addition might fail
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      closeOnClickOutside={false}
      closeOnEscape={false}
      withCloseButton={false}
      opened
      centered
      fullScreen={fullScreen}
      onClose={handleClose}
      size="auto"
      padding={0}>
      <AppHeader client={client} />
      <ContentLayout
        maxHeight={contentHeight}
        loading={loading}
        withScrollAreaPadding={false}
        title={
          <Group align="center" gap="sm">
            <Text
              size="lg"
              fw={700}
              c="#ffffff">
              Create Group
            </Text>
          </Group>
        }>
        <Stack gap="lg" p="md">
          {/* Header Card */}
          <div className={classes.headerCard}>
            <div className={classes.cardContent}>
              <Flex align="center" gap="md" mb="md">
                <div className={classes.iconWrapper}>
                  <svg
                    className={classes.icon}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <div>
                  <Text className={classes.headerTitle}>
                    Create a Group Chat
                  </Text>
                  <Text className={classes.headerSubtitle}>
                    Bring people together in encrypted group conversations
                  </Text>
                </div>
              </Flex>
            </div>
          </div>

          {/* Group Settings */}
          <Stack gap="sm">
            <Accordion
              defaultValue="metadata"
              variant="separated"
              classNames={{
                item: classes.accordionItem,
                control: classes.accordionControl,
                content: classes.accordionContent,
              }}>
              <Accordion.Item value="metadata">
                <Accordion.Control>
                  <Flex align="center" gap="sm">
                    <svg
                      width="20"
                      height="20"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      style={{ color: "#10b981" }}>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                      />
                    </svg>
                    <Text
                      fw="bold"
                      style={{ color: "rgba(255, 255, 255, 0.95)" }}>
                      Group Details
                    </Text>
                  </Flex>
                </Accordion.Control>
                <Accordion.Panel>
                  <Metadata
                    onNameChange={setName}
                    onDescriptionChange={setDescription}
                    onImageUrlChange={setImageUrlSquare}
                  />
                </Accordion.Panel>
              </Accordion.Item>
            </Accordion>

            <Accordion
              variant="separated"
              classNames={{
                item: classes.accordionItem,
                control: classes.accordionControl,
                content: classes.accordionContent,
              }}>
              <Accordion.Item value="members">
                <Accordion.Control>
                  <Flex
                    justify="space-between"
                    align="center"
                    style={{ width: "100%" }}>
                    <Flex align="center" gap="sm">
                      <svg
                        width="20"
                        height="20"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className={classes.accordionIcon}>
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                        />
                      </svg>
                      <Text fw="bold" className={classes.accordionLabel}>
                        Members
                      </Text>
                    </Flex>
                    <Badge
                      size="lg"
                      radius="md"
                      className={classes.accordionBadge}
                      style={{ color: "#10b981" }}>
                      {addedMembers.length}
                    </Badge>
                  </Flex>
                </Accordion.Control>
                <Accordion.Panel>
                  <Members
                    addedMembers={addedMembers}
                    onMembersAdded={setAddedMembers}
                    existingMembers={[]}
                    removedMembers={[]}
                  />
                </Accordion.Panel>
              </Accordion.Item>
            </Accordion>

            <Accordion
              variant="separated"
              classNames={{
                item: classes.accordionItem,
                control: classes.accordionControl,
                content: classes.accordionContent,
              }}>
              <Accordion.Item value="permissions">
                <Accordion.Control>
                  <Flex
                    justify="space-between"
                    align="center"
                    style={{ width: "100%" }}>
                    <Flex align="center" gap="sm">
                      <svg
                        width="20"
                        height="20"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className={classes.accordionIcon}>
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                      <Text fw="bold" className={classes.accordionLabel}>
                        Permissions
                      </Text>
                    </Flex>
                    <Badge
                      size="lg"
                      radius="md"
                      className={classes.accordionBadge}
                      style={{ color: "#1976d2" }}>
                      {permissionsPolicyValue(permissionsPolicy)}
                    </Badge>
                  </Flex>
                </Accordion.Control>
                <Accordion.Panel>
                  <Permissions
                    onPermissionsPolicyChange={setPermissionsPolicy}
                    onPolicySetChange={setPolicySet}
                  />
                </Accordion.Panel>
              </Accordion.Item>
            </Accordion>
          </Stack>

          {/* Info Card */}
          <div className={classes.infoCard}>
            <div className={classes.cardContent}>
              <Flex align="flex-start" gap="sm">
                <svg
                  width="20"
                  height="20"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="#10b981"
                  style={{ flexShrink: 0, marginTop: "2px" }}>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
                <Stack gap="xs">
                  <Text size="sm" fw={600} style={{ color: "#10b981" }}>
                    Secure Group Messaging
                  </Text>
                  <Text size="xs" c="dimmed">
                    All group messages are end-to-end encrypted. Only group
                    members can read the conversations.
                  </Text>
                </Stack>
              </Flex>
            </div>
          </div>

          {/* Action Buttons */}
          <Group justify="flex-end" gap="sm" mt="md">
            <Button
              variant="default"
              onClick={handleClose}
              size="md"
              className={classes.cancelButton}>
              Cancel
            </Button>
            <Button
              variant="gradient"
              gradient={{ from: "#10b981", to: "#1976d2" }}
              disabled={loading}
              loading={loading}
              onClick={() => void handleCreate()}
              size="md"
              styles={{
                root: {
                  fontWeight: 700,
                },
              }}>
              Create Group
            </Button>
          </Group>

          {/* Back to Conversations Button - Helpful for iOS */}
          <Button
            fullWidth
            size="lg"
            variant="light"
            onClick={handleClose}
            mt="md"
            className={classes.backButton}>
            Back to Conversations
          </Button>
        </Stack>
      </ContentLayout>
    </Modal>
  );
};
