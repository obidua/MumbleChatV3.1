import { Accordion, CloseButton, Group, Stack, Text } from "@mantine/core";
import { useCallback } from "react";
import { useNavigate } from "react-router";
import { Modal } from "@/components/Modal";
import { useCollapsedMediaQuery } from "@/hooks/useCollapsedMediaQuery";
import { ContentLayout } from "@/layouts/ContentLayout";
import classes from "./HelpModal.module.css";

export const HelpModal: React.FC = () => {
  const navigate = useNavigate();
  const fullScreen = useCollapsedMediaQuery();
  const contentHeight = fullScreen ? "auto" : "75dvh";

  const handleClose = useCallback(() => {
    void navigate(-1);
  }, [navigate]);

  return (
    <Modal
      opened
      centered
      withCloseButton={false}
      fullScreen={fullScreen}
      onClose={handleClose}
      size="lg"
      padding={0}>
      <ContentLayout
        maxHeight={contentHeight}
        withScrollAreaPadding={true}
        title={
          <Group justify="space-between" align="center" flex={1}>
            <Text
              size="lg"
              fw={700}
              style={{
                background: "linear-gradient(135deg, #0afff1, #9772fb)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>
              About MumbleChat
            </Text>
            <CloseButton size="md" onClick={handleClose} />
          </Group>
        }>
        <Stack gap="lg" p="md">
          {/* Introduction Card */}
          <div className={classes.infoCard}>
            <div className={classes.cardHeader}>
              <svg
                className={classes.icon}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              <Text className={classes.cardTitle}>What is MumbleChat?</Text>
            </div>
            <div className={classes.cardBody}>
              <Text className={classes.description}>
                MumbleChat is a decentralized, secure messaging application
                built on the XMTP (Extensible Message Transport Protocol)
                network. It allows you to chat privately and securely using your
                blockchain wallet address, without relying on centralized
                servers.
              </Text>
              <div className={classes.featureList}>
                <div className={classes.featureItem}>
                  <span className={classes.featureDot}>•</span>
                  <Text className={classes.featureText}>
                    End-to-end encrypted messaging
                  </Text>
                </div>
                <div className={classes.featureItem}>
                  <span className={classes.featureDot}>•</span>
                  <Text className={classes.featureText}>
                    Decentralized architecture
                  </Text>
                </div>
                <div className={classes.featureItem}>
                  <span className={classes.featureDot}>•</span>
                  <Text className={classes.featureText}>
                    Multi-device support
                  </Text>
                </div>
                <div className={classes.featureItem}>
                  <span className={classes.featureDot}>•</span>
                  <Text className={classes.featureText}>
                    Group conversations
                  </Text>
                </div>
              </div>
            </div>
          </div>

          {/* Key Concepts Accordion */}
          <div className={classes.infoCard}>
            <div className={classes.cardHeader}>
              <svg
                className={classes.icon}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
              <Text className={classes.cardTitle}>Key Concepts</Text>
            </div>
            <div className={classes.cardBody}>
              <Accordion
                variant="separated"
                classNames={{
                  root: classes.accordion,
                  item: classes.accordionItem,
                  control: classes.accordionControl,
                  label: classes.accordionLabel,
                  content: classes.accordionContent,
                  panel: classes.accordionPanel,
                }}>
                <Accordion.Item value="address">
                  <Accordion.Control>
                    <div className={classes.accordionTitle}>
                      <span className={classes.accordionIcon}>🔑</span>
                      <Text fw={600}>Wallet Address</Text>
                    </div>
                  </Accordion.Control>
                  <Accordion.Panel>
                    <Text className={classes.accordionText}>
                      Your wallet address (e.g., 0x874...4543) is your unique
                      identifier on the blockchain. It's like your username in
                      traditional messaging apps, but it's derived from your
                      cryptocurrency wallet. This address is public and can be
                      shared with others so they can message you.
                    </Text>
                  </Accordion.Panel>
                </Accordion.Item>

                <Accordion.Item value="inbox">
                  <Accordion.Control>
                    <div className={classes.accordionTitle}>
                      <span className={classes.accordionIcon}>📥</span>
                      <Text fw={600}>Inbox ID</Text>
                    </div>
                  </Accordion.Control>
                  <Accordion.Panel>
                    <Text className={classes.accordionText}>
                      Your Inbox ID is a unique identifier generated by XMTP
                      that represents your messaging inbox. It's different from
                      your wallet address and is used internally by the protocol
                      to route messages to you across all your devices. Multiple
                      wallet addresses can be associated with the same Inbox ID.
                    </Text>
                  </Accordion.Panel>
                </Accordion.Item>

                <Accordion.Item value="installation">
                  <Accordion.Control>
                    <div className={classes.accordionTitle}>
                      <span className={classes.accordionIcon}>📱</span>
                      <Text fw={600}>Installation ID</Text>
                    </div>
                  </Accordion.Control>
                  <Accordion.Panel>
                    <Text className={classes.accordionText}>
                      An Installation ID represents a unique device or browser
                      where you've logged into MumbleChat. Each device (phone,
                      computer, tablet) gets its own Installation ID. This
                      allows you to use MumbleChat on multiple devices while
                      keeping your messages synchronized.
                    </Text>
                  </Accordion.Panel>
                </Accordion.Item>

                <Accordion.Item value="installations-list">
                  <Accordion.Control>
                    <div className={classes.accordionTitle}>
                      <span className={classes.accordionIcon}>🔧</span>
                      <Text fw={600}>Installations Management</Text>
                    </div>
                  </Accordion.Control>
                  <Accordion.Panel>
                    <Text className={classes.accordionText} mb="sm">
                      The Installations section shows all devices connected to
                      your account:
                    </Text>
                    <div className={classes.featureList}>
                      <div className={classes.featureItem}>
                        <span className={classes.featureDot}>•</span>
                        <Text className={classes.featureText}>
                          <strong>Created:</strong> When the device was first
                          connected
                        </Text>
                      </div>
                      <div className={classes.featureItem}>
                        <span className={classes.featureDot}>•</span>
                        <Text className={classes.featureText}>
                          <strong>Expires:</strong> Each installation has a
                          3-month validity period for security
                        </Text>
                      </div>
                      <div className={classes.featureItem}>
                        <span className={classes.featureDot}>•</span>
                        <Text className={classes.featureText}>
                          <strong>Status:</strong> Shows if the device is active
                          or expired
                        </Text>
                      </div>
                      <div className={classes.featureItem}>
                        <span className={classes.featureDot}>•</span>
                        <Text className={classes.featureText}>
                          <strong>Current:</strong> Indicates the device you're
                          currently using
                        </Text>
                      </div>
                      <div className={classes.featureItem}>
                        <span className={classes.featureDot}>•</span>
                        <Text className={classes.featureText}>
                          <strong>Revoke:</strong> Remove access from devices
                          you no longer use
                        </Text>
                      </div>
                    </div>
                  </Accordion.Panel>
                </Accordion.Item>
              </Accordion>
            </div>
          </div>

          {/* How to Use Section */}
          <div className={classes.infoCard}>
            <div className={classes.cardHeader}>
              <svg
                className={classes.icon}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
              <Text className={classes.cardTitle}>How to Use MumbleChat</Text>
            </div>
            <div className={classes.cardBody}>
              <div className={classes.stepsList}>
                <div className={classes.step}>
                  <div className={classes.stepNumber}>1</div>
                  <div className={classes.stepContent}>
                    <Text className={classes.stepTitle}>
                      Connect Your Wallet
                    </Text>
                    <Text className={classes.stepDescription}>
                      Use MetaMask, WalletConnect, or any compatible wallet to
                      sign in. Your wallet address becomes your identity.
                    </Text>
                  </div>
                </div>

                <div className={classes.step}>
                  <div className={classes.stepNumber}>2</div>
                  <div className={classes.stepContent}>
                    <Text className={classes.stepTitle}>
                      Start a Conversation
                    </Text>
                    <Text className={classes.stepDescription}>
                      Tap the "New" button, enter a wallet address, and start
                      messaging. You can also create group chats with multiple
                      people.
                    </Text>
                  </div>
                </div>

                <div className={classes.step}>
                  <div className={classes.stepNumber}>3</div>
                  <div className={classes.stepContent}>
                    <Text className={classes.stepTitle}>
                      Send Messages & Media
                    </Text>
                    <Text className={classes.stepDescription}>
                      Type your message and hit send. You can also share
                      attachments, react to messages, and reply to specific
                      messages.
                    </Text>
                  </div>
                </div>

                <div className={classes.step}>
                  <div className={classes.stepNumber}>4</div>
                  <div className={classes.stepContent}>
                    <Text className={classes.stepTitle}>
                      Manage Your Devices
                    </Text>
                    <Text className={classes.stepDescription}>
                      Visit the Profile tab to see all connected devices and
                      revoke access from devices you no longer use.
                    </Text>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className={classes.infoCard}>
            <div className={classes.cardHeader}>
              <svg
                className={classes.icon}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                />
              </svg>
              <Text className={classes.cardTitle}>Features</Text>
            </div>
            <div className={classes.cardBody}>
              <div className={classes.featuresGrid}>
                <div className={classes.featureCard}>
                  <div className={classes.featureIcon}>💬</div>
                  <Text className={classes.featureCardTitle}>
                    Direct Messages
                  </Text>
                  <Text className={classes.featureCardText}>
                    Private 1-on-1 conversations with end-to-end encryption
                  </Text>
                </div>

                <div className={classes.featureCard}>
                  <div className={classes.featureIcon}>👥</div>
                  <Text className={classes.featureCardTitle}>Group Chats</Text>
                  <Text className={classes.featureCardText}>
                    Create groups, manage members, and chat with multiple people
                  </Text>
                </div>

                <div className={classes.featureCard}>
                  <div className={classes.featureIcon}>📎</div>
                  <Text className={classes.featureCardTitle}>File Sharing</Text>
                  <Text className={classes.featureCardText}>
                    Share images, documents, and other files securely
                  </Text>
                </div>

                <div className={classes.featureCard}>
                  <div className={classes.featureIcon}>🔄</div>
                  <Text className={classes.featureCardTitle}>
                    Multi-Device Sync
                  </Text>
                  <Text className={classes.featureCardText}>
                    Access your messages from any device seamlessly
                  </Text>
                </div>

                <div className={classes.featureCard}>
                  <div className={classes.featureIcon}>❤️</div>
                  <Text className={classes.featureCardTitle}>Reactions</Text>
                  <Text className={classes.featureCardText}>
                    React to messages with emojis for quick responses
                  </Text>
                </div>

                <div className={classes.featureCard}>
                  <div className={classes.featureIcon}>↩️</div>
                  <Text className={classes.featureCardTitle}>Replies</Text>
                  <Text className={classes.featureCardText}>
                    Reply to specific messages to keep conversations organized
                  </Text>
                </div>
              </div>
            </div>
          </div>

          {/* Security & Privacy */}
          <div className={classes.infoCard}>
            <div className={classes.cardHeader}>
              <svg
                className={classes.icon}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              <Text className={classes.cardTitle}>Security & Privacy</Text>
            </div>
            <div className={classes.cardBody}>
              <Text className={classes.description} mb="md">
                MumbleChat prioritizes your security and privacy:
              </Text>
              <div className={classes.featureList}>
                <div className={classes.featureItem}>
                  <span className={classes.featureDot}>🔒</span>
                  <Text className={classes.featureText}>
                    All messages are end-to-end encrypted
                  </Text>
                </div>
                <div className={classes.featureItem}>
                  <span className={classes.featureDot}>🔐</span>
                  <Text className={classes.featureText}>
                    No central server stores your messages
                  </Text>
                </div>
                <div className={classes.featureItem}>
                  <span className={classes.featureDot}>🚫</span>
                  <Text className={classes.featureText}>
                    No email or phone number required
                  </Text>
                </div>
                <div className={classes.featureItem}>
                  <span className={classes.featureDot}>✅</span>
                  <Text className={classes.featureText}>
                    You control your data and devices
                  </Text>
                </div>
                <div className={classes.featureItem}>
                  <span className={classes.featureDot}>⏰</span>
                  <Text className={classes.featureText}>
                    Device access expires after 3 months for security
                  </Text>
                </div>
              </div>
            </div>
          </div>
        </Stack>
      </ContentLayout>
    </Modal>
  );
};
