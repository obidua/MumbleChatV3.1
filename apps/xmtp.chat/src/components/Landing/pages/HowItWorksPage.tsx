import { type FC } from "react";
import { Link } from "react-router";
import { AnimatedSection } from "../components/AnimatedSection";
import classes from "../LandingPages.module.css";

const concepts = [
  {
    icon: "🔑",
    title: "Wallet Address as Identity",
    description:
      "Your wallet is your identity. No phone numbers, emails, or usernames required.",
    details: [
      "Your Ethereum/Ramestta wallet address (e.g., 0x1234...5678) serves as your unique identifier",
      'ENS/Basename Support: Use human-readable names like "alice.eth" or "bob.base"',
      "Cross-Chain Compatible: One address works across all supported networks",
      "Self-Sovereign: You own your identity—no platform can ban or censor you",
    ],
  },
  {
    icon: "📬",
    title: "Inbox ID",
    description:
      "Your unique inbox identifier created when you first connect to XMTP.",
    details: [
      "Permanent: Your Inbox ID never changes once created",
      "Privacy: Different from your wallet address for additional privacy",
      "Universal: Access your inbox from any XMTP client (MumbleChat, Converse, etc.)",
      "Tied to Wallet: Only you can access your Inbox ID via your wallet signature",
    ],
  },
  {
    icon: "💻",
    title: "Installation ID",
    description:
      "Each device gets a unique installation with its own cryptographic identity.",
    details: [
      "Multi-Device: Use MumbleChat on unlimited devices simultaneously",
      "Secure Keys: Each device has its own encryption keys stored locally",
      "Sync Everywhere: Messages sync across all your connected devices",
      "Device Management: View and revoke access from any connected device",
    ],
  },
  {
    icon: "⏰",
    title: "90-Day Device Expiry",
    description:
      "Security feature: each device installation expires after 3 months.",
    details: [
      "Why 90 Days? Balances convenience with security—industry standard for session tokens",
      "Easy Renewal: Simply reconnect your wallet when expired (takes 30 seconds)",
      "Auto-Revoke: Old/forgotten devices automatically lose access",
      "Data Preserved: All message history remains intact after reconnection",
    ],
  },
];

const steps = [
  {
    number: "1",
    title: "Connect Your Wallet",
    description:
      "Use MetaMask, WalletConnect, or any compatible wallet to sign in.",
    actions: [
      'Click "Connect Wallet" button',
      "Select your preferred wallet (MetaMask, Trust Wallet, Coinbase, etc.)",
      "Sign the message to create your secure XMTP identity",
      "Your inbox is ready in seconds!",
    ],
  },
  {
    number: "2",
    title: "Start a Conversation",
    description:
      'Tap the "New" button, enter a wallet address or ENS name, and start messaging.',
    actions: [
      "Direct Message: Enter any Ethereum address (0x1234...)",
      'ENS Names: Use readable names like "alice.eth"',
      "Group Chat: Add multiple members and set group name",
      "Group Permissions: Control who can add members or change settings",
    ],
  },
  {
    number: "3",
    title: "Send Messages & Media",
    description:
      "Type your message and hit send. Share attachments and react to messages.",
    actions: [
      "Text messages with full encryption",
      "File attachments (images, documents, etc.)",
      "Reactions and replies",
      "Voice notes coming soon!",
    ],
  },
  {
    number: "4",
    title: "Manage Your Devices",
    description:
      "Control which devices can access your inbox and revoke old installations.",
    actions: [
      "View all connected devices",
      "Revoke access from old devices",
      "Auto-rotate encryption keys",
      "Stay secure with device expiry",
    ],
  },
];

export const HowItWorksPage: FC = () => {
  return (
    <div className={classes.pageContent}>
      <section className={classes.pageHero}>
        <AnimatedSection animation="fade-up">
          <span className={classes.pageEyebrow}>
            <span className={classes.eyebrowIcon}>🔧</span>
            How It Works
          </span>
          <h1 className={classes.pageTitle}>
            Understanding{" "}
            <span className={classes.gradientText}>MumbleChat</span>
          </h1>
          <p className={classes.pageSubtitle}>
            MumbleChat is built on XMTP (Extensible Message Transport Protocol),
            a decentralized messaging network. Here's everything you need to
            know.
          </p>
        </AnimatedSection>
      </section>

      {/* Core Concepts */}
      <section className={classes.conceptsSection}>
        <AnimatedSection animation="fade-up">
          <h2 className={classes.sectionTitle}>
            Core <span className={classes.gradientText}>Concepts</span>
          </h2>
        </AnimatedSection>

        <div className={classes.conceptsGrid}>
          {concepts.map((concept, index) => (
            <AnimatedSection
              key={concept.title}
              animation="fade-up"
              delay={index * 0.1}>
              <article className={classes.conceptCard}>
                <div className={classes.conceptIcon}>{concept.icon}</div>
                <h3>{concept.title}</h3>
                <p className={classes.conceptDescription}>
                  {concept.description}
                </p>
                <ul className={classes.conceptDetails}>
                  {concept.details.map((detail) => (
                    <li key={detail}>
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      {detail}
                    </li>
                  ))}
                </ul>
                <div className={classes.conceptCardGlow} />
              </article>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* Step by Step Guide */}
      <section className={classes.stepsSection}>
        <AnimatedSection animation="fade-up">
          <h2 className={classes.sectionTitle}>
            Getting <span className={classes.gradientText}>Started</span>
          </h2>
          <p className={classes.sectionSubtitle}>
            Start chatting securely in minutes with this simple step-by-step
            guide.
          </p>
        </AnimatedSection>

        <div className={classes.stepsTimeline}>
          {steps.map((step, index) => (
            <AnimatedSection
              key={step.title}
              animation={index % 2 === 0 ? "slide-right" : "slide-left"}
              delay={index * 0.15}>
              <article className={classes.stepCard}>
                <div className={classes.stepNumber}>{step.number}</div>
                <div className={classes.stepContent}>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                  <ul className={classes.stepActions}>
                    {step.actions.map((action) => (
                      <li key={action}>{action}</li>
                    ))}
                  </ul>
                </div>
                <div className={classes.stepConnector} />
              </article>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* Architecture Diagram */}
      <AnimatedSection animation="scale-up">
        <section className={classes.architectureSection}>
          <h2 className={classes.sectionTitle}>
            How Messages <span className={classes.gradientText}>Flow</span>
          </h2>
          <div className={classes.architectureDiagram}>
            <div className={classes.archNode}>
              <div className={classes.archIcon}>👤</div>
              <span>Your Wallet</span>
            </div>
            <div className={classes.archArrow}>
              <svg width="40" height="20" viewBox="0 0 40 20">
                <path
                  d="M0 10h32M28 4l8 6-8 6"
                  stroke="currentColor"
                  fill="none"
                  strokeWidth="2"
                />
              </svg>
              <span>Signs</span>
            </div>
            <div className={classes.archNode}>
              <div className={classes.archIcon}>📬</div>
              <span>XMTP Inbox</span>
            </div>
            <div className={classes.archArrow}>
              <svg width="40" height="20" viewBox="0 0 40 20">
                <path
                  d="M0 10h32M28 4l8 6-8 6"
                  stroke="currentColor"
                  fill="none"
                  strokeWidth="2"
                />
              </svg>
              <span>Encrypts</span>
            </div>
            <div className={classes.archNode}>
              <div className={classes.archIcon}>🌐</div>
              <span>XMTP Network</span>
            </div>
            <div className={classes.archArrow}>
              <svg width="40" height="20" viewBox="0 0 40 20">
                <path
                  d="M0 10h32M28 4l8 6-8 6"
                  stroke="currentColor"
                  fill="none"
                  strokeWidth="2"
                />
              </svg>
              <span>Delivers</span>
            </div>
            <div className={classes.archNode}>
              <div className={classes.archIcon}>👤</div>
              <span>Recipient</span>
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* CTA */}
      <AnimatedSection animation="fade-up">
        <section className={classes.pageCta}>
          <h2>Ready to get started?</h2>
          <p>Connect your wallet and start messaging in seconds.</p>
          <div className={classes.ctaButtons}>
            <a className={classes.primaryButton} href="/welcome">
              <span className={classes.buttonText}>Launch App</span>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
            <Link className={classes.secondaryButton} to="/security">
              Learn About Security
            </Link>
          </div>
        </section>
      </AnimatedSection>
    </div>
  );
};
