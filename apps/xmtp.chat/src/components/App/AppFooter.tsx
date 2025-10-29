import { Stack, Text } from "@mantine/core";

export const AppFooter: React.FC = () => {
  return (
    <Stack
      align="center"
      gap={6}
      px="md"
      py="lg"
      style={{
        width: "100%",
        borderRadius: "18px",
        background:
          "linear-gradient(135deg, rgba(10, 255, 241, 0.12), rgba(151, 114, 251, 0.16))",
      }}>
      <Text
        fw={700}
        size="sm"
        style={{
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "var(--mantine-color-teal-3)",
        }}>
        MumbleChat • Ramestta
      </Text>
      <Text size="xs" c="dimmed" ta="center">
        © {new Date().getFullYear()} MumbleChat. Secure, decentralized messaging for communities
        building on Ramestta.
      </Text>
    </Stack>
  );
};
