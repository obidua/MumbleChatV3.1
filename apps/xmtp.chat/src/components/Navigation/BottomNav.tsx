import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router";
import { IconHome } from "@/icons/IconHome";
import { IconMessage } from "@/icons/IconMessage";
import { IconSettings } from "@/icons/IconSettings";
import { IconUser } from "@/icons/IconUser";
import classes from "./BottomNav.module.css";

export type BottomNavProps = {
  unreadCount?: number;
};

export const BottomNav: React.FC<BottomNavProps> = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === "/conversations") {
      return (
        location.pathname === "/conversations" ||
        (location.pathname.startsWith("/conversations/") &&
          !location.pathname.includes("/new-dm") &&
          !location.pathname.includes("/new-group") &&
          !location.pathname.includes("/identity"))
      );
    }
    if (path === "/conversations/new-dm") {
      return location.pathname.includes("/new-dm");
    }
    if (path === "/conversations/new-group") {
      return location.pathname.includes("/new-group");
    }
    if (path === "/conversations/identity") {
      return location.pathname.includes("/identity");
    }
    return location.pathname === path;
  };

  // Use useCallback to prevent re-creation on each render
  const handleNavigation = useCallback(
    (path: string) => (e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault();
      e.stopPropagation();

      // Use setTimeout to ensure the navigation happens after touch events complete on iOS
      setTimeout(() => {
        void navigate(path);
      }, 0);
    },
    [navigate],
  );

  return (
    <nav className={classes.bottomNav}>
      <button
        type="button"
        className={`${classes.navItem} ${isActive("/conversations") ? classes.active : ""}`}
        onClick={handleNavigation("/conversations")}
        onTouchEnd={handleNavigation("/conversations")}
        aria-label="Conversations">
        <IconHome className={classes.navIcon} />
        <span className={classes.navLabel}>Chats</span>
      </button>

      <button
        type="button"
        className={`${classes.navItem} ${isActive("/conversations/new-dm") ? classes.active : ""}`}
        onClick={handleNavigation("/conversations/new-dm")}
        onTouchEnd={handleNavigation("/conversations/new-dm")}
        aria-label="New Message">
        <IconMessage className={classes.navIcon} />
        <span className={classes.navLabel}>New</span>
      </button>

      <button
        type="button"
        className={`${classes.navItem} ${isActive("/conversations/new-group") ? classes.active : ""}`}
        onClick={handleNavigation("/conversations/new-group")}
        onTouchEnd={handleNavigation("/conversations/new-group")}
        aria-label="New Group">
        <IconUser className={classes.navIcon} />
        <span className={classes.navLabel}>Group</span>
      </button>

      <button
        type="button"
        className={`${classes.navItem} ${isActive("/conversations/identity") ? classes.active : ""}`}
        onClick={handleNavigation("/conversations/identity")}
        onTouchEnd={handleNavigation("/conversations/identity")}
        aria-label="Profile">
        <IconSettings className={classes.navIcon} />
        <span className={classes.navLabel}>Profile</span>
      </button>
    </nav>
  );
};
