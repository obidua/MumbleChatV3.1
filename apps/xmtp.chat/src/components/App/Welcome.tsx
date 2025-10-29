import { Paper, Stack, Text, useMatches } from "@mantine/core";
import { Connect } from "@/components/App/Connect";

export const Welcome = () => {
  const px = useMatches({
    base: "6%",
    sm: "10%",
    md: "18%",
  });

  return (
    <Stack
      gap="xl"
      py={48}
      px={px}
      style={{
        maxWidth: 940,
        width: "100%",
        margin: "0 auto",
      }}
      align="center"
      justify="center">
      <Paper
        withBorder
        radius="xl"
        shadow="sm"
        p={{ base: "lg", sm: "xl" }}
        style={{ background: "rgba(10, 13, 25, 0.9)" }}>
        <Stack gap="lg">
          <Stack gap={6}>
            <Text fw={600} size="sm" c="var(--mantine-color-teal-3)">
              Connect your wallet
            </Text>
            <Text c="dimmed" size="sm">
              Authorize your wallet to unlock the MumbleChat toolkit.
            </Text>
          </Stack>
          <Connect />
          <Text size="xs" c="dimmed" ta="center">
            By connecting, you agree to the MumbleChat Terms of Service and Privacy Policy.
          </Text>
        </Stack>
      </Paper>
    </Stack>
  );
};
