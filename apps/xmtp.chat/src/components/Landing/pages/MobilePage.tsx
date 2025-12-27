import { type FC } from "react";
import { Link } from "react-router";
import { AnimatedSection } from "../components/AnimatedSection";
import classes from "../LandingPages.module.css";

const platforms = [
  {
    icon: "🍎",
    name: "iOS",
    description:
      "Install as a Progressive Web App from Safari for native-like experience.",
    steps: [
      "Open MumbleChat in Safari",
      "Tap the Share button (square with arrow)",
      'Scroll down and tap "Add to Home Screen"',
      'Tap "Add" to confirm',
    ],
    features: [
      "Full-screen mode",
      "Push notifications",
      "Home screen icon",
      "Offline access",
    ],
  },
  {
    icon: "🤖",
    name: "Android",
    description: "Install directly from Chrome or Samsung Internet browser.",
    steps: [
      "Open MumbleChat in Chrome",
      "Tap the menu (three dots)",
      'Tap "Install app" or "Add to Home Screen"',
      "Confirm the installation",
    ],
    features: [
      "Native app experience",
      "Push notifications",
      "Background sync",
      "Auto-updates",
    ],
  },
  {
    icon: "💻",
    name: "Desktop",
    description:
      "Install as a PWA on Chrome, Edge, or Brave for desktop convenience.",
    steps: [
      "Open MumbleChat in Chrome/Edge/Brave",
      "Click the install icon in the address bar",
      'Click "Install" to confirm',
      "Launch from your applications",
    ],
    features: [
      "Desktop notifications",
      "Standalone window",
      "Keyboard shortcuts",
      "System integration",
    ],
  },
];

const pwaAdvantages = [
  {
    icon: "🚀",
    title: "Instant Updates",
    description:
      "Always get the latest version without app store delays. Updates are automatic and instant.",
  },
  {
    icon: "📦",
    title: "No App Store Required",
    description:
      "Install directly from your browser—no App Store or Play Store download needed.",
  },
  {
    icon: "💾",
    title: "Minimal Storage",
    description:
      "PWAs use significantly less storage than native apps while providing similar functionality.",
  },
  {
    icon: "🔒",
    title: "Secure & Private",
    description:
      "HTTPS-only with same security as native apps. Your wallet keys stay on your device.",
  },
  {
    icon: "📱",
    title: "Native Feel",
    description:
      "Full-screen mode, home screen icon, and smooth animations—feels like a native app.",
  },
  {
    icon: "🌐",
    title: "Cross-Platform",
    description:
      "One codebase, all platforms. Same great experience on iOS, Android, and desktop.",
  },
];

const faqs = [
  {
    question: "What is a PWA?",
    answer:
      "A Progressive Web App (PWA) is a website that can be installed on your device and behaves like a native app. It works offline, sends notifications, and launches from your home screen.",
  },
  {
    question: "Is the PWA as secure as a native app?",
    answer:
      "Yes! PWAs run over HTTPS with the same encryption as native apps. Your wallet keys are stored securely on your device using browser APIs that are equally secure.",
  },
  {
    question: "Can I receive notifications?",
    answer:
      "Yes, you can enable push notifications to get alerts for new messages even when the app is closed. Grant permission when prompted during setup.",
  },
  {
    question: "Does it work offline?",
    answer:
      "Partially. You can view your message history offline, but sending new messages requires an internet connection to reach the XMTP network.",
  },
];

export const MobilePage: FC = () => {
  return (
    <div className={classes.pageContent}>
      <section className={classes.pageHero}>
        <AnimatedSection animation="fade-up">
          <span className={classes.pageEyebrow}>
            <span className={classes.eyebrowIcon}>📱</span>
            Mobile
          </span>
          <h1 className={classes.pageTitle}>
            MumbleChat on{" "}
            <span className={classes.gradientText}>Every Device</span>
          </h1>
          <p className={classes.pageSubtitle}>
            Install as a Progressive Web App on iOS, Android, and desktop for a
            native-like experience.
          </p>
        </AnimatedSection>
      </section>

      {/* Device Mockups */}
      <AnimatedSection animation="scale-up">
        <section className={classes.deviceMockups}>
          <div className={classes.mockupPhone}>
            <div className={classes.phoneFrame}>
              <div className={classes.phoneNotch} />
              <div className={classes.phoneScreen}>
                <div className={classes.phoneMockupContent}>
                  <div className={classes.mockupHeader}>
                    <span>MumbleChat</span>
                    <span>⋮</span>
                  </div>
                  <div className={classes.mockupChatList}>
                    <div className={classes.mockupChatItem} />
                    <div className={classes.mockupChatItem} />
                    <div className={classes.mockupChatItem} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* Platform Installation Guides */}
      <section className={classes.platformsSection}>
        <AnimatedSection animation="fade-up">
          <h2 className={classes.sectionTitle}>
            Installation <span className={classes.gradientText}>Guide</span>
          </h2>
        </AnimatedSection>

        <div className={classes.platformsGrid}>
          {platforms.map((platform, index) => (
            <AnimatedSection
              key={platform.name}
              animation="fade-up"
              delay={index * 0.15}>
              <article className={classes.platformCard}>
                <div className={classes.platformHeader}>
                  <div className={classes.platformIcon}>{platform.icon}</div>
                  <h3>{platform.name}</h3>
                </div>
                <p className={classes.platformDesc}>{platform.description}</p>

                <div className={classes.platformSteps}>
                  <h4>How to Install:</h4>
                  <ol>
                    {platform.steps.map((step, i) => (
                      <li key={i}>{step}</li>
                    ))}
                  </ol>
                </div>

                <div className={classes.platformFeatures}>
                  {platform.features.map((feature) => (
                    <span
                      key={feature}
                      className={classes.platformFeatureBadge}>
                      {feature}
                    </span>
                  ))}
                </div>
                <div className={classes.platformCardGlow} />
              </article>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* PWA Advantages */}
      <section className={classes.advantagesSection}>
        <AnimatedSection animation="fade-up">
          <h2 className={classes.sectionTitle}>
            Why <span className={classes.gradientText}>PWA?</span>
          </h2>
          <p className={classes.sectionSubtitle}>
            Progressive Web Apps offer the best of both web and native
            applications.
          </p>
        </AnimatedSection>

        <div className={classes.advantagesGrid}>
          {pwaAdvantages.map((advantage, index) => (
            <AnimatedSection
              key={advantage.title}
              animation="fade-up"
              delay={index * 0.08}>
              <article className={classes.advantageCard}>
                <div className={classes.advantageIcon}>{advantage.icon}</div>
                <h3>{advantage.title}</h3>
                <p>{advantage.description}</p>
              </article>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* FAQs */}
      <section className={classes.mobileFaqSection}>
        <AnimatedSection animation="fade-up">
          <h2 className={classes.sectionTitle}>
            Frequently Asked{" "}
            <span className={classes.gradientText}>Questions</span>
          </h2>
        </AnimatedSection>

        <div className={classes.faqList}>
          {faqs.map((faq, index) => (
            <AnimatedSection
              key={faq.question}
              animation="slide-right"
              delay={index * 0.1}>
              <article className={classes.faqItem}>
                <h3>{faq.question}</h3>
                <p>{faq.answer}</p>
              </article>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* CTA */}
      <AnimatedSection animation="fade-up">
        <section className={classes.pageCta}>
          <h2>Ready to install MumbleChat?</h2>
          <p>Get the best messaging experience on your device.</p>
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
            <Link className={classes.secondaryButton} to="/faqs">
              More FAQs
            </Link>
          </div>
        </section>
      </AnimatedSection>
    </div>
  );
};
