import { useEffect, useState, type FC } from "react";
import { Link, useLocation } from "react-router";
import { MumbleChatLogo } from "@/icons/MumbleChatLogo";
import classes from "../LandingPages.module.css";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Features", href: "/features" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "Security", href: "/security" },
  { label: "Mobile", href: "/mobile" },
  { label: "FAQs", href: "/faqs" },
  { label: "Support", href: "/support" },
];

export const LandingNavbar: FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

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

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  const isActive = (href: string) => {
    if (href === "/") {
      return location.pathname === "/";
    }
    return location.pathname === href;
  };

  return (
    <header
      className={`${classes.navbar} ${scrolled ? classes.navbarScrolled : ""}`}>
      <div className={classes.navContainer}>
        <Link className={classes.brand} to="/">
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
        </Link>

        <nav className={classes.navLinks}>
          {navLinks.map(({ label, href }) => (
            <Link
              key={label}
              to={href}
              className={`${classes.navLink} ${isActive(href) ? classes.navLinkActive : ""}`}>
              {label}
            </Link>
          ))}
        </nav>

        <div className={classes.navActions}>
          <a className={classes.primaryButton} href="/welcome">
            <span className={classes.buttonText}>Launch App</span>
          </a>
          <button
            type="button"
            className={`${classes.menuButton} ${menuOpen ? classes.menuButtonOpen : ""}`}
            aria-expanded={menuOpen}
            onClick={() => {
              setMenuOpen((v) => !v);
            }}>
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className={classes.mobileNav}>
          {navLinks.map(({ label, href }) => (
            <Link
              key={label}
              to={href}
              className={`${classes.mobileNavLink} ${isActive(href) ? classes.mobileNavLinkActive : ""}`}>
              {label}
            </Link>
          ))}
          <a className={classes.mobilePrimaryButton} href="/welcome">
            Launch App
          </a>
        </nav>
      )}
    </header>
  );
};
