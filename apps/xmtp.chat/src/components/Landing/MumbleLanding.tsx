import { useEffect, useState, type FC } from "react";
import classes from "./MumbleLanding.module.css";

const Logo = "/favicon.svg";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Powered By", href: "#powered-by" },
  { label: "Roadmap", href: "#roadmap" },
  { label: "Tokenomics", href: "#tokenomics" },
  { label: "FAQs", href: "#faqs" },
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
    question: "Do I need a specific wallet to use MumbleChat?",
    answer:
      "Any wallet supported on Ramestta works. Connect, approve the session, and your encrypted inbox syncs immediately.",
  },
  {
    question: "How is my data stored?",
    answer:
      "Messages are sealed with XMTP encryption and anchored to Ramestta storage. Only the intended participants can decrypt them.",
  },
  {
    question: "Can communities customize the chat experience?",
    answer:
      "Yes. Roles, channel permissions, and bot automations are all configurable so DAOs can tailor their workspace.",
  },
  {
    question: "Is there a cost to send messages?",
    answer:
      "Ramestta keeps fees minimal. MumbleChat batches writes where possible so everyday messaging stays affordable.",
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
      <div className={classes.background} aria-hidden="true" />
      <header className={navClass}>
        <div className={classes.navContainer}>
          <a
            className={classes.brand}
            href="#home"
            onClick={() => {
              setMenuOpen(false);
            }}>
            <img
              src={Logo}
              alt="MumbleChat Logo"
              className={classes.brandIcon}
              style={{ height: 32, width: 32 }}
            />
            <span className={classes.brandLabel}>MumbleChat</span>
          </a>
          <nav className={classes.navLinks} aria-label="Primary">
            {navLinks.map(({ label, href }) => (
              <a key={label} href={href} className={classes.navLink}>
                {label}
              </a>
            ))}
          </nav>
          <div className={classes.navActions}>
            <a
              className={classes.primaryButton}
              href="http://localhost:5189/welcome">
              Connect Wallet
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
              href="http://localhost:5189/welcome"
              onClick={() => {
                setMenuOpen(false);
              }}>
              Connect Wallet
            </a>
          </nav>
        )}
      </header>

      <main className={classes.content}>
        <section className={classes.hero} id="home">
          <div className={classes.heroBadge}>Ramestta Layer-3 Blockchain</div>
          <h1 className={classes.heroTitle}>
            Institutional-grade decentralized messaging, powered by Ramestta.
          </h1>
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
          <div className={classes.heroActions}>
            <a
              className={classes.primaryButton}
              href="http://localhost:5189/welcome">
              Connect Wallet
            </a>
            <a className={classes.secondaryButton} href="#powered-by">
              Learn More About Ramestta
            </a>
          </div>
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

        <section className={classes.cta}>
          <h2>Ready to take control of your conversations?</h2>
          <p>
            Connect your wallet to start sending encrypted messages on Ramestta.
            No emails. No phone numbers. Just you and your community.
          </p>
          <div className={classes.ctaActions}>
            <a
              className={classes.primaryButton}
              href="http://localhost:5189/welcome">
              Connect Wallet
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
          <img
            src={Logo}
            alt="MumbleChat Logo"
            className={classes.brandIcon}
            style={{ height: 32, width: 32 }}
          />
          <div>
            <p className={classes.brandLabel}>MumbleChat</p>
            <p className={classes.footerCopy}>
              Secure, decentralized messaging powered by the Ramestta
              blockchain.
            </p>
          </div>
        </div>
        <div className={classes.footerLinks}>
          <div>
            <h3>Product</h3>
            <a href="#features">Features</a>
            <a href="#roadmap">Roadmap</a>
            <a href="#tokenomics">Tokenomics</a>
          </div>
          <div>
            <h3>Resources</h3>
            <a href="https://docs.xmtp.org/" target="_blank" rel="noreferrer">
              Documentation
            </a>
            <a
              href="https://community.xmtp.org/"
              target="_blank"
              rel="noreferrer">
              Community
            </a>
            <a href="#faqs">FAQs</a>
          </div>
        </div>
        <div className={classes.footerMeta}>
          <span>
            © {new Date().getFullYear()} MumbleChat. Built on Ramestta.
          </span>
          <div>
            <a href="#powered-by">Terms</a>
            <a href="#powered-by">Privacy</a>
            <a href="#powered-by">Cookies</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
