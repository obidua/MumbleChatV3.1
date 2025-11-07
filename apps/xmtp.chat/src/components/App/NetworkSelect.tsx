import { Group, NativeSelect, Stack, Text, Tooltip } from "@mantine/core";
import { ApiUrls, type XmtpEnv } from "@xmtp/browser-sdk";
import { useSettings } from "@/hooks/useSettings";

export const NetworkSelect: React.FC = () => {
  const { setEnvironment } = useSettings();

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setEnvironment(event.currentTarget.value as XmtpEnv);
  };

  return (
    <Stack gap="xs">
      <Group gap="xs" justify="space-between">
        <Text fw="bold" size="lg">
          Network
        </Text>
        <Tooltip
          label={ApiUrls["production"]}
          withArrow
          events={{ hover: true, focus: true, touch: true }}>
          <NativeSelect
            data={["production"]}
            value="production"
            onChange={handleChange}
            disabled
            styles={{
              input: {
                backgroundColor: "rgba(10, 255, 241, 0.05)",
                borderColor: "rgba(10, 255, 241, 0.2)",
                color: "rgba(226, 232, 240, 0.9)",
                cursor: "not-allowed",
              },
            }}
          />
        </Tooltip>
      </Group>
      <Text size="sm" c="dimmed">
        Connected to Ramestta production network
      </Text>
    </Stack>
  );
};
