import { useEffect, useState, type FC } from "react";
import { Link } from "react-router";
import { MumbleChatLogo } from "@/icons/MumbleChatLogo";
import { AnimatedSection } from "../components/AnimatedSection";
import { ParticleBackground } from "../components/ParticleBackground";
import { StatsCounter } from "../components/StatsCounter";
import classes from "../LandingPages.module.css";

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

const classNames = (...values: Array<string | false | undefined>) =>
  values.filter(Boolean).join(" ");

export const HomePage: FC = () => {
  const [typedText, setTypedText] = useState("");
  const fullText = "Institutional-grade decentralized messaging";

  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index <= fullText.length) {
        setTypedText(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 50);
    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <div className={classes.pageContent}>
      <ParticleBackground />

      {/* Hero Section */}
      <section className={classes.hero} id="home">
        <div className={classes.heroGlow} />
        <div className={classes.heroLogoWrapper}>
          <div className={classes.heroLogoRing} />
          <div className={classes.heroLogoRing2} />
          <div className={classes.heroLogoRing3} />
          <div className={classes.heroLogoRingPurple} />
          <div className={classes.heroLogoRingPurple2} />
          <MumbleChatLogo className={classes.heroLogo} />
        </div>

        <AnimatedSection animation="fade-up" delay={0.2}>
          <div className={classes.heroBadge}>
            <span className={classes.badgePulse} />
            Ramestta Layer-3 Blockchain
          </div>
        </AnimatedSection>

        <AnimatedSection animation="fade-up" delay={0.4}>
          <h1 className={classes.heroTitle}>
            {typedText}
            <span className={classes.cursor}>|</span>
            <br />
            <span className={classes.heroTitleGradient}>
              powered by Ramestta.
            </span>
          </h1>
        </AnimatedSection>

        <AnimatedSection animation="fade-up" delay={0.6}>
          <p className={classes.heroSubtitle}>
            Experience secure, censorship-resistant messaging with sub-2 second
            finality, 65,000+ TPS, and deterministic micro-fees on
            Ethereum-aligned Layer-3.
          </p>
        </AnimatedSection>

        <AnimatedSection animation="fade-up" delay={0.8}>
          <div className={classes.heroActions}>
            <a className={classes.primaryButton} href="/welcome">
              <span className={classes.buttonGlow} />
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
            <Link className={classes.secondaryButton} to="/features">
              Explore Features
            </Link>
          </div>
        </AnimatedSection>

        <AnimatedSection animation="fade-up" delay={1}>
          <div className={classes.heroStats}>
            <StatsCounter end={65000} suffix="+" label="TPS Capacity" />
            <StatsCounter end={2} suffix="s" label="Finality" />
            <StatsCounter
              end={0.0002}
              prefix="$"
              decimals={4}
              label="Avg Fee"
            />
            <StatsCounter end={100} suffix="%" label="EVM Compatible" />
          </div>
        </AnimatedSection>
      </section>

      {/* Chat Preview Section */}
      <AnimatedSection animation="scale-up" delay={0.2}>
        <section className={classes.mockupSection}>
          <div className={classes.mockupGlow} />
          <div className={classes.mockupContainer}>
            <div className={classes.mockupTopBar}>
              <div className={classes.windowControls}>
                <span className={classes.windowClose} />
                <span className={classes.windowMinimize} />
                <span className={classes.windowMaximize} />
              </div>
              <div className={classes.addressBar}>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                mumblechat.com
              </div>
            </div>
            <div className={classes.mockupBody}>
              <aside className={classes.channelColumn}>
                <div className={classes.channelHeader}>
                  <span>Chats</span>
                  <button className={classes.channelAdd}>+</button>
                </div>
                <div className={classes.channelSearch}>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2">
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.35-4.35" />
                  </svg>
                  Search channels...
                </div>
                <ul className={classes.channelList}>
                  {channels.map((channel, index) => (
                    <li
                      key={channel}
                      className={classNames(
                        classes.channelItem,
                        index === 0 && classes.channelItemActive,
                      )}
                      style={{ animationDelay: `${index * 0.1}s` }}>
                      <span className={classes.channelAvatar}>
                        {channel.slice(0, 2)}
                      </span>
                      <div className={classes.channelInfo}>
                        <span className={classes.channelLabel}>{channel}</span>
                        <span className={classes.channelPreview}>
                          Last message preview...
                        </span>
                      </div>
                      {index === 0 && (
                        <span className={classes.channelBadge}>2</span>
                      )}
                    </li>
                  ))}
                </ul>
              </aside>
              <div className={classes.threadColumn}>
                <header className={classes.threadHeader}>
                  <div className={classes.threadInfo}>
                    <div className={classes.threadAvatar}>0x</div>
                    <div>
                      <div className={classes.threadTitle}>0xe9..2d9</div>
                      <div className={classes.threadStatus}>
                        <span className={classes.statusDot} />
                        Online
                      </div>
                    </div>
                  </div>
                  <div className={classes.threadActions}>
                    <button className={classes.threadAction}>📞</button>
                    <button className={classes.threadAction}>📎</button>
                    <button className={classes.threadAction}>⋮</button>
                  </div>
                </header>
                <div className={classes.threadMessages}>
                  {channelMessages.map(({ sender, content }, index) => (
                    <div
                      key={content}
                      className={classNames(
                        classes.messageRow,
                        sender === "me" && classes.messageRowOwn,
                      )}
                      style={{ animationDelay: `${index * 0.15}s` }}>
                      <div className={classes.messageBubble}>
                        {content}
                        <span className={classes.messageTime}>12:3{index}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className={classes.threadComposer}>
                  <button className={classes.composerEmoji}>😊</button>
                  <input
                    type="text"
                    placeholder="Type an encrypted message..."
                    className={classes.composerInput}
                  />
                  <button className={classes.composerSend}>
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="currentColor">
                      <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* Why Ramestta Section */}
      <AnimatedSection animation="fade-up">
        <section className={classes.whySection} id="powered-by">
          <div className={classes.sectionHeading}>
            <span className={classes.sectionEyebrow}>
              <span className={classes.eyebrowIcon}>⚡</span>
              Why Ramestta?
            </span>
            <h2 className={classes.sectionTitle}>
              Institutional-Grade{" "}
              <span className={classes.gradientText}>Layer-3</span>{" "}
              Infrastructure
            </h2>
            <p className={classes.sectionSubtitle}>
              Ramestta completes the Ethereum scalability stack—every
              conversation anchored directly on the blockchain with no
              centralized databases or middlemen.
            </p>
          </div>

          <div className={classes.whyGrid}>
            {[
              {
                icon: "🏗️",
                title: "True Layer-3 Architecture",
                desc: "Built on Polygon (L2), secured by Ethereum (L1) for mass adoption.",
              },
              {
                icon: "⚡",
                title: "Sub-2 Second Finality",
                desc: "Programmable finality with instant (~2s) and ultimate security.",
              },
              {
                icon: "💰",
                title: "Deterministic Micro-Fees",
                desc: "Predictable costs between $0.0002-$0.001—1000× cheaper than L1/L2.",
              },
              {
                icon: "🔐",
                title: "Ethereum Security",
                desc: "Inherits trust from Ethereum via Polygon checkpoints.",
              },
              {
                icon: "🔄",
                title: "100% EVM Equivalence",
                desc: "Migrate from Polygon/Ethereum with zero code changes.",
              },
              {
                icon: "🚀",
                title: "65,000+ TPS Capacity",
                desc: "Enterprise-grade throughput with horizontal scaling.",
              },
            ].map((item, index) => (
              <div
                key={item.title}
                className={classes.whyCard}
                style={{ animationDelay: `${index * 0.1}s` }}>
                <div className={classes.whyCardIcon}>{item.icon}</div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
                <div className={classes.cardGlow} />
              </div>
            ))}
          </div>

          <div className={classes.ctaRow}>
            <a
              href="https://www.ramestta.com/"
              target="_blank"
              rel="noopener noreferrer"
              className={classes.learnMoreLink}>
              Learn more at ramestta.com
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </a>
          </div>
        </section>
      </AnimatedSection>

      {/* Quick Links Section */}
      <AnimatedSection animation="fade-up">
        <section className={classes.quickLinks}>
          <h2 className={classes.quickLinksTitle}>Explore MumbleChat</h2>
          <div className={classes.quickLinksGrid}>
            <Link to="/features" className={classes.quickLinkCard}>
              <div className={classes.quickLinkIcon}>🎯</div>
              <h3>Features</h3>
              <p>End-to-end encryption, decentralized storage & more</p>
              <span className={classes.quickLinkArrow}>→</span>
            </Link>
            <Link to="/how-it-works" className={classes.quickLinkCard}>
              <div className={classes.quickLinkIcon}>🔧</div>
              <h3>How It Works</h3>
              <p>Understand wallet identity, Inbox ID & encryption</p>
              <span className={classes.quickLinkArrow}>→</span>
            </Link>
            <Link to="/security" className={classes.quickLinkCard}>
              <div className={classes.quickLinkIcon}>🛡️</div>
              <h3>Security</h3>
              <p>Military-grade encryption & device management</p>
              <span className={classes.quickLinkArrow}>→</span>
            </Link>
            <Link to="/mobile" className={classes.quickLinkCard}>
              <div className={classes.quickLinkIcon}>📱</div>
              <h3>Mobile</h3>
              <p>Install as PWA on iOS, Android & desktop</p>
              <span className={classes.quickLinkArrow}>→</span>
            </Link>
          </div>
        </section>
      </AnimatedSection>
    </div>
  );
};
