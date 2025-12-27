import { type FC } from "react";
import { Link } from "react-router";
import { AnimatedSection } from "../components/AnimatedSection";
import classes from "../LandingPages.module.css";

const supportChannels = [
  {
    icon: "📚",
    title: "Documentation",
    description: "Comprehensive guides and API references for XMTP protocol.",
    link: "https://docs.xmtp.org/",
    linkText: "Browse Docs",
    external: true,
  },
  {
    icon: "💬",
    title: "Community Discord",
    description: "Join the XMTP community for discussions, help, and updates.",
    link: "https://discord.gg/xmtp",
    linkText: "Join Discord",
    external: true,
  },
  {
    icon: "🐙",
    title: "GitHub",
    description:
      "View source code, report issues, and contribute to development.",
    link: "https://github.com/AvinashNayak27/xmtp-inbox-web",
    linkText: "View Repository",
    external: true,
  },
  {
    icon: "🌐",
    title: "XMTP Community",
    description: "Official XMTP community forum for technical discussions.",
    link: "https://community.xmtp.org/",
    linkText: "Visit Forum",
    external: true,
  },
  {
    icon: "🔧",
    title: "Inbox Tools",
    description:
      "Manage your devices, revoke installations, and check inbox status.",
    link: "/inbox-tools",
    linkText: "Open Tools",
    external: false,
  },
  {
    icon: "🌐",
    title: "Ramestta Network",
    description: "Learn more about the Ramestta Layer-3 blockchain.",
    link: "https://www.ramestta.com/",
    linkText: "Visit Ramestta",
    external: true,
  },
];

const quickHelp = [
  {
    question: "How do I connect my wallet?",
    answer:
      'Click "Launch App", then "Connect Wallet". Choose your wallet (MetaMask, WalletConnect, etc.) and sign the authentication message.',
  },
  {
    question: "My device expired. How do I reconnect?",
    answer:
      'Simply click "Connect Wallet" again and sign a new message. Your message history will still be there.',
  },
  {
    question: "How do I revoke a lost device?",
    answer:
      'Go to Inbox Tools, connect your wallet, and you\'ll see all your connected devices. Click "Revoke" on any device you want to remove.',
  },
  {
    question: "Why can't I see my old messages?",
    answer:
      "Messages sync when you connect. If messages are missing, try refreshing the page or reconnecting your wallet. Messages are stored on the XMTP network, not your device.",
  },
];

export const SupportPage: FC = () => {
  return (
    <div className={classes.pageContent}>
      <section className={classes.pageHero}>
        <AnimatedSection animation="fade-up">
          <span className={classes.pageEyebrow}>
            <span className={classes.eyebrowIcon}>🆘</span>
            Support
          </span>
          <h1 className={classes.pageTitle}>
            We're Here to <span className={classes.gradientText}>Help</span>
          </h1>
          <p className={classes.pageSubtitle}>
            Get help from our community, browse documentation, or report issues
            on GitHub.
          </p>
        </AnimatedSection>
      </section>

      {/* Support Channels */}
      <section className={classes.supportSection}>
        <AnimatedSection animation="fade-up">
          <h2 className={classes.sectionTitle}>
            Support <span className={classes.gradientText}>Channels</span>
          </h2>
        </AnimatedSection>

        <div className={classes.supportGrid}>
          {supportChannels.map((channel, index) => (
            <AnimatedSection
              key={channel.title}
              animation="fade-up"
              delay={index * 0.1}>
              <article className={classes.supportCard}>
                <div className={classes.supportCardIcon}>{channel.icon}</div>
                <h3>{channel.title}</h3>
                <p>{channel.description}</p>
                {channel.external ? (
                  <a
                    href={channel.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={classes.supportLink}>
                    {channel.linkText}
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                  </a>
                ) : (
                  <Link to={channel.link} className={classes.supportLink}>
                    {channel.linkText}
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </Link>
                )}
                <div className={classes.supportCardGlow} />
              </article>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* Quick Help */}
      <section className={classes.quickHelpSection}>
        <AnimatedSection animation="fade-up">
          <h2 className={classes.sectionTitle}>
            Quick <span className={classes.gradientText}>Help</span>
          </h2>
          <p className={classes.sectionSubtitle}>
            Common questions and quick solutions.
          </p>
        </AnimatedSection>

        <div className={classes.quickHelpList}>
          {quickHelp.map((item, index) => (
            <AnimatedSection
              key={item.question}
              animation="slide-right"
              delay={index * 0.1}>
              <article className={classes.quickHelpItem}>
                <h3>{item.question}</h3>
                <p>{item.answer}</p>
              </article>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* Developer Resources */}
      <AnimatedSection animation="fade-up">
        <section className={classes.devSection}>
          <div className={classes.devContent}>
            <h2>
              For <span className={classes.gradientText}>Developers</span>
            </h2>
            <p>
              MumbleChat is built on XMTP—an open protocol for secure messaging.
              Developers can fork the client, build bots, or integrate messaging
              into their own apps.
            </p>
            <div className={classes.devLinks}>
              <a
                href="https://docs.xmtp.org/"
                target="_blank"
                rel="noopener noreferrer"
                className={classes.devLink}>
                📖 XMTP Docs
              </a>
              <a
                href="https://docs.xmtp.org/client-sdk/"
                target="_blank"
                rel="noopener noreferrer"
                className={classes.devLink}>
                🔌 SDK Reference
              </a>
              <a
                href="https://github.com/xmtp"
                target="_blank"
                rel="noopener noreferrer"
                className={classes.devLink}>
                🐙 XMTP GitHub
              </a>
            </div>
          </div>
          <div className={classes.devCode}>
            <pre>
              <code>{`// Connect to XMTP
import { Client } from "@xmtp/browser-sdk";

const client = await Client.create(signer, {
  env: "dev",
});

// Send a message
const conversation = await client.conversations
  .newDm("0x1234...");
  
await conversation.send("Hello from MumbleChat!");`}</code>
            </pre>
          </div>
        </section>
      </AnimatedSection>

      {/* CTA */}
      <AnimatedSection animation="fade-up">
        <section className={classes.pageCta}>
          <h2>Can't find what you need?</h2>
          <p>Our community is always ready to help.</p>
          <div className={classes.ctaButtons}>
            <a
              className={classes.primaryButton}
              href="https://discord.gg/xmtp"
              target="_blank"
              rel="noopener noreferrer">
              <span className={classes.buttonText}>Join Discord</span>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </a>
            <a className={classes.secondaryButton} href="/welcome">
              Launch App
            </a>
          </div>
        </section>
      </AnimatedSection>
    </div>
  );
};
