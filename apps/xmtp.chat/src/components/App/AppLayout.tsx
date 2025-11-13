import { LoadingOverlay } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";
import { AppHeader } from "@/components/App/AppHeader";
import { ConversationsNavbar } from "@/components/Conversations/ConversationsNavbar";
import { BottomNav } from "@/components/Navigation/BottomNav";
import { useXMTP } from "@/contexts/XMTPContext";
import { useCollapsedMediaQuery } from "@/hooks/useCollapsedMediaQuery";
import { useMobile } from "@/hooks/useMobile";
import { useRedirect } from "@/hooks/useRedirect";
import { CenteredLayout } from "@/layouts/CenteredLayout";
import {
  MainLayout,
  MainLayoutContent,
  MainLayoutHeader,
  MainLayoutNav,
} from "@/layouts/MainLayout";

export const AppLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { client } = useXMTP();
  const { setRedirectUrl } = useRedirect();
  const [opened, { toggle, close }] = useDisclosure();
  const isCollapsed = useCollapsedMediaQuery();
  const isMobile = useMobile();

  // Debug log for mobile detection
  useEffect(() => {
    console.log("[AppLayout] isMobile:", isMobile);
    console.log("[AppLayout] isCollapsed:", isCollapsed);
    console.log("[AppLayout] window.innerWidth:", window.innerWidth);
    console.log("[AppLayout] location.pathname:", location.pathname);
  }, [isMobile, isCollapsed, location.pathname]);

  const handleConversationSelected = () => {
    if (isCollapsed) {
      close();
    }
  };

  useEffect(() => {
    if (!client) {
      // save the current path to redirect to it after the client is initialized
      // but exclude welcome, disconnect, and modal routes (new-dm, new-group, identity)
      if (
        location.pathname !== "/welcome" &&
        location.pathname !== "/disconnect" &&
        location.pathname !== "/conversations/new-dm" &&
        location.pathname !== "/conversations/new-group" &&
        location.pathname !== "/conversations/identity" &&
        !location.pathname.includes("/conversations/identity/")
      ) {
        setRedirectUrl(`${location.pathname}${location.search}`);
      }
      void navigate("/welcome");
    }
  }, [client]);

  // Check if we're in a conversation view (for mobile full-screen behavior)
  // Exclude modal routes that should show the bottom nav
  const isInConversation =
    location.pathname.startsWith("/conversations/") &&
    location.pathname !== "/conversations" &&
    location.pathname !== "/conversations/new-dm" &&
    location.pathname !== "/conversations/new-group" &&
    location.pathname !== "/conversations/identity" &&
    !location.pathname.includes("/conversations/identity/") &&
    !location.pathname.includes("/new-dm") &&
    !location.pathname.includes("/new-group") &&
    !location.pathname.includes("/identity");

  return !client ? (
    <CenteredLayout fullScreen>
      <LoadingOverlay visible />
    </CenteredLayout>
  ) : (
    <MainLayout>
      {(!isMobile || !isInConversation) && (
        <MainLayoutHeader>
          <AppHeader client={client} opened={opened} toggle={toggle} />
        </MainLayoutHeader>
      )}
      {!isMobile && (
        <MainLayoutNav opened={opened} toggle={toggle}>
          <ConversationsNavbar
            onConversationSelected={handleConversationSelected}
          />
        </MainLayoutNav>
      )}
      <MainLayoutContent>
        <Outlet />
      </MainLayoutContent>
      {isMobile && <BottomNav />}
    </MainLayout>
  );
};
