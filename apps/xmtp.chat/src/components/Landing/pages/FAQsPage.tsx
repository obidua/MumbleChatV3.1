import { useState, type FC } from "react";
import { Link } from "react-router";
import { AnimatedSection } from "../components/AnimatedSection";
import classes from "../LandingPages.module.css";

const faqCategories = [
  {
    id: "general",
    label: "General",
    icon: "💬",
  },
  {
    id: "security",
    label: "Security",
    icon: "🔐",
  },
  {
    id: "technical",
    label: "Technical",
    icon: "⚙️",
  },
  {
    id: "pricing",
    label: "Pricing",
    icon: "💰",
  },
];

const faqItems = [
  {
    category: "general",
    question: "Who is MumbleChat built for?",
    answer:
      "Wallet-native communities, ecosystem projects, and institutions that need private, verifiable messaging. If your members live onchain, MumbleChat gives them a familiar chat surface secured by Ramestta + XMTP.",
  },
  {
    category: "general",
    question: "How does Ramestta Layer-3 improve messaging?",
    answer:
      "Ramestta delivers sub-2 second finality, deterministic micro-fees, and Ethereum-grade security. Messages settle on XMTP while Ramestta handles identity proofs, device attestations, and programmable automations.",
  },
  {
    category: "general",
    question: "Which wallets and devices are supported?",
    answer:
      "Any XMTP-compatible wallet works: MetaMask, Coinbase Wallet, Trust Wallet, Rainbow, Ledger + WalletConnect, and 300+ others. Install the PWA on desktop or mobile, connect your wallet, and your inbox syncs instantly.",
  },
  {
    category: "general",
    question: "Can I run MumbleChat across multiple devices?",
    answer:
      "Yes. Connect on as many devices as you need—each gets its own Installation ID and independent key material. Messages, reactions, and files stay in sync via the XMTP network.",
  },
  {
    category: "security",
    question: "How are conversations kept private?",
    answer:
      "Every DM and group thread is encrypted end-to-end using Signal-style double ratchet protocol. Keys live on each device installation. Neither MumbleChat nor Ramestta nodes can read message content—only intended participants can decrypt.",
  },
  {
    category: "security",
    question: "What is the 90-day installation expiry?",
    answer:
      "Each connected device receives an Installation ID that automatically expires after 90 days. Re-authenticating with your wallet renews access and rotates keys, preventing forgotten laptops or compromised devices from lingering.",
  },
  {
    category: "security",
    question: "Can someone hack my messages?",
    answer:
      "Messages are encrypted with 256-bit AES encryption using the Signal Protocol. Breaking this would require computational power that doesn't exist. Your messages are mathematically secure.",
  },
  {
    category: "security",
    question: "What happens if I lose my device?",
    answer:
      "You can revoke access from any device using our Inbox Tools. The lost device will immediately lose access to your inbox. After 90 days, the installation expires automatically anyway.",
  },
  {
    category: "technical",
    question: "What is XMTP?",
    answer:
      "XMTP (Extensible Message Transport Protocol) is a decentralized messaging protocol that enables wallet-to-wallet communication. It's the underlying network that MumbleChat uses for message delivery.",
  },
  {
    category: "technical",
    question: "What's the difference between Inbox ID and Installation ID?",
    answer:
      "Your Inbox ID is your permanent inbox identifier tied to your wallet—it never changes. Installation ID is unique per device and expires after 90 days. One Inbox can have multiple Installations.",
  },
  {
    category: "technical",
    question: "Can teams customize permissions and workflows?",
    answer:
      "Group owners can gate membership, assign admins, pin metadata, and wire up bots or webhooks. The same XMTP conversation can be surfaced inside your internal tools via the SDKs.",
  },
  {
    category: "technical",
    question: "How do I migrate an existing community?",
    answer:
      "Spin up a group, invite members via wallet address/ENS/Base name, and drop a deep link in your current channels. Because identity is wallet-based, no emails or phone numbers are required.",
  },
  {
    category: "pricing",
    question: "How much does it cost to send messages?",
    answer:
      "Typical fees range between $0.0002 and $0.001 thanks to Ramestta's deterministic gas schedule. Reads are free, writes are batched, and you only pay network fees when automations or bots interact with smart contracts.",
  },
  {
    category: "pricing",
    question: "Is MumbleChat free to use?",
    answer:
      "Yes! The app itself is completely free. The only costs are the minimal network fees on Ramestta for certain on-chain operations, which are fractions of a cent.",
  },
  {
    category: "pricing",
    question: "Are there premium features?",
    answer:
      "Currently all features are free for everyone. We may introduce optional premium features in the future, but core messaging will always remain free.",
  },
];

export const FAQsPage: FC = () => {
  const [activeCategory, setActiveCategory] = useState("general");
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

  const filteredFaqs = faqItems.filter(
    (faq) => faq.category === activeCategory,
  );

  return (
    <div className={classes.pageContent}>
      <section className={classes.pageHero}>
        <AnimatedSection animation="fade-up">
          <span className={classes.pageEyebrow}>
            <span className={classes.eyebrowIcon}>❓</span>
            FAQs
          </span>
          <h1 className={classes.pageTitle}>
            Frequently Asked{" "}
            <span className={classes.gradientText}>Questions</span>
          </h1>
          <p className={classes.pageSubtitle}>
            Everything you need to know about MumbleChat. Can't find the answer?
            Contact our support team.
          </p>
        </AnimatedSection>
      </section>

      {/* Category Tabs */}
      <AnimatedSection animation="fade-up" delay={0.2}>
        <section className={classes.faqCategories}>
          {faqCategories.map((category) => (
            <button
              key={category.id}
              className={`${classes.faqCategoryTab} ${activeCategory === category.id ? classes.faqCategoryActive : ""}`}
              onClick={() => {
                setActiveCategory(category.id);
              }}>
              <span className={classes.faqCategoryIcon}>{category.icon}</span>
              {category.label}
            </button>
          ))}
        </section>
      </AnimatedSection>

      {/* FAQ Accordion */}
      <section className={classes.faqAccordion}>
        {filteredFaqs.map((faq, index) => (
          <AnimatedSection
            key={faq.question}
            animation="fade-up"
            delay={index * 0.05}>
            <article
              className={`${classes.faqAccordionItem} ${expandedFaq === faq.question ? classes.faqExpanded : ""}`}
              onClick={() => {
                setExpandedFaq(
                  expandedFaq === faq.question ? null : faq.question,
                );
              }}>
              <div className={classes.faqAccordionHeader}>
                <h3>{faq.question}</h3>
                <span className={classes.faqAccordionIcon}>
                  {expandedFaq === faq.question ? "−" : "+"}
                </span>
              </div>
              <div className={classes.faqAccordionContent}>
                <p>{faq.answer}</p>
              </div>
            </article>
          </AnimatedSection>
        ))}
      </section>

      {/* Quick Links */}
      <AnimatedSection animation="fade-up">
        <section className={classes.faqQuickLinks}>
          <h2 className={classes.sectionTitle}>
            Still Have <span className={classes.gradientText}>Questions?</span>
          </h2>
          <div className={classes.faqQuickLinksGrid}>
            <Link to="/support" className={classes.faqQuickLink}>
              <div className={classes.faqQuickLinkIcon}>💬</div>
              <div>
                <h3>Contact Support</h3>
                <p>Get help from our community and developers</p>
              </div>
              <span className={classes.faqQuickLinkArrow}>→</span>
            </Link>
            <a
              href="https://docs.xmtp.org/"
              target="_blank"
              rel="noopener noreferrer"
              className={classes.faqQuickLink}>
              <div className={classes.faqQuickLinkIcon}>📚</div>
              <div>
                <h3>XMTP Documentation</h3>
                <p>Deep dive into the protocol</p>
              </div>
              <span className={classes.faqQuickLinkArrow}>→</span>
            </a>
            <a
              href="https://github.com/AvinashNayak27/xmtp-inbox-web"
              target="_blank"
              rel="noopener noreferrer"
              className={classes.faqQuickLink}>
              <div className={classes.faqQuickLinkIcon}>🔧</div>
              <div>
                <h3>GitHub Repository</h3>
                <p>View source code and contribute</p>
              </div>
              <span className={classes.faqQuickLinkArrow}>→</span>
            </a>
          </div>
        </section>
      </AnimatedSection>

      {/* CTA */}
      <AnimatedSection animation="fade-up">
        <section className={classes.pageCta}>
          <h2>Ready to get started?</h2>
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
            <Link className={classes.secondaryButton} to="/support">
              Contact Support
            </Link>
          </div>
        </section>
      </AnimatedSection>
    </div>
  );
};
