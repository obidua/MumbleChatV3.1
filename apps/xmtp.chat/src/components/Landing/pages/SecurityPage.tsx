import { type FC } from "react";
import { Link } from "react-router";
import { AnimatedSection } from "../components/AnimatedSection";
import classes from "../LandingPages.module.css";

const securityFeatures = [
  {
    icon: "🔐",
    title: "End-to-End Encryption",
    description: "Military-grade encryption using Signal Protocol",
    details: [
      "Messages are encrypted on your device before sending",
      "Only the recipient can decrypt—not even MumbleChat or XMTP can read",
      "Unique encryption keys per conversation",
      "Forward secrecy: past messages stay secure even if keys are compromised",
    ],
  },
  {
    icon: "🔑",
    title: "Device-Based Key Management",
    description: "Your private keys never leave your device",
    details: [
      "Keys generated and stored locally on each device",
      "No central key server or cloud backup",
      "Each Installation ID has separate key material",
      "Keys automatically rotate for enhanced security",
    ],
  },
  {
    icon: "⏰",
    title: "Automatic Device Expiry",
    description: "90-day expiration prevents unauthorized access",
    details: [
      "Lost or stolen devices automatically lose access after 90 days",
      "Easy re-authentication with wallet signature",
      "All message history preserved after renewal",
      "Manual revocation available anytime",
    ],
  },
  {
    icon: "🛡️",
    title: "Wallet-Based Authentication",
    description: "Your wallet signature is your only password",
    details: [
      "No passwords to forget or leak",
      "Cryptographic proof of identity",
      "Works with hardware wallets for maximum security",
      "Phishing-resistant: only you can sign",
    ],
  },
];

const deviceManagementFeatures = [
  {
    title: "View Connected Devices",
    description:
      "See all devices that have access to your inbox with their Installation IDs and connection dates.",
  },
  {
    title: "Revoke Access Anytime",
    description:
      "Instantly remove any device's access to your messages. Lost your phone? Revoke it in seconds.",
  },
  {
    title: "Automatic 10-Device Limit",
    description:
      "XMTP allows 10 installations per inbox. We auto-revoke the oldest when you connect new devices.",
  },
  {
    title: "Installation Age Tracking",
    description:
      "Monitor how long each device has been connected and when it will expire.",
  },
];

const complianceItems = [
  {
    icon: "🌐",
    title: "Decentralized Architecture",
    description:
      "No single point of failure or control. Your data isn't stored on our servers because we don't have servers storing your messages.",
  },
  {
    icon: "📜",
    title: "Open Source",
    description:
      "All code is open source and auditable. Verify the security yourself or have experts review it.",
  },
  {
    icon: "🔒",
    title: "Zero-Knowledge Design",
    description:
      "We can't read your messages, see your contacts, or access your data. It's mathematically impossible.",
  },
  {
    icon: "✅",
    title: "Industry Standards",
    description:
      "Built on proven cryptographic protocols used by Signal, WhatsApp, and major secure messaging apps.",
  },
];

export const SecurityPage: FC = () => {
  return (
    <div className={classes.pageContent}>
      <section className={classes.pageHero}>
        <AnimatedSection animation="fade-up">
          <span className={classes.pageEyebrow}>
            <span className={classes.eyebrowIcon}>🛡️</span>
            Security
          </span>
          <h1 className={classes.pageTitle}>
            Enterprise-Grade{" "}
            <span className={classes.gradientText}>Security</span>
          </h1>
          <p className={classes.pageSubtitle}>
            Your messages are protected by military-grade encryption. Not even
            we can read them.
          </p>
        </AnimatedSection>
      </section>

      {/* Security Shield Visual */}
      <AnimatedSection animation="scale-up">
        <section className={classes.securityVisual}>
          <div className={classes.securityShield}>
            <div className={classes.shieldOuter} />
            <div className={classes.shieldMiddle} />
            <div className={classes.shieldInner}>
              <span className={classes.shieldIcon}>🔐</span>
            </div>
            <div className={classes.shieldPulse} />
          </div>
          <div className={classes.securityStats}>
            <div className={classes.securityStat}>
              <span className={classes.statValue}>256-bit</span>
              <span className={classes.statLabel}>AES Encryption</span>
            </div>
            <div className={classes.securityStat}>
              <span className={classes.statValue}>E2E</span>
              <span className={classes.statLabel}>Signal Protocol</span>
            </div>
            <div className={classes.securityStat}>
              <span className={classes.statValue}>0</span>
              <span className={classes.statLabel}>Data We Can Access</span>
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* Security Features */}
      <section className={classes.securitySection}>
        <AnimatedSection animation="fade-up">
          <h2 className={classes.sectionTitle}>
            How We Protect{" "}
            <span className={classes.gradientText}>Your Messages</span>
          </h2>
        </AnimatedSection>

        <div className={classes.securityGrid}>
          {securityFeatures.map((feature, index) => (
            <AnimatedSection
              key={feature.title}
              animation="fade-up"
              delay={index * 0.1}>
              <article className={classes.securityCard}>
                <div className={classes.securityCardIcon}>{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p className={classes.securityCardDesc}>
                  {feature.description}
                </p>
                <ul className={classes.securityDetails}>
                  {feature.details.map((detail) => (
                    <li key={detail}>
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      </svg>
                      {detail}
                    </li>
                  ))}
                </ul>
                <div className={classes.securityCardGlow} />
              </article>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* Device Management */}
      <section className={classes.deviceSection}>
        <AnimatedSection animation="fade-up">
          <h2 className={classes.sectionTitle}>
            Device <span className={classes.gradientText}>Management</span>
          </h2>
          <p className={classes.sectionSubtitle}>
            Full control over which devices can access your inbox.
          </p>
        </AnimatedSection>

        <div className={classes.deviceGrid}>
          {deviceManagementFeatures.map((feature, index) => (
            <AnimatedSection
              key={feature.title}
              animation="slide-right"
              delay={index * 0.1}>
              <article className={classes.deviceCard}>
                <div className={classes.deviceNumber}>{index + 1}</div>
                <div className={classes.deviceContent}>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </div>
              </article>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection animation="fade-up" delay={0.4}>
          <div className={classes.deviceCta}>
            <Link to="/inbox-tools" className={classes.outlineButton}>
              Manage Your Devices
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </AnimatedSection>
      </section>

      {/* Compliance & Trust */}
      <section className={classes.complianceSection}>
        <AnimatedSection animation="fade-up">
          <h2 className={classes.sectionTitle}>
            Trust & <span className={classes.gradientText}>Transparency</span>
          </h2>
        </AnimatedSection>

        <div className={classes.complianceGrid}>
          {complianceItems.map((item, index) => (
            <AnimatedSection
              key={item.title}
              animation="fade-up"
              delay={index * 0.1}>
              <article className={classes.complianceCard}>
                <div className={classes.complianceIcon}>{item.icon}</div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* CTA */}
      <AnimatedSection animation="fade-up">
        <section className={classes.pageCta}>
          <h2>Your privacy is non-negotiable</h2>
          <p>
            Start messaging with confidence—your conversations are truly
            private.
          </p>
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
            <Link className={classes.secondaryButton} to="/mobile">
              Mobile Apps
            </Link>
          </div>
        </section>
      </AnimatedSection>
    </div>
  );
};
