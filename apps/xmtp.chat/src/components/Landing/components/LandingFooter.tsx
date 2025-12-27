import { type FC } from "react";
import { Link } from "react-router";
import { MumbleChatLogo } from "@/icons/MumbleChatLogo";
import classes from "../LandingPages.module.css";

const footerMenus = [
  {
    heading: "Product",
    links: [
      { label: "Features", href: "/features" },
      { label: "Security", href: "/security" },
      { label: "Mobile", href: "/mobile" },
      { label: "FAQs", href: "/faqs" },
    ],
  },
  {
    heading: "Platform",
    links: [
      { label: "How It Works", href: "/how-it-works" },
      { label: "Inbox Tools", href: "/inbox-tools" },
      { label: "Support", href: "/support" },
    ],
  },
  {
    heading: "Developers",
    links: [
      { label: "XMTP Docs", href: "https://docs.xmtp.org/", external: true },
      {
        label: "GitHub",
        href: "https://github.com/AvinashNayak27/xmtp-inbox-web",
        external: true,
      },
      {
        label: "SDK Reference",
        href: "https://docs.xmtp.org/client-sdk/",
        external: true,
      },
    ],
  },
  {
    heading: "Community",
    links: [
      { label: "Discord", href: "https://discord.gg/xmtp", external: true },
      {
        label: "XMTP Community",
        href: "https://community.xmtp.org/",
        external: true,
      },
      { label: "Ramestta", href: "https://www.ramestta.com/", external: true },
    ],
  },
];

const socialLinks = [
  { icon: "𝕏", href: "https://twitter.com/xmtp_", label: "Twitter" },
  { icon: "📱", href: "https://discord.gg/xmtp", label: "Discord" },
  { icon: "🐙", href: "https://github.com/xmtp", label: "GitHub" },
];

export const LandingFooter: FC = () => {
  return (
    <footer className={classes.footer}>
      <div className={classes.footerGlow} />
      <div className={classes.footerContent}>
        <div className={classes.footerTop}>
          <div className={classes.footerBrand}>
            <Link to="/" className={classes.footerLogo}>
              <MumbleChatLogo className={classes.footerLogoIcon} />
              <span>
                Mumble<span className={classes.brandAccent}>Chat</span>
              </span>
            </Link>
            <p className={classes.footerTagline}>
              Institutional-grade decentralized messaging powered by Ramestta
              Layer-3 blockchain.
            </p>
            <div className={classes.footerSocials}>
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={classes.socialLink}
                  aria-label={social.label}>
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          <div className={classes.footerMenus}>
            {footerMenus.map((menu) => (
              <div key={menu.heading} className={classes.footerMenu}>
                <h4>{menu.heading}</h4>
                <ul>
                  {menu.links.map((link) => (
                    <li key={link.label}>
                      {"external" in link && link.external ? (
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer">
                          {link.label}
                          <svg
                            width="10"
                            height="10"
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
                        <Link to={link.href}>{link.label}</Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className={classes.footerDivider} />

        <div className={classes.footerBottom}>
          <p className={classes.footerCopyright}>
            © {new Date().getFullYear()} MumbleChat. Built on{" "}
            <a
              href="https://xmtp.org"
              target="_blank"
              rel="noopener noreferrer">
              XMTP
            </a>{" "}
            &{" "}
            <a
              href="https://ramestta.com"
              target="_blank"
              rel="noopener noreferrer">
              Ramestta
            </a>
            .
          </p>
          <div className={classes.footerLinks}>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
