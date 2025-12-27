import { type FC } from "react";
import { Link } from "react-router";
import { AnimatedSection } from "../components/AnimatedSection";
import classes from "../LandingPages.module.css";

const featureCards = [
  {
    icon: "🔐",
    title: "End-to-End Encryption",
    copy: "Messages stay encrypted from your wallet to your recipient, secured by Ramestta-native keys. Signal Protocol (same as WhatsApp) ensures military-grade security.",
    details: [
      "Signal Protocol encryption",
      "Unique keys per conversation",
      "Zero-knowledge architecture",
    ],
  },
  {
    icon: "🌐",
    title: "Decentralized Storage",
    copy: "All threads live on the Ramestta blockchain—immutable, censorship resistant, and verifiable. No central server can delete or modify your messages.",
    details: [
      "Distributed across nodes",
      "Censorship resistant",
      "Always accessible",
    ],
  },
  {
    icon: "👤",
    title: "Community Owned",
    copy: "Wallets act as identity. No phone numbers, emails, or centralized gateways required. Your identity is self-sovereign.",
    details: [
      "Wallet-based identity",
      "ENS/Basename support",
      "No personal data required",
    ],
  },
  {
    icon: "🕵️",
    title: "Privacy First",
    copy: "Metadata is minimized and routed over encrypted transports so conversations stay private. We can't read your messages—only you can.",
    details: [
      "Minimal metadata",
      "Encrypted transport",
      "No analytics on content",
    ],
  },
  {
    icon: "⚡",
    title: "Lightning Fast",
    copy: "Optimized indexing and local caching deliver near-instant message sync without sacrificing security. Sub-2 second finality on Ramestta.",
    details: ["Local caching", "Instant sync", "Offline support"],
  },
  {
    icon: "🌍",
    title: "Global Access",
    copy: "Wherever your wallet connects, your inbox follows. Access from any device, any XMTP client, anywhere in the world.",
    details: [
      "Multi-device support",
      "Cross-client compatible",
      "24/7 availability",
    ],
  },
  {
    icon: "👥",
    title: "Group Chats",
    copy: "Create group conversations with customizable permissions. Assign admins, gate membership, and manage your community.",
    details: [
      "Unlimited members",
      "Role-based permissions",
      "Moderation tools",
    ],
  },
  {
    icon: "🤖",
    title: "Bot & Automation",
    copy: "Wire up programmable bots and webhooks for DAO operations, notifications, and automated workflows.",
    details: ["Custom bots", "Webhook integration", "Smart contract triggers"],
  },
];

export const FeaturesPage: FC = () => {
  return (
    <div className={classes.pageContent}>
      <section className={classes.pageHero}>
        <AnimatedSection animation="fade-up">
          <span className={classes.pageEyebrow}>
            <span className={classes.eyebrowIcon}>🎯</span>
            Features
          </span>
          <h1 className={classes.pageTitle}>
            Everything you need to{" "}
            <span className={classes.gradientText}>own your conversations</span>
          </h1>
          <p className={classes.pageSubtitle}>
            Privacy-first tooling, resilient infrastructure, and UI built for
            communities who live onchain.
          </p>
        </AnimatedSection>
      </section>

      <section className={classes.featuresGrid}>
        {featureCards.map((feature, index) => (
          <AnimatedSection
            key={feature.title}
            animation="fade-up"
            delay={index * 0.1}>
            <article className={classes.featureCard}>
              <div className={classes.featureCardHeader}>
                <div className={classes.featureIcon}>{feature.icon}</div>
                <h3>{feature.title}</h3>
              </div>
              <p>{feature.copy}</p>
              <ul className={classes.featureDetails}>
                {feature.details.map((detail) => (
                  <li key={detail}>
                    <svg
                      width="16"
                      height="16"
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
              <div className={classes.featureCardGlow} />
            </article>
          </AnimatedSection>
        ))}
      </section>

      {/* Comparison Table */}
      <AnimatedSection animation="fade-up">
        <section className={classes.comparisonSection}>
          <h2 className={classes.sectionTitle}>
            How MumbleChat{" "}
            <span className={classes.gradientText}>Compares</span>
          </h2>
          <div className={classes.comparisonTable}>
            <div className={classes.comparisonHeader}>
              <div className={classes.comparisonFeature}>Feature</div>
              <div className={classes.comparisonApp}>MumbleChat</div>
              <div className={classes.comparisonApp}>WhatsApp</div>
              <div className={classes.comparisonApp}>Telegram</div>
              <div className={classes.comparisonApp}>Discord</div>
            </div>
            {[
              {
                feature: "End-to-End Encrypted",
                mumble: true,
                whatsapp: true,
                telegram: false,
                discord: false,
              },
              {
                feature: "Decentralized",
                mumble: true,
                whatsapp: false,
                telegram: false,
                discord: false,
              },
              {
                feature: "No Phone Required",
                mumble: true,
                whatsapp: false,
                telegram: false,
                discord: true,
              },
              {
                feature: "Wallet Identity",
                mumble: true,
                whatsapp: false,
                telegram: false,
                discord: false,
              },
              {
                feature: "Open Source",
                mumble: true,
                whatsapp: false,
                telegram: "Partial",
                discord: false,
              },
              {
                feature: "No Ads",
                mumble: true,
                whatsapp: true,
                telegram: true,
                discord: "Partial",
              },
              {
                feature: "Data Ownership",
                mumble: true,
                whatsapp: false,
                telegram: false,
                discord: false,
              },
              {
                feature: "Cross-Platform",
                mumble: true,
                whatsapp: true,
                telegram: true,
                discord: true,
              },
            ].map((row) => (
              <div key={row.feature} className={classes.comparisonRow}>
                <div className={classes.comparisonFeature}>{row.feature}</div>
                <div className={classes.comparisonCell}>
                  {row.mumble ? "✅" : !row.mumble ? "❌" : row.mumble}
                </div>
                <div className={classes.comparisonCell}>
                  {row.whatsapp ? "✅" : !row.whatsapp ? "❌" : row.whatsapp}
                </div>
                <div className={classes.comparisonCell}>
                  {row.telegram === true
                    ? "✅"
                    : row.telegram === false
                      ? "❌"
                      : row.telegram}
                </div>
                <div className={classes.comparisonCell}>
                  {row.discord === true
                    ? "✅"
                    : row.discord === false
                      ? "❌"
                      : row.discord}
                </div>
              </div>
            ))}
          </div>
        </section>
      </AnimatedSection>

      {/* CTA */}
      <AnimatedSection animation="fade-up">
        <section className={classes.pageCta}>
          <h2>Ready to experience true privacy?</h2>
          <p>Join thousands of users who own their conversations.</p>
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
            <Link
              className={classes.secondaryButton}
              to="/how-it-works">
              How It Works
            </Link>
          </div>
        </section>
      </AnimatedSection>
    </div>
  );
};
