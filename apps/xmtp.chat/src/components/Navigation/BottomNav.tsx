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
        location.pathname.startsWith("/conversations/")
      );
    }
    return location.pathname === path;
  };

  const handleNavigation = (path: string) => {
    if (
      path === "/conversations" &&
      location.pathname.startsWith("/conversations/")
    ) {
      // If we're in a conversation, go back to the conversations list
      void navigate("/conversations");
    } else {
      void navigate(path);
    }
  };

  return (
    <nav className={classes.bottomNav}>
      <button
        className={`${classes.navItem} ${isActive("/conversations") ? classes.active : ""}`}
        onClick={() => {
          handleNavigation("/conversations");
        }}
        aria-label="Conversations">
        <IconHome className={classes.navIcon} />
        <span className={classes.navLabel}>Chats</span>
      </button>

      <button
        className={`${classes.navItem} ${isActive("/conversations/new-dm") ? classes.active : ""}`}
        onClick={() => {
          void navigate("/conversations/new-dm");
        }}
        aria-label="New Message">
        <IconMessage className={classes.navIcon} />
        <span className={classes.navLabel}>New</span>
      </button>

      <button
        className={`${classes.navItem} ${isActive("/conversations/new-group") ? classes.active : ""}`}
        onClick={() => {
          void navigate("/conversations/new-group");
        }}
        aria-label="New Group">
        <IconUser className={classes.navIcon} />
        <span className={classes.navLabel}>Group</span>
      </button>

      <button
        className={`${classes.navItem} ${isActive("/conversations/identity") ? classes.active : ""}`}
        onClick={() => {
          void navigate("/conversations/identity");
        }}
        aria-label="Profile">
        <IconSettings className={classes.navIcon} />
        <span className={classes.navLabel}>Profile</span>
      </button>
    </nav>
  );
};
