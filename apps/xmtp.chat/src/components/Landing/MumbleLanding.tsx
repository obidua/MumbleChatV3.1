import { useEffect, useState, type FC } from "react";
import { LandingInstallBanner } from "@/components/PWA/LandingInstallBanner";
import { MumbleChatLogo } from "@/icons/MumbleChatLogo";
import classes from "./MumbleLanding.module.css";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "How It Works", href: "/landing/how-it-works", isPage: true },
  { label: "Features", href: "/landing/features", isPage: true },
  { label: "Mobile", href: "/landing/mobile", isPage: true },
  { label: "Security", href: "/landing/security", isPage: true },
  { label: "FAQs", href: "/landing/faqs", isPage: true },
  { label: "Support", href: "/landing/support", isPage: true },
];

const featureCards = [
  {
    title: "End-to-End Encryption",
    copy: "Messages stay encrypted from your wallet to your recipient, secured by Ramestta-native keys.",
  },
  {
    title: "Decentralized Storage",
    copy: "All threads live on the Ramestta blockchain—immutable, censorship resistant, and verifiable.",
  },
  {
    title: "Community Owned",
    copy: "Wallets act as identity. No phone numbers, emails, or centralized gateways required.",
  },
  {
    title: "Privacy First",
    copy: "Metadata is minimized and routed over encrypted transports so conversations stay private.",
  },
  {
    title: "Lightning Fast",
    copy: "Optimized indexing and local caching deliver near-instant message sync without sacrificing security.",
  },
  {
    title: "Global Access",
    copy: "Wherever your wallet connects, your inbox follows. Ramestta availability keeps communities online.",
  },
];

const channels = [
  "0xe9..2d9",
  "jsreigns.rama",
  "0x35..1c02",
  "findus.rama",
  "0x45..db6b",
  "0xe74b..3d44",
];

const channelMessages = [
  {
    sender: "them",
    content: "Hey, are you ready for the Ramestta mainnet launch tonight?",
  },
  {
    sender: "me",
    content:
      "Absolutely. Liquidity is locked, keys rotated, infra double-checked.",
  },
  {
    sender: "them",
    content:
      "Perfect. MumbleChat notifications are pinned in the community channel.",
  },
  {
    sender: "me",
    content: "See you in the launch stream. XMTP client already synced.",
  },
];

// ...existing code...

const roadmapPhases = [
  {
    phase: "Phase I",
    title: "Core messaging launch",
    copy: "Direct wallet-to-wallet chat, encrypted storage, and Ramestta mainnet availability.",
    status: "Shipped",
  },
  {
    phase: "Phase II",
    title: "Community tooling",
    copy: "Group channels, moderation controls, and programmable bots for DAO operations.",
    status: "In progress",
  },
  {
    phase: "Phase III",
    title: "Ecosystem expansion",
    copy: "Bridged inboxes, custom themes, and liquidity programs to grow the MumbleChat network.",
    status: "Queued",
  },
];

const allocations = [
  {
    label: "Community rewards",
    percent: "40%",
    copy: "Distributed to active chat operators, moderators, and builders expanding the network.",
  },
  {
    label: "Core contributors",
    percent: "30%",
    copy: "Vested allocation aligned with long-term protocol development and maintenance.",
  },
  {
    label: "Liquidity & treasury",
    percent: "20%",
    copy: "Supports exchange liquidity, partnerships, and ongoing infrastructure costs.",
  },
  {
    label: "Ecosystem grants",
    percent: "10%",
    copy: "Fund experimentation across wallets, clients, and integrations on Ramestta.",
  },
];

const faqItems = [
  {
    question: "Who is MumbleChat built for?",
    answer:
      "Wallet-native communities, ecosystem projects, and institutions that need private, verifiable messaging. If your members live onchain, MumbleChat gives them a familiar chat surface secured by Ramestta + XMTP.",
  },
  {
    question: "How does Ramestta Layer-3 improve messaging?",
    answer:
      "Ramestta delivers sub-2 second finality, deterministic micro-fees, and Ethereum-grade security. Messages settle on XMTP while Ramestta handles identity proofs, device attestations, and programmable automations.",
  },
  {
    question: "Which wallets and devices are supported?",
    answer:
      "Any XMTP-compatible wallet works: MetaMask, Coinbase Wallet, Trust Wallet, Rainbow, Ledger + WalletConnect, and 300+ others. Install the PWA on desktop or mobile, connect your wallet, and your inbox syncs instantly.",
  },
  {
    question: "How are conversations kept private?",
    answer:
      "Every DM and group thread is encrypted end-to-end (Signal-style double ratchet). Keys live on each device installation. Neither MumbleChat nor Ramestta nodes can read message content—only intended participants can decrypt.",
  },
  {
    question: "What is the 90-day installation expiry?",
    answer:
      "Each connected device receives an Installation ID that automatically expires after 90 days. Re-authenticating with your wallet renews access and rotates keys, preventing forgotten laptops or compromised devices from lingering.",
  },
  {
    question: "Can I run MumbleChat across multiple devices?",
    answer:
      "Yes. Connect on as many devices as you need—each gets its own Installation ID and independent key material. Messages, reactions, and files stay in sync via the XMTP network.",
  },
  {
    question: "How much does it cost to send messages?",
    answer:
      "Typical fees range between $0.0002 and $0.001 thanks to Ramestta’s deterministic gas schedule. Reads are free, writes are batched, and you only pay network fees when automations or bots interact with smart contracts.",
  },
  {
    question: "Can teams customize permissions and workflows?",
    answer:
      "Group owners can gate membership, assign admins, pin metadata, and wire up bots or webhooks. The same XMTP conversation can be surfaced inside your internal tools via the SDKs.",
  },
  {
    question: "How do I migrate an existing community?",
    answer:
      "Spin up a group, invite members via wallet address/ENS/Base name, and drop a deep link in your current channels. Because identity is wallet-based, no emails or phone numbers are required.",
  },
  {
    question: "Where can I get help or build integrations?",
    answer:
      "Visit the Support section below for docs, community, and GitHub links. Developers can fork the open-source client, extend XMTP bots, or embed MumbleChat components inside existing dashboards.",
  },
];

const footerMenus = [
  {
    heading: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "Security", href: "#security" },
      { label: "Roadmap", href: "#roadmap" },
      { label: "Comparison", href: "#comparison" },
    ],
  },
  {
    heading: "Platform",
    links: [
      { label: "How It Works", href: "#how-it-works" },
      { label: "Device Management", href: "#device-management" },
      { label: "Mobile Support", href: "#mobile-support" },
      { label: "FAQs", href: "#faqs" },
    ],
  },
  {
    heading: "Developers",
    links: [
      {
        label: "XMTP Docs",
        href: "https://docs.xmtp.org/",
        external: true,
      },
      {
        label: "GitHub",
        href: "https://github.com/xmtp/xmtp-inbox-web/",
        external: true,
      },
      {
        label: "API Reference",
        href: "https://docs.xmtp.org/client-sdk/",
        external: true,
      },
      {
        label: "Brand Assets",
        href: "#powered-by",
      },
    ],
  },
  {
    heading: "Community",
    links: [
      {
        label: "Support Center",
        href: "#support",
      },
      {
        label: "XMTP Community",
        href: "https://community.xmtp.org/",
        external: true,
      },
      {
        label: "Ramestta",
        href: "https://www.ramestta.com/",
        external: true,
      },
      {
        label: "Status",
        href: "#powered-by",
      },
    ],
  },
];

const classNames = (...values: Array<string | false | undefined>) =>
  values.filter(Boolean).join(" ");

export const MumbleLanding: FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 16);
    };
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const navClass = classNames(
    classes.navbar,
    scrolled && classes.navbarScrolled,
  );

  return (
    <div className={classes.page}>
      <LandingInstallBanner />
      <div className={classes.background} aria-hidden="true" />
      <header className={navClass}>
        <div className={classes.navContainer}>
          <a
            className={classes.brand}
            href="#home"
            onClick={() => {
              setMenuOpen(false);
            }}>
            <div className={classes.brandIcon}>
              <MumbleChatLogo className={classes.brandLogo} />
            </div>
            <div className={classes.brandText}>
              <span className={classes.brandLabel}>
                Mumble<span className={classes.brandAccent}>Chat</span>
              </span>
              <span className={classes.brandSlogan}>
                ⚡ Decentralized Messaging
              </span>
            </div>
          </a>
          <nav className={classes.navLinks} aria-label="Primary">
            {navLinks.map(({ label, href }) => (
              <a key={label} href={href} className={classes.navLink}>
                {label}
              </a>
            ))}
          </nav>
          <div className={classes.navActions}>
            <a className={classes.primaryButton} href="/welcome">
              Launch App
            </a>
            <button
              type="button"
              className={classes.menuButton}
              aria-expanded={menuOpen}
              aria-controls="mumble-mobile-nav"
              onClick={() => {
                setMenuOpen((value) => !value);
              }}>
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
        {menuOpen && (
          <nav
            id="mumble-mobile-nav"
            className={classes.mobileNav}
            aria-label="Mobile navigation">
            {navLinks.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                className={classes.mobileNavLink}
                onClick={() => {
                  setMenuOpen(false);
                }}>
                {label}
              </a>
            ))}
            <a
              className={classes.mobilePrimaryButton}
              href="/welcome"
              onClick={() => {
                setMenuOpen(false);
              }}>
              Launch App
            </a>
          </nav>
        )}
      </header>

      <main className={classes.content}>
        <section className={classes.hero} id="home">
          {/* Floating Logo */}
          <div className={classes.heroLogoWrapper}>
            <MumbleChatLogo className={classes.heroLogo} />
          </div>

          <div className={classes.heroBadge}>Ramestta Layer-3 Blockchain</div>
          <h1 className={classes.heroTitle}>
            Institutional-grade decentralized messaging, powered by Ramestta.
          </h1>
          <div className={classes.heroActions}>
            <a className={classes.primaryButton} href="/welcome">
              Launch App
            </a>
            <a className={classes.secondaryButton} href="/landing">
              Explore Features →
            </a>
          </div>
          <p className={classes.heroCopy}>
            Ramestta is an Ethereum-aligned Layer-3 blockchain built on Polygon,
            engineered for real-world adoption with sub-2 second finality,
            65,000+ TPS, and deterministic micro-fees. Experience secure,
            censorship-resistant messaging with EVM compatibility and
            Ethereum-level trust.
          </p>
          <ul className={classes.heroList}>
            <li>
              True Layer-3 architecture: Built on Polygon, secured by Ethereum
            </li>
            <li>Sub-2 second programmable finality</li>
            <li>Deterministic micro-fees ($0.0002-$0.001 per transaction)</li>
            <li>100% EVM equivalence for seamless migration</li>
            <li>Enterprise-grade throughput (65,000+ TPS)</li>
            <li>Production-ready for payments, gaming, DeFi, and more</li>
          </ul>
          <p className={classes.heroNote}>
            Ramestta: The missing execution layer in Web3 infrastructure. Built
            for privacy, security, and true ownership of your communication.
          </p>
        </section>

        <section
          className={classes.mockupSection}
          aria-labelledby="mockup-heading">
          <h2 id="mockup-heading" className={classes.sectionVisuallyHidden}>
            Product preview
          </h2>
          <div className={classes.mockupContainer}>
            <div className={classes.mockupTopBar}>
              <div className={classes.windowControls}>
                <span />
                <span />
                <span />
              </div>
              <div className={classes.addressBar}>mumblechat.com</div>
            </div>
            <div className={classes.mockupBody}>
              <aside className={classes.channelColumn}>
                <div className={classes.channelHeader}>
                  <span>Chats</span>
                  <span className={classes.channelMenu}>⋮</span>
                </div>
                <div className={classes.channelSearch}>Search channels...</div>
                <ul className={classes.channelList}>
                  {channels.map((channel, index) => (
                    <li
                      key={channel}
                      className={classNames(
                        classes.channelItem,
                        index === 0 && classes.channelItemActive,
                      )}>
                      <span className={classes.channelAvatar}>
                        {channel.slice(0, 2)}
                      </span>
                      <span className={classes.channelLabel}>{channel}</span>
                    </li>
                  ))}
                </ul>
              </aside>
              <div className={classes.threadColumn}>
                <header className={classes.threadHeader}>
                  <div>
                    <div className={classes.threadTitle}>0xe9..2d9</div>
                    <div className={classes.threadStatus}>Online</div>
                  </div>
                  <div className={classes.threadActions}>
                    <span />
                    <span />
                  </div>
                </header>
                <div className={classes.threadMessages}>
                  {channelMessages.map(({ sender, content }) => (
                    <div
                      key={content}
                      className={classNames(
                        classes.messageRow,
                        sender === "me" && classes.messageRowOwn,
                      )}>
                      <div className={classes.messageBubble}>{content}</div>
                    </div>
                  ))}
                </div>
                <div className={classes.threadComposer}>
                  Encrypted message composer
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className={classes.powered} id="powered-by">
          <div className={classes.sectionHeading}>
            <span className={classes.sectionEyebrow}>Why Ramestta?</span>
            <h2>Institutional-Grade Layer-3 Infrastructure</h2>
            <p>
              Ramestta completes the Ethereum scalability stack—not as a
              competitor, but as the final adoption-ready Layer-3. Every
              conversation is anchored directly on the Ramestta blockchain: no
              centralized databases, no middlemen, no ads—just encrypted
              messages that you own.
            </p>
            <ul className={classes.poweredList}>
              <li>
                <strong>True Layer-3 Architecture:</strong> Built on Polygon
                (L2), secured by Ethereum (L1) for mass adoption.
              </li>
              <li>
                <strong>Sub-2 Second Finality:</strong> Programmable finality
                with instant (~2s), hard (~7-10min), and ultimate security.
              </li>
              <li>
                <strong>Deterministic Micro-Fees:</strong> Predictable
                transaction costs between $0.0002-$0.001—1000× cheaper than
                L1/L2 chains.
              </li>
              <li>
                <strong>Ethereum Security Inheritance:</strong> Inherits trust
                from Ethereum via Polygon checkpoints—economic and cryptographic
                guarantees.
              </li>
              <li>
                <strong>100% EVM Equivalence:</strong> Fully equivalent, migrate
                from Polygon/Ethereum with zero code changes.
              </li>
              <li>
                <strong>65,000+ TPS Capacity:</strong> Enterprise-grade
                throughput with horizontal scaling via multi-instance
                architecture.
              </li>
            </ul>
            <p>
              <a
                href="https://www.ramestta.com/"
                target="_blank"
                rel="noopener noreferrer">
                Learn more at ramestta.com
              </a>
            </p>
          </div>
        </section>

        <section className={classes.features} id="features">
          <div className={classes.sectionHeading}>
            <span className={classes.sectionEyebrow}>Why MumbleChat</span>
            <h2>Everything you need to own your conversations.</h2>
            <p>
              Privacy-first tooling, resilient infrastructure, and UI built for
              communities who live onchain.
            </p>
          </div>
          <div className={classes.featureGrid}>
            {featureCards.map((feature) => (
              <article key={feature.title} className={classes.featureCard}>
                <h3>{feature.title}</h3>
                <p>{feature.copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={classes.roadmap} id="roadmap">
          <div className={classes.sectionHeading}>
            <span className={classes.sectionEyebrow}>Roadmap</span>
            <h2>Ship fast, stay decentralized.</h2>
            <p>
              The path to a global, wallet-native messaging layer on Ramestta.
            </p>
          </div>
          <div className={classes.roadmapTimeline}>
            {roadmapPhases.map((phase) => (
              <article key={phase.title} className={classes.roadmapItem}>
                <span className={classes.roadmapBadge}>{phase.phase}</span>
                <h3>{phase.title}</h3>
                <p>{phase.copy}</p>
                <span className={classes.roadmapStatus}>{phase.status}</span>
              </article>
            ))}
          </div>
        </section>

        <section className={classes.tokenomics} id="tokenomics">
          <div className={classes.sectionHeading}>
            <span className={classes.sectionEyebrow}>Tokenomics</span>
            <h2>Transparent allocation for network growth.</h2>
            <p>
              The MumbleChat token aligns early adopters, builders, and
              liquidity providers powering the Ramestta messaging layer.
            </p>
          </div>
          <div className={classes.tokenomicGrid}>
            {allocations.map((allocation) => (
              <article key={allocation.label} className={classes.tokenomicCard}>
                <span className={classes.tokenomicPercent}>
                  {allocation.percent}
                </span>
                <h3>{allocation.label}</h3>
                <p>{allocation.copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={classes.faqs} id="faqs">
          <div className={classes.sectionHeading}>
            <span className={classes.sectionEyebrow}>FAQs</span>
            <h2>Answers before you connect.</h2>
          </div>
          <div className={classes.faqList}>
            {faqItems.map((faq) => (
              <article key={faq.question} className={classes.faqItem}>
                <h3>{faq.question}</h3>
                <p>{faq.answer}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={classes.howItWorks} id="how-it-works">
          <div className={classes.sectionHeading}>
            <span className={classes.sectionEyebrow}>How It Works</span>
            <h2>Understanding MumbleChat</h2>
            <p>
              MumbleChat is built on XMTP (Extensible Message Transport
              Protocol), a decentralized messaging network. Here's everything
              you need to know about how it works.
            </p>
          </div>
          <div className={classes.conceptsGrid}>
            <article className={classes.conceptCard}>
              <h3>🔑 Wallet Address as Identity</h3>
              <p>
                <strong>Your wallet is your identity.</strong> No phone numbers,
                emails, or usernames required. Your Ethereum/Ramestta wallet
                address (e.g., 0x1234...5678) serves as your unique identifier
                across the network.
              </p>
              <ul>
                <li>
                  <strong>ENS/Basename Support:</strong> Use human-readable
                  names like "alice.eth" or "bob.base"
                </li>
                <li>
                  <strong>Cross-Chain Compatible:</strong> One address works
                  across all supported networks
                </li>
                <li>
                  <strong>Self-Sovereign:</strong> You own your identity—no
                  platform can ban or censor you
                </li>
              </ul>
            </article>

            <article className={classes.conceptCard}>
              <h3>📬 Inbox ID</h3>
              <p>
                <strong>Your unique inbox identifier.</strong> When you first
                connect your wallet to XMTP, an Inbox ID is created—a permanent
                inbox tied to your wallet address.
              </p>
              <ul>
                <li>
                  <strong>Permanent:</strong> Your Inbox ID never changes
                </li>
                <li>
                  <strong>Privacy:</strong> Different from your wallet address
                  for additional privacy
                </li>
                <li>
                  <strong>Universal:</strong> Access your inbox from any XMTP
                  client (MumbleChat, Converse, etc.)
                </li>
              </ul>
            </article>

            <article className={classes.conceptCard}>
              <h3>💻 Installation ID</h3>
              <p>
                <strong>Each device gets a unique installation.</strong> When
                you connect a device (phone, laptop, tablet), XMTP creates an
                Installation ID—a cryptographic identity for that specific
                device.
              </p>
              <ul>
                <li>
                  <strong>Multi-Device:</strong> Use MumbleChat on unlimited
                  devices simultaneously
                </li>
                <li>
                  <strong>Secure Keys:</strong> Each device has its own
                  encryption keys
                </li>
                <li>
                  <strong>Sync Everywhere:</strong> Messages sync across all
                  your connected devices
                </li>
              </ul>
            </article>

            <article className={classes.conceptCard}>
              <h3>⏰ 3-Month Device Expiry</h3>
              <p>
                <strong>Security feature: 90-day expiration.</strong> For your
                protection, each device installation expires after 3 months.
                This prevents compromised or stolen devices from accessing your
                messages indefinitely.
              </p>
              <ul>
                <li>
                  <strong>Why 90 Days?</strong> Balances convenience with
                  security—industry standard for session tokens
                </li>
                <li>
                  <strong>Easy Renewal:</strong> Simply reconnect your wallet
                  when expired (takes 30 seconds)
                </li>
                <li>
                  <strong>Auto-Revoke:</strong> Old/forgotten devices
                  automatically lose access
                </li>
                <li>
                  <strong>Data Preserved:</strong> All message history remains
                  intact after reconnection
                </li>
              </ul>
            </article>

            <article className={classes.conceptCard}>
              <h3>🔐 End-to-End Encryption</h3>
              <p>
                <strong>Military-grade encryption.</strong> Messages are
                encrypted on your device before sending and only decrypted by
                the recipient. Nobody—not even MumbleChat or XMTP—can read your
                messages.
              </p>
              <ul>
                <li>
                  <strong>Protocol:</strong> Signal Protocol (same as WhatsApp,
                  Signal app)
                </li>
                <li>
                  <strong>Keys:</strong> Unique encryption keys per conversation
                </li>
                <li>
                  <strong>Metadata:</strong> Minimal metadata stored—only what's
                  needed for delivery
                </li>
              </ul>
            </article>

            <article className={classes.conceptCard}>
              <h3>🌐 Decentralized Storage</h3>
              <p>
                <strong>Messages stored on XMTP network.</strong> Your messages
                are stored on a decentralized network of nodes, not centralized
                servers. This ensures censorship resistance and data
                sovereignty.
              </p>
              <ul>
                <li>
                  <strong>No Single Point of Failure:</strong> Distributed
                  across multiple nodes
                </li>
                <li>
                  <strong>Immutable:</strong> Once sent, messages can't be
                  altered or deleted by third parties
                </li>
                <li>
                  <strong>Always Accessible:</strong> Access from anywhere, any
                  XMTP client
                </li>
              </ul>
            </article>
          </div>
        </section>

        <section className={classes.howToUse} id="how-to-use">
          <div className={classes.sectionHeading}>
            <span className={classes.sectionEyebrow}>Getting Started</span>
            <h2>How to Use MumbleChat</h2>
            <p>
              Start chatting securely in minutes with this simple step-by-step
              guide.
            </p>
          </div>
          <div className={classes.howToUseGrid}>
            <article className={classes.howToUseCard}>
              <div className={classes.howToUseNumber}>1</div>
              <h3>Connect Your Wallet</h3>
              <p>
                Use MetaMask, WalletConnect, or any compatible wallet to sign
                in. Your wallet address becomes your identity—no email or phone
                number required.
              </p>
              <ul>
                <li>Click "Connect Wallet" button</li>
                <li>
                  Select your preferred wallet (MetaMask, Trust Wallet,
                  Coinbase, etc.)
                </li>
                <li>Sign the message to create your secure XMTP identity</li>
                <li>Your inbox is ready in seconds!</li>
              </ul>
            </article>

            <article className={classes.howToUseCard}>
              <div className={classes.howToUseNumber}>2</div>
              <h3>Start a Conversation</h3>
              <p>
                Tap the "New" button, enter a wallet address or ENS name, and
                start messaging. You can also create group chats with multiple
                people.
              </p>
              <ul>
                <li>
                  <strong>Direct Message:</strong> Enter any Ethereum address
                  (0x1234...)
                </li>
                <li>
                  <strong>ENS Names:</strong> Use readable names like
                  "alice.eth"
                </li>
                <li>
                  <strong>Group Chat:</strong> Add multiple members and set
                  group name
                </li>
                <li>
                  <strong>Group Permissions:</strong> Control who can add
                  members or change settings
                </li>
              </ul>
            </article>

            <article className={classes.howToUseCard}>
              <div className={classes.howToUseNumber}>3</div>
              <h3>Send Messages & Media</h3>
              <p>
                Type your message and hit send. You can also share attachments,
                react to messages, and reply to specific messages for organized
                conversations.
              </p>
              <ul>
                <li>
                  <strong>Text Messages:</strong> Full emoji support and rich
                  text
                </li>
                <li>
                  <strong>Attachments:</strong> Share images, documents, and
                  files
                </li>
                <li>
                  <strong>Reactions:</strong> React with ❤️ 👍 😂 and more
                </li>
                <li>
                  <strong>Replies:</strong> Quote and reply to specific messages
                </li>
              </ul>
            </article>

            <article className={classes.howToUseCard}>
              <div className={classes.howToUseNumber}>4</div>
              <h3>Manage Your Devices</h3>
              <p>
                Visit the Profile tab to see all connected devices and revoke
                access from devices you no longer use. Stay secure with
                automatic 90-day expiry.
              </p>
              <ul>
                <li>
                  <strong>View Installations:</strong> See all your connected
                  devices
                </li>
                <li>
                  <strong>Check Expiry:</strong> Monitor when devices need
                  renewal
                </li>
                <li>
                  <strong>Revoke Access:</strong> Remove compromised or old
                  devices
                </li>
                <li>
                  <strong>Reconnect:</strong> Simply sign in again after expiry
                </li>
              </ul>
            </article>
          </div>
        </section>

        <section className={classes.featuresDetailed} id="features-detailed">
          <div className={classes.sectionHeading}>
            <span className={classes.sectionEyebrow}>Features</span>
            <h2>Everything You Need for Secure Communication</h2>
            <p>
              MumbleChat provides all the features you expect from a modern
              messenger, with the added benefits of decentralization and true
              ownership.
            </p>
          </div>
          <div className={classes.featuresDetailedGrid}>
            <article className={classes.featureDetailCard}>
              <div className={classes.featureIcon}>💬</div>
              <h3>Direct Messages</h3>
              <p>
                Private 1-on-1 conversations with end-to-end encryption. Send
                messages to any Ethereum address or ENS name—messages are
                encrypted from your device to theirs, with zero access from
                intermediaries.
              </p>
              <ul>
                <li>✅ End-to-end encrypted</li>
                <li>✅ No central server can read your messages</li>
                <li>✅ Permanent message history on XMTP network</li>
                <li>✅ Works with any XMTP-compatible client</li>
              </ul>
            </article>

            <article className={classes.featureDetailCard}>
              <div className={classes.featureIcon}>👥</div>
              <h3>Group Chats</h3>
              <p>
                Create groups, manage members, and chat with multiple people.
                Group admins can control permissions, add/remove members, and
                customize group metadata.
              </p>
              <ul>
                <li>✅ Unlimited group size</li>
                <li>✅ Custom group names and descriptions</li>
                <li>
                  ✅ Granular permissions (add members, change metadata, etc.)
                </li>
                <li>✅ Member management (add, remove, view members)</li>
              </ul>
            </article>

            <article className={classes.featureDetailCard}>
              <div className={classes.featureIcon}>📎</div>
              <h3>File Sharing</h3>
              <p>
                Share images, documents, and other files securely. Files are
                encrypted and stored on decentralized infrastructure, ensuring
                privacy and availability.
              </p>
              <ul>
                <li>✅ Support for images, PDFs, documents</li>
                <li>✅ Encrypted file storage</li>
                <li>✅ Decentralized hosting</li>
                <li>✅ Preview images directly in chat</li>
              </ul>
            </article>

            <article className={classes.featureDetailCard}>
              <div className={classes.featureIcon}>🔄</div>
              <h3>Multi-Device Sync</h3>
              <p>
                Access your messages from any device seamlessly. Connect
                unlimited devices—phone, laptop, tablet—and all your
                conversations sync automatically across all devices.
              </p>
              <ul>
                <li>✅ Unlimited devices supported</li>
                <li>✅ Real-time message sync</li>
                <li>✅ Independent device encryption keys</li>
                <li>✅ Manage devices from Profile page</li>
              </ul>
            </article>

            <article className={classes.featureDetailCard}>
              <div className={classes.featureIcon}>❤️</div>
              <h3>Reactions</h3>
              <p>
                React to messages with emojis for quick responses. Express
                yourself without typing—perfect for group chats and quick
                acknowledgments.
              </p>
              <ul>
                <li>✅ Full emoji support</li>
                <li>✅ Multiple reactions per message</li>
                <li>✅ See who reacted</li>
                <li>✅ Add or remove your reactions</li>
              </ul>
            </article>

            <article className={classes.featureDetailCard}>
              <div className={classes.featureIcon}>↩️</div>
              <h3>Replies</h3>
              <p>
                Reply to specific messages to keep conversations organized.
                Quote and respond to messages in threads—perfect for busy group
                chats or following up on specific topics.
              </p>
              <ul>
                <li>✅ Quote original message</li>
                <li>✅ Visual thread indicators</li>
                <li>✅ Jump to referenced message</li>
                <li>✅ Works in DMs and groups</li>
              </ul>
            </article>
          </div>
        </section>

        <section className={classes.deviceManagement} id="device-management">
          <div className={classes.sectionHeading}>
            <span className={classes.sectionEyebrow}>Device Management</span>
            <h2>Managing Your Installations</h2>
            <p>
              Learn how to manage devices, check expiry dates, and maintain
              secure access to your conversations.
            </p>
          </div>
          <div className={classes.guideGrid}>
            <article className={classes.guideCard}>
              <div className={classes.guideNumber}>01</div>
              <h3>Viewing Your Installations</h3>
              <ol>
                <li>Open MumbleChat and connect your wallet</li>
                <li>Navigate to Profile tab (bottom right)</li>
                <li>Your installations list shows all connected devices:</li>
              </ol>
              <ul>
                <li>
                  <strong>Installation ID:</strong> Unique identifier (e.g.,
                  0x1234...5678)
                </li>
                <li>
                  <strong>Created:</strong> When you connected this device
                  (e.g., "2 months ago")
                </li>
                <li>
                  <strong>Expires:</strong> Time remaining (e.g., "in 1 month")
                </li>
                <li>
                  <strong>Status:</strong> 🟢 Active | 🟡 Expiring Soon | 🔴
                  Expired
                </li>
                <li>
                  <strong>Current:</strong> Badge showing your current device
                </li>
              </ul>
            </article>

            <article className={classes.guideCard}>
              <div className={classes.guideNumber}>02</div>
              <h3>When a Device Expires</h3>
              <p>
                <strong>What happens after 90 days:</strong>
              </p>
              <ul>
                <li>❌ Device loses access to send/receive messages</li>
                <li>⚠️ Status shows "Expired" in red</li>
                <li>🔴 Red indicator in installations list</li>
                <li>✅ Message history preserved on XMTP network</li>
              </ul>
              <p>
                <strong>What you keep:</strong>
              </p>
              <ul>
                <li>✅ All previous conversations</li>
                <li>✅ Group memberships</li>
                <li>✅ Contact list</li>
                <li>✅ Wallet address/identity</li>
              </ul>
            </article>

            <article className={classes.guideCard}>
              <div className={classes.guideNumber}>03</div>
              <h3>Reconnecting an Expired Device</h3>
              <ol>
                <li>Open MumbleChat on the expired device</li>
                <li>Click "Connect Wallet"</li>
                <li>Sign authentication message with your wallet</li>
                <li>✅ New 90-day installation created (takes ~30 seconds)</li>
                <li>Messages automatically sync from network</li>
              </ol>
              <p>
                <strong>Note:</strong> You'll get a new Installation ID, but
                your Inbox ID remains the same—all conversations intact!
              </p>
            </article>

            <article className={classes.guideCard}>
              <div className={classes.guideNumber}>04</div>
              <h3>Revoking Devices</h3>
              <p>
                <strong>Manual revocation:</strong> Remove access from specific
                devices before they expire.
              </p>
              <ol>
                <li>Go to Profile → View Installations</li>
                <li>
                  Find the device you want to revoke in the installations list
                </li>
                <li>
                  Click "Revoke" button next to that installation, or click
                  "Revoke All Other Installations" to keep only current device
                </li>
                <li>✅ Device immediately loses access</li>
              </ol>
              <p>
                <strong>When to revoke:</strong>
              </p>
              <ul>
                <li>Lost or stolen device</li>
                <li>Selling/disposing of old device</li>
                <li>Suspicious activity detected</li>
                <li>No longer using that device</li>
              </ul>
            </article>
          </div>
        </section>

        <section className={classes.mobileSupport} id="mobile-support">
          <div className={classes.sectionHeading}>
            <span className={classes.sectionEyebrow}>Mobile Support</span>
            <h2>Using MumbleChat on Mobile</h2>
            <p>
              MumbleChat is a Progressive Web App (PWA) that works seamlessly on
              mobile devices with your favorite crypto wallets.
            </p>
          </div>
          <div className={classes.mobileGrid}>
            <article className={classes.mobileCard}>
              <h3>📱 Supported Mobile Wallets</h3>
              <ul>
                <li>
                  <strong>MetaMask Mobile:</strong> Full support via injected
                  provider and WalletConnect
                </li>
                <li>
                  <strong>Trust Wallet:</strong> Native support with automatic
                  detection
                </li>
                <li>
                  <strong>Coinbase Wallet:</strong> Dedicated connector with
                  deep linking
                </li>
                <li>
                  <strong>Rainbow Wallet:</strong> Via WalletConnect protocol
                </li>
                <li>
                  <strong>300+ Other Wallets:</strong> Any wallet supporting
                  WalletConnect v2
                </li>
              </ul>
            </article>

            <article className={classes.mobileCard}>
              <h3>🔗 How Mobile Connection Works</h3>
              <ol>
                <li>
                  <strong>Open PWA:</strong> Visit mumblechat.com on your mobile
                  browser (Chrome, Safari, etc.)
                </li>
                <li>
                  <strong>Click Connect Wallet:</strong> App detects available
                  wallets on your device
                </li>
                <li>
                  <strong>Choose Wallet:</strong>
                  <ul>
                    <li>
                      If MetaMask/Trust Wallet installed → Opens wallet app
                      directly
                    </li>
                    <li>
                      If no wallet → Shows WalletConnect QR/deeplink options
                    </li>
                  </ul>
                </li>
                <li>
                  <strong>Sign Message:</strong> Approve authentication in your
                  wallet app
                </li>
                <li>
                  <strong>✅ Connected:</strong> Start chatting immediately!
                </li>
              </ol>
            </article>

            <article className={classes.mobileCard}>
              <h3>🌐 Custom Networks & Rametta</h3>
              <p>
                <strong>
                  Adding custom EVM networks to your mobile wallet:
                </strong>
              </p>
              <ol>
                <li>Open your wallet app (MetaMask, Trust Wallet, etc.)</li>
                <li>Go to Settings → Networks → Add Network</li>
                <li>Enter network details:</li>
              </ol>
              <ul>
                <li>
                  <strong>Network Name:</strong> Rametta (or your custom
                  network)
                </li>
                <li>
                  <strong>RPC URL:</strong> https://blockchain.ramestta.com
                </li>
                <li>
                  <strong>Chain ID:</strong> 1370 (for Rametta)
                </li>
                <li>
                  <strong>Currency Symbol:</strong> RAMA
                </li>
                <li>
                  <strong>Block Explorer:</strong> https://ramascan.com
                </li>
              </ul>
              <p>
                <strong>Auto-add via app:</strong> MumbleChat can prompt your
                wallet to add networks automatically when you try to switch.
              </p>
            </article>

            <article className={classes.mobileCard}>
              <h3>💾 Installing as PWA</h3>
              <p>
                <strong>iOS (Safari):</strong>
              </p>
              <ol>
                <li>Visit mumblechat.com in Safari</li>
                <li>Tap Share icon (square with arrow up)</li>
                <li>Scroll down and tap "Add to Home Screen"</li>
                <li>✅ App icon appears on home screen</li>
              </ol>
              <p>
                <strong>Android (Chrome):</strong>
              </p>
              <ol>
                <li>Visit mumblechat.com in Chrome</li>
                <li>
                  Tap three-dot menu → "Install App" or "Add to Home screen"
                </li>
                <li>✅ App installs like native app</li>
              </ol>
              <p>
                <strong>Benefits:</strong> Works offline, fast loading, native
                app feel, push notifications
              </p>
            </article>
          </div>
        </section>

        <section className={classes.security} id="security">
          <div className={classes.sectionHeading}>
            <span className={classes.sectionEyebrow}>Security & Privacy</span>
            <h2>How We Keep You Safe</h2>
            <p>
              MumbleChat prioritizes your security and privacy through multiple
              layers of protection.
            </p>
          </div>
          <div className={classes.securityGrid}>
            <article className={classes.securityCard}>
              <h3>🔐 Encryption Standards</h3>
              <ul>
                <li>
                  <strong>Protocol:</strong> Signal Protocol with Double Ratchet
                  algorithm
                </li>
                <li>
                  <strong>Key Exchange:</strong> Diffie-Hellman key agreement
                </li>
                <li>
                  <strong>Forward Secrecy:</strong> New keys generated for each
                  message
                </li>
                <li>
                  <strong>Post-Compromise Security:</strong> Automatic key
                  rotation after potential compromise
                </li>
              </ul>
            </article>

            <article className={classes.securityCard}>
              <h3>🛡️ Device Security</h3>
              <ul>
                <li>
                  <strong>90-Day Expiry:</strong> Limits exposure from
                  compromised devices
                </li>
                <li>
                  <strong>Device-Specific Keys:</strong> Each installation has
                  unique cryptographic keys
                </li>
                <li>
                  <strong>Revocation:</strong> Instantly remove access from any
                  device
                </li>
                <li>
                  <strong>Activity Monitoring:</strong> View all connected
                  devices in Profile
                </li>
              </ul>
            </article>

            <article className={classes.securityCard}>
              <h3>🔒 What We DON'T Store</h3>
              <ul>
                <li>❌ Message content (encrypted end-to-end)</li>
                <li>❌ Private keys (stored only on your device/wallet)</li>
                <li>❌ Phone numbers or email addresses</li>
                <li>❌ Personal information or KYC data</li>
                <li>❌ Browsing history or analytics</li>
              </ul>
            </article>

            <article className={classes.securityCard}>
              <h3>✅ Best Practices</h3>
              <ul>
                <li>
                  <strong>Use Strong Passwords:</strong> Protect your wallet
                  with strong password/PIN
                </li>
                <li>
                  <strong>Enable 2FA:</strong> If your wallet supports it
                </li>
                <li>
                  <strong>Verify Addresses:</strong> Always double-check
                  recipient addresses
                </li>
                <li>
                  <strong>Revoke Unused Devices:</strong> Remove old
                  installations regularly
                </li>
                <li>
                  <strong>Keep Wallet Secure:</strong> Never share seed phrase
                  or private keys
                </li>
                <li>
                  <strong>Reconnect Before Expiry:</strong> Avoid disruption by
                  reconnecting devices proactively
                </li>
              </ul>
            </article>
          </div>
        </section>

        <section className={classes.support} id="support">
          <div className={classes.sectionHeading}>
            <span className={classes.sectionEyebrow}>Help & Support</span>
            <h2>Need Help? We're Here.</h2>
            <p>
              Get assistance with MumbleChat, XMTP, or Ramestta blockchain
              integration.
            </p>
          </div>
          <div className={classes.supportGrid}>
            <article className={classes.supportCard}>
              <h3>📖 In-App Help</h3>
              <p>Access comprehensive help directly in the app:</p>
              <ol>
                <li>Open MumbleChat and connect your wallet</li>
                <li>Navigate to Profile tab (bottom navigation)</li>
                <li>Click the Help icon (🛈) next to "Identity" title</li>
                <li>Browse detailed explanations of all concepts:</li>
              </ol>
              <ul>
                <li>What is MumbleChat?</li>
                <li>Wallet Address, Inbox ID, Installation ID explained</li>
                <li>How to use MumbleChat (step-by-step guide)</li>
                <li>Features overview (DMs, Groups, Files, Sync, etc.)</li>
                <li>Security & Privacy details</li>
              </ul>
            </article>

            <article className={classes.supportCard}>
              <h3>🌐 External Resources</h3>
              <ul>
                <li>
                  <strong>XMTP Documentation:</strong>{" "}
                  <a
                    href="https://docs.xmtp.org/"
                    target="_blank"
                    rel="noopener noreferrer">
                    docs.xmtp.org
                  </a>{" "}
                  — Protocol specs and developer guides
                </li>
                <li>
                  <strong>XMTP Community:</strong>{" "}
                  <a
                    href="https://community.xmtp.org/"
                    target="_blank"
                    rel="noopener noreferrer">
                    community.xmtp.org
                  </a>{" "}
                  — Community forum and discussions
                </li>
                <li>
                  <strong>Ramestta Blockchain:</strong>{" "}
                  <a
                    href="https://www.ramestta.com/"
                    target="_blank"
                    rel="noopener noreferrer">
                    ramestta.com
                  </a>{" "}
                  — Learn about the Layer-3 blockchain
                </li>
                <li>
                  <strong>Block Explorer:</strong>{" "}
                  <a
                    href="https://ramascan.com/"
                    target="_blank"
                    rel="noopener noreferrer">
                    ramascan.com
                  </a>{" "}
                  — View transactions and network stats
                </li>
              </ul>
            </article>

            <article className={classes.supportCard}>
              <h3>❓ Common Issues</h3>
              <p>
                <strong>Can't connect wallet:</strong>
              </p>
              <ul>
                <li>Ensure wallet extension/app is installed and unlocked</li>
                <li>Try refreshing the page</li>
                <li>Clear browser cache and cookies</li>
                <li>Check if wallet supports the network</li>
              </ul>
              <p>
                <strong>Messages not syncing:</strong>
              </p>
              <ul>
                <li>Check internet connection</li>
                <li>Click sync button in top-right menu (⋮)</li>
                <li>Try reconnecting your wallet</li>
                <li>Verify device hasn't expired (check Profile)</li>
              </ul>
              <p>
                <strong>Device shows as expired:</strong>
              </p>
              <ul>
                <li>Simply reconnect your wallet (Connect Wallet button)</li>
                <li>Sign the authentication message</li>
                <li>New 90-day installation created automatically</li>
                <li>Messages sync within seconds</li>
              </ul>
            </article>

            <article className={classes.supportCard}>
              <h3>💬 Contact Support</h3>
              <p>Still need help? Reach out through these channels:</p>
              <ul>
                <li>
                  <strong>Email:</strong> support@mumblechat.com (if applicable)
                </li>
                <li>
                  <strong>Discord:</strong> Join our community server for
                  real-time support
                </li>
                <li>
                  <strong>Telegram:</strong> @MumbleChatSupport (if applicable)
                </li>
                <li>
                  <strong>GitHub:</strong> Report bugs and feature requests on
                  our repository
                </li>
              </ul>
              <p>
                <strong>Response Time:</strong> We typically respond within
                24-48 hours. For urgent security issues, use priority support
                channels.
              </p>
            </article>
          </div>
        </section>

        <section className={classes.comparison} id="comparison">
          <div className={classes.sectionHeading}>
            <span className={classes.sectionEyebrow}>Comparison</span>
            <h2>MumbleChat vs Traditional Messengers</h2>
            <p>
              See how MumbleChat's decentralized approach compares to
              centralized messaging apps.
            </p>
          </div>
          <div className={classes.comparisonTable}>
            <table>
              <thead>
                <tr>
                  <th>Feature</th>
                  <th>MumbleChat (XMTP)</th>
                  <th>WhatsApp/Telegram</th>
                  <th>Discord</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <strong>Identity</strong>
                  </td>
                  <td>✅ Wallet address (self-owned)</td>
                  <td>❌ Phone number required</td>
                  <td>❌ Email/password required</td>
                </tr>
                <tr>
                  <td>
                    <strong>Encryption</strong>
                  </td>
                  <td>✅ End-to-end (E2EE)</td>
                  <td>✅ E2EE (WhatsApp), ⚠️ Optional (Telegram)</td>
                  <td>❌ Transport only (not E2EE)</td>
                </tr>
                <tr>
                  <td>
                    <strong>Data Storage</strong>
                  </td>
                  <td>✅ Decentralized (XMTP network)</td>
                  <td>❌ Centralized servers</td>
                  <td>❌ Centralized servers</td>
                </tr>
                <tr>
                  <td>
                    <strong>Censorship</strong>
                  </td>
                  <td>✅ Resistant (no central authority)</td>
                  <td>❌ Can be banned by governments</td>
                  <td>❌ Platform can ban users</td>
                </tr>
                <tr>
                  <td>
                    <strong>Data Ownership</strong>
                  </td>
                  <td>✅ You own your data</td>
                  <td>❌ Platform owns your data</td>
                  <td>❌ Platform owns your data</td>
                </tr>
                <tr>
                  <td>
                    <strong>Account Deletion</strong>
                  </td>
                  <td>✅ Cannot be deleted by platform</td>
                  <td>❌ Platform can delete account</td>
                  <td>❌ Platform can delete account</td>
                </tr>
                <tr>
                  <td>
                    <strong>Open Source</strong>
                  </td>
                  <td>✅ Fully open source (XMTP protocol)</td>
                  <td>⚠️ Partially open (clients only)</td>
                  <td>❌ Closed source</td>
                </tr>
                <tr>
                  <td>
                    <strong>Multi-Client</strong>
                  </td>
                  <td>✅ Works with any XMTP client</td>
                  <td>❌ Locked to official apps</td>
                  <td>❌ Locked to official apps</td>
                </tr>
                <tr>
                  <td>
                    <strong>Session Expiry</strong>
                  </td>
                  <td>✅ 90 days (security feature)</td>
                  <td>⚠️ Varies (14-30 days for web)</td>
                  <td>❌ Never expires</td>
                </tr>
                <tr>
                  <td>
                    <strong>Blockchain Native</strong>
                  </td>
                  <td>✅ Built for crypto communities</td>
                  <td>❌ Not blockchain-native</td>
                  <td>❌ Not blockchain-native</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className={classes.cta}>
          <h2>Ready to take control of your conversations?</h2>
          <p>
            Connect your wallet to start sending encrypted messages on Ramestta.
            No emails. No phone numbers. Just you and your community.
          </p>
          <div className={classes.ctaActions}>
            <a className={classes.primaryButton} href="/welcome">
              Launch App
            </a>
            <a className={classes.secondaryButton} href="#powered-by">
              Learn more
            </a>
          </div>
        </section>

        <section className={classes.ramesttaInfo} id="ramestta-info">
          <div className={classes.sectionHeading}>
            <span className={classes.sectionEyebrow}>
              Ramestta Layer-3 Blockchain
            </span>
            <h2>What is Ramestta?</h2>
            <p>
              Ramestta is an institutional-grade Layer-3 blockchain built on
              Polygon (L2) and aligned with Ethereum (L1). It’s engineered for
              real-world adoption, delivering sub-2 second finality,
              deterministic micro-fees, and enterprise-grade scalability—without
              compromising security, trust, or developer compatibility.
            </p>
          </div>
          <div className={classes.ramesttaGrid}>
            <div className={classes.ramesttaCard}>
              <div className={classes.ramesttaCardTitle}>
                Layered Architecture
              </div>
              <div className={classes.ramesttaCardDesc}>
                <strong>L1: Ethereum</strong> — Settlement & Security
                <br />
                <strong>L2: Polygon</strong> — Scalable Execution
                <br />
                <strong>L3: Ramestta</strong> — Performance & Adoption
              </div>
            </div>
            <div className={classes.ramesttaCard}>
              <div className={classes.ramesttaCardTitle}>
                Network Parameters
              </div>
              <div className={classes.ramesttaCardDesc}>
                <strong>Type:</strong> Layer-3 (L3)
                <br />
                <strong>Chain ID:</strong> 1370
                <br />
                <strong>Block Time:</strong> ~2 seconds
                <br />
                <strong>Throughput:</strong> 65,000+ TPS
                <br />
                <strong>Gas Fee:</strong> $0.0002 - $0.001
                <br />
                <strong>Security:</strong> Ethereum-aligned PoS
              </div>
            </div>
            <div className={classes.ramesttaCard}>
              <div className={classes.ramesttaCardTitle}>
                Endpoints & Explorer
              </div>
              <div className={classes.ramesttaCardDesc}>
                <strong>RPC:</strong> blockchain.ramestta.com
                <br />
                <strong>RPC2:</strong> blockchain2.ramestta.com
                <br />
                <strong>Explorer:</strong> ramascan.com
                <br />
                <strong>Bridge:</strong> ramabridge.com
                <br />
                <strong>Swap DApp:</strong> ramaswap.com
              </div>
            </div>
            <div className={classes.ramesttaCard}>
              <div className={classes.ramesttaCardTitle}>Ready to Build?</div>
              <div className={classes.ramesttaCardDesc}>
                Ramestta powers payments, gaming, DeFi, and national digital
                infrastructure—today.
                <br />
                Zero code changes, zero migration friction, Ethereum-level
                security, and Web2-level performance.
                <br />
                <a
                  href="https://www.ramestta.com/"
                  target="_blank"
                  rel="noopener noreferrer">
                  Learn more at ramestta.com
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className={classes.footer}>
        <div className={classes.footerBrand}>
          <div className={classes.brandIcon}>
            <MumbleChatLogo className={classes.brandLogo} />
          </div>
          <div>
            <p className={classes.brandLabel}>MumbleChat</p>
            <p className={classes.footerCopy}>
              Secure, decentralized messaging powered by the Ramestta
              blockchain.
            </p>
          </div>
        </div>
        <div className={classes.footerLinks}>
          {footerMenus.map((menu) => (
            <div key={menu.heading}>
              <h3>{menu.heading}</h3>
              {menu.links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noreferrer noopener" : undefined}>
                  {link.label}
                </a>
              ))}
            </div>
          ))}
        </div>
        <div className={classes.footerMeta}>
          <span>
            © {new Date().getFullYear()} MumbleChat. Built on Ramestta.
          </span>
          <div>
            <a href="#powered-by">Terms</a>
            <a href="#security">Privacy</a>
            <a href="#support">Support</a>
            <a href="mailto:security@mumblechat.com">Security</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
