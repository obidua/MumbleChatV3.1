import { Navigate, Route, Routes } from "react-router";
import { AppLayout } from "@/components/App/AppLayout";
import { BasicLayout } from "@/components/App/BasicLayout";
import { Disconnect } from "@/components/App/Disconnect";
import { ErrorModal } from "@/components/App/ErrorModal";
import { SelectConversation } from "@/components/App/SelectConversation";
import { Welcome } from "@/components/App/Welcome";
import { LoadConversation } from "@/components/Conversation/LoadConversation";
import { LoadDM } from "@/components/Conversation/LoadDM";
import { ManageConsentModal } from "@/components/Conversation/ManageConsentModal";
import { ManageMembersModal } from "@/components/Conversation/ManageMembersModal";
import { ManageMetadataModal } from "@/components/Conversation/ManageMetadataModal";
import { ManagePermissionsModal } from "@/components/Conversation/ManagePermissionsModal";
import { CreateDmModal } from "@/components/Conversations/CreateDmModal";
import { CreateGroupModal } from "@/components/Conversations/CreateGroupModal";
import { HelpModal } from "@/components/Identity/HelpModal";
import { IdentityModal } from "@/components/Identity/IdentityModal";
import { InboxTools } from "@/components/InboxTools/InboxTools";
import { InboxToolsLayout } from "@/components/InboxTools/InboxToolsLayout";
import { MumbleLanding } from "@/components/Landing/MumbleLanding";
import { MessageModal } from "@/components/Messages/MessageModal";
import { InstallPrompt } from "@/components/PWA/InstallPrompt";
import { IOSInstallPrompt } from "@/components/PWA/IOSInstallPrompt";
import { useAnalytics } from "@/hooks/useAnalytics";

export const App: React.FC = () => {
  useAnalytics();

  return (
    <>
      <ErrorModal />
      <InstallPrompt />
      <IOSInstallPrompt />
      <Routes>
        <Route path="/" element={<MumbleLanding />} />
        <Route path="/welcome/*" element={<BasicLayout />}>
          <Route index element={<Welcome />} />
        </Route>
        <Route path="/inbox-tools/*" element={<InboxToolsLayout />}>
          <Route index element={<InboxTools />} />
        </Route>
        <Route element={<AppLayout />}>
          <Route path="/dm/:address" element={<LoadDM />} />
          <Route path="/conversations">
            <Route index element={<SelectConversation />} />
            <Route path="new-dm" element={<CreateDmModal />} />
            <Route path="new-group" element={<CreateGroupModal />} />
            <Route path="identity" element={<IdentityModal />}>
              <Route path="help" element={<HelpModal />} />
            </Route>
            <Route path=":conversationId" element={<LoadConversation />}>
              <Route path="new-dm" element={<CreateDmModal />} />
              <Route path="new-group" element={<CreateGroupModal />} />
              <Route path="identity" element={<IdentityModal />}>
                <Route path="help" element={<HelpModal />} />
              </Route>
              <Route path="message/:messageId" element={<MessageModal />} />
              <Route path="manage">
                <Route path="consent" element={<ManageConsentModal />} />
                <Route path="members" element={<ManageMembersModal />} />
                <Route
                  path="permissions"
                  element={<ManagePermissionsModal />}
                />
                <Route path="metadata" element={<ManageMetadataModal />} />
              </Route>
            </Route>
          </Route>
          <Route path="/disconnect" element={<Disconnect />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};
