import { Group, NativeSelect, Stack, Text } from "@mantine/core";
import { type ClientOptions } from "@xmtp/browser-sdk";
import { useSettings } from "@/hooks/useSettings";

export const LoggingSelect: React.FC = () => {
  const { setLoggingLevel } = useSettings();

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setLoggingLevel(event.currentTarget.value as ClientOptions["loggingLevel"]);
  };

  return (
    <Stack gap="xs">
      <Group gap="xs" justify="space-between">
        <Text fw="bold" size="lg">
          Logging level
        </Text>
        <NativeSelect
          data={["warn"]}
          value="warn"
          onChange={handleChange}
          disabled
          styles={{
            input: {
              backgroundColor: "rgba(151, 114, 251, 0.05)",
              borderColor: "rgba(151, 114, 251, 0.2)",
              color: "rgba(226, 232, 240, 0.9)",
              cursor: "not-allowed",
            },
          }}
        />
      </Group>
      <Text size="sm" c="dimmed">
        Standard logging enabled for optimal performance
      </Text>
    </Stack>
  );
};
