import { ActionIcon, Menu } from "@mantine/core";
import { useCallback } from "react";
import { useNavigate } from "react-router";
import { useRedirect } from "@/hooks/useRedirect";
import { IconDots } from "@/icons/IconDots";

export const AppMenu: React.FC = () => {
  const navigate = useNavigate();
  const { setRedirectUrl } = useRedirect();

  const handleDisconnect = useCallback(() => {
    setRedirectUrl(`${location.pathname}${location.search}`);
    void navigate("/disconnect");
  }, [navigate, setRedirectUrl]);

  return (
    <Menu shadow="md" position="bottom-end">
      <Menu.Target>
        <ActionIcon
          variant="light"
          radius="xl"
          size="lg"
          style={{
            background:
              "linear-gradient(130deg, rgba(10, 255, 241, 0.16), rgba(151, 114, 251, 0.24))",
            border: "1px solid rgba(10, 255, 241, 0.25)",
            color: "var(--mantine-color-gray-0)",
            boxShadow: "0 14px 26px rgba(10, 255, 241, 0.18)",
          }}>
          <IconDots />
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown miw={200}>
        <Menu.Label>Actions</Menu.Label>
        <Menu.Item onClick={() => void navigate("new-dm")}>
          New direct message
        </Menu.Item>
        <Menu.Item onClick={() => void navigate("new-group")}>
          New group
        </Menu.Item>
        <Menu.Item onClick={handleDisconnect}>Disconnect</Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};
