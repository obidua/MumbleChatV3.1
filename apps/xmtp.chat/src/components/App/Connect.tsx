import { Stepper } from "@mantine/core";
import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { ConnectXMTP } from "@/components/App/ConnectXMTP";
import { WalletConnect } from "@/components/App/WalletConnect";
import { useXMTP } from "@/contexts/XMTPContext";
import { useConnectWallet } from "@/hooks/useConnectWallet";
import { useRedirect } from "@/hooks/useRedirect";
import { useSettings } from "@/hooks/useSettings";
import classes from "./Connect.module.css";

export const Connect = () => {
  const { isConnected, disconnect, loading } = useConnectWallet();
  const {
    ephemeralAccountEnabled,
    setEphemeralAccountEnabled,
    setEphemeralAccountKey,
    setAutoConnect,
  } = useSettings();
  const { client } = useXMTP();
  const navigate = useNavigate();
  const location = useLocation();
  const { redirectUrl, setRedirectUrl } = useRedirect();
  const [active, setActive] = useState(0);

  // redirect if there's already a client
  useEffect(() => {
    if (!client) {
      return;
    }
    if (redirectUrl) {
      setRedirectUrl("");
      void navigate(redirectUrl);
      return;
    }
    if (location.pathname === "/welcome") {
      void navigate("/conversations");
    }
  }, [client, redirectUrl, location.pathname, navigate, setRedirectUrl]);

  useEffect(() => {
    if (isConnected || ephemeralAccountEnabled) {
      setActive(1);
    } else {
      setActive(0);
    }
  }, [isConnected, ephemeralAccountEnabled]);

  const handleDisconnectWallet = useCallback(() => {
    if (isConnected) {
      disconnect();
    } else {
      setEphemeralAccountEnabled(false);
      setEphemeralAccountKey(null);
    }
    setAutoConnect(false);
  }, [
    isConnected,
    disconnect,
    setEphemeralAccountEnabled,
    setEphemeralAccountKey,
    setAutoConnect,
  ]);

  return (
    <Stepper
      active={active}
      onStepClick={setActive}
      classNames={{
        root: classes.stepper,
        step: classes.step,
        stepIcon: classes.stepIcon,
        stepCompletedIcon: classes.stepCompletedIcon,
        stepBody: classes.stepBody,
        stepLabel: classes.stepLabel,
        stepDescription: classes.stepDescription,
        separator: classes.separator,
      }}>
      <Stepper.Step
        label="Connect Wallet"
        description="Choose your wallet provider"
        allowStepSelect={false}
        loading={loading}>
        <WalletConnect />
      </Stepper.Step>
      <Stepper.Step
        label="Connect to MumbleChat"
        description="Setup secure messaging"
        allowStepSelect={false}>
        <ConnectXMTP onDisconnectWallet={handleDisconnectWallet} />
      </Stepper.Step>
    </Stepper>
  );
};
