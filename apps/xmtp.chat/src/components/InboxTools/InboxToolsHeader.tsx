import { Button, Group } from "@mantine/core";
import { useNavigate } from "react-router";

export const InboxToolsHeader: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Group align="center" flex={1} gap="md" justify="space-between">
      <Button
        variant="subtle"
        size="sm"
        onClick={() => {
          void navigate("/");
        }}
        styles={{
          root: {
            background: "rgba(0, 0, 0, 0.3)",
            border: "1px solid rgba(10, 255, 241, 0.2)",
            color: "#0aFFF1",
            fontWeight: 500,
            transition: "all 0.2s ease",
            "&:hover": {
              background: "rgba(10, 255, 241, 0.1)",
              borderColor: "rgba(10, 255, 241, 0.4)",
            },
          },
        }}>
        ← Back to messaging
      </Button>
    </Group>
  );
};
