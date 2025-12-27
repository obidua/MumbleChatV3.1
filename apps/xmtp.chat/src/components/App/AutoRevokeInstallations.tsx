import {
  Alert,
  Button,
  Group,
  Loader,
  Progress,
  Stack,
  Text,
} from "@mantine/core";
import {
  Client,
  Utils,
  type SafeInstallation,
  type Signer,
} from "@xmtp/browser-sdk";
import { useCallback, useState } from "react";
import { useSignMessage } from "wagmi";
import { createEOASigner, createSCWSigner } from "@/helpers/createSigner";
import { useConnectWallet } from "@/hooks/useConnectWallet";
import { useEphemeralSigner } from "@/hooks/useEphemeralSigner";
import { useSettings } from "@/hooks/useSettings";
import classes from "./AutoRevokeInstallations.module.css";

type RevokeStatus =
  | "idle"
  | "connecting"
  | "finding"
  | "revoking"
  | "success"
  | "error";

interface AutoRevokeInstallationsProps {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export const AutoRevokeInstallations: React.FC<
  AutoRevokeInstallationsProps
> = ({ onSuccess, onError }) => {
  const { account, address, isConnected } = useConnectWallet();
  const { address: ephemeralAddress, signer: ephemeralSigner } =
    useEphemeralSigner();
  const { signMessageAsync } = useSignMessage();
  const { environment, useSCW, ephemeralAccountEnabled } = useSettings();

  const [status, setStatus] = useState<RevokeStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");
  const [installations, setInstallations] = useState<SafeInstallation[]>([]);
  const [revokedCount, setRevokedCount] = useState(0);

  const currentAddress = ephemeralAccountEnabled ? ephemeralAddress : address;

  const handleAutoRevoke = useCallback(async () => {
    if (!currentAddress) {
      setStatus("error");
      setMessage("Please connect your wallet first");
      return;
    }

    try {
      // Step 1: Get inbox ID from address
      setStatus("finding");
      setProgress(20);
      setMessage("Finding your XMTP inbox...");

      const utils = new Utils();
      const inboxId = await utils.getInboxIdForIdentifier(
        {
          identifier: currentAddress.toLowerCase(),
          identifierKind: "Ethereum",
        },
        environment,
      );

      if (!inboxId) {
        throw new Error("Could not find XMTP inbox for this wallet");
      }

      // Step 2: Get all installations
      setProgress(40);
      setMessage("Finding installations...");

      const inboxState = await Client.inboxStateFromInboxIds(
        [inboxId],
        environment,
      );
      const allInstallations = inboxState[0]?.installations ?? [];

      if (allInstallations.length === 0) {
        throw new Error("No installations found for this wallet");
      }

      // Sort by timestamp (newest first)
      const sortedInstallations = allInstallations.sort(
        (a, b) =>
          Number(b.clientTimestampNs ?? 0) - Number(a.clientTimestampNs ?? 0),
      );

      setInstallations(sortedInstallations);

      // Keep the 2 most recent installations, revoke the rest
      const installationsToKeep = 2;
      const installationsToRevoke =
        sortedInstallations.slice(installationsToKeep);

      if (installationsToRevoke.length === 0) {
        setStatus("success");
        setProgress(100);
        setMessage(
          "You have fewer than 10 installations. No revocation needed!",
        );
        onSuccess?.();
        return;
      }

      // Step 3: Create signer
      setStatus("revoking");
      setProgress(60);
      setMessage(
        `Revoking ${installationsToRevoke.length} old installations...`,
      );

      let signer: Signer;
      if (ephemeralAccountEnabled) {
        signer = ephemeralSigner;
      } else {
        if (!address) {
          throw new Error("Wallet not connected");
        }
        signer = useSCW
          ? createSCWSigner(
              address,
              (message: string) => signMessageAsync({ message }),
              account.chainId,
            )
          : createEOASigner(address, (message: string) =>
              signMessageAsync({ message }),
            );
      }

      // Step 4: Revoke old installations
      const installationIds = installationsToRevoke.map((i) => i.bytes);

      await Client.revokeInstallations(
        signer,
        inboxId,
        installationIds,
        environment,
      );

      setRevokedCount(installationsToRevoke.length);
      setProgress(100);
      setStatus("success");
      setMessage(
        `Successfully revoked ${installationsToRevoke.length} old installations! You can now connect.`,
      );
      onSuccess?.();
    } catch (error) {
      console.error("Auto-revoke error:", error);
      setStatus("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "Failed to revoke installations",
      );
      onError?.(error instanceof Error ? error : new Error("Unknown error"));
    }
  }, [
    currentAddress,
    environment,
    ephemeralAccountEnabled,
    ephemeralSigner,
    address,
    useSCW,
    account.chainId,
    signMessageAsync,
    onSuccess,
    onError,
  ]);

  return (
    <Stack gap="md" className={classes.container}>
      {!isConnected && !ephemeralAccountEnabled ? (
        <Alert color="yellow" title="Wallet Required">
          <Text size="sm">
            Please connect your wallet to automatically revoke old
            installations.
          </Text>
        </Alert>
      ) : (
        <>
          {status === "idle" && (
            <Stack gap="sm">
              <Text size="sm" c="dimmed">
                Click the button below to automatically find and revoke your
                oldest XMTP installations, keeping only the 2 most recent ones.
              </Text>
              <Button
                size="lg"
                fullWidth
                color="yellow"
                onClick={() => {
                  void handleAutoRevoke();
                }}
                className={classes.mainButton}>
                🔄 Auto-Fix: Revoke Old Installations
              </Button>
              <Text size="xs" c="dimmed" ta="center">
                This will require signing a message with your wallet
              </Text>
            </Stack>
          )}

          {(status === "finding" ||
            status === "revoking" ||
            status === "connecting") && (
            <Stack gap="md" align="center">
              <Loader size="lg" color="blue" />
              <Progress
                value={progress}
                size="lg"
                color="blue"
                w="100%"
                animated
              />
              <Text size="sm" ta="center">
                {message}
              </Text>
            </Stack>
          )}

          {status === "success" && (
            <Alert color="green" title="Success!">
              <Stack gap="xs">
                <Text size="sm">{message}</Text>
                {revokedCount > 0 && (
                  <Text size="xs" c="dimmed">
                    Kept: {installations.length - revokedCount} installation(s)
                    | Revoked: {revokedCount} installation(s)
                  </Text>
                )}
                <Button
                  mt="sm"
                  color="green"
                  onClick={() => {
                    window.location.reload();
                  }}>
                  Try Connecting Again
                </Button>
              </Stack>
            </Alert>
          )}

          {status === "error" && (
            <Alert color="red" title="Error">
              <Stack gap="xs">
                <Text size="sm">{message}</Text>
                <Group gap="sm" mt="sm">
                  <Button
                    variant="light"
                    color="red"
                    onClick={() => {
                      setStatus("idle");
                      setProgress(0);
                      setMessage("");
                    }}>
                    Try Again
                  </Button>
                </Group>
              </Stack>
            </Alert>
          )}
        </>
      )}
    </Stack>
  );
};
