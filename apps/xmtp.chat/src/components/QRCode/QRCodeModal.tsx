import { Button, Modal as MantineModal, Stack, Text } from "@mantine/core";
import { QRCodeSVG } from "qrcode.react";
import { useCallback, useMemo } from "react";
import classes from "./QRCodeModal.module.css";

interface QRCodeModalProps {
  opened: boolean;
  onClose: () => void;
  address: string;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({
  opened,
  onClose,
  address,
}) => {
  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  // Generate direct DM link
  const dmLink = useMemo(() => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/dm/${address}`;
  }, [address]);

  return (
    <MantineModal
      opened={opened}
      onClose={handleClose}
      centered
      size="auto"
      padding={0}
      withCloseButton={false}
      styles={{
        content: {
          background: "transparent",
          boxShadow: "none",
        },
        body: {
          padding: 0,
        },
      }}>
      <div className={classes.qrContainer}>
        <div className={classes.qrContent}>
          <div className={classes.qrHeader}>
            <svg
              className={classes.qrIcon}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M12 12h-4.01M12 12V8m0 4h4.01M12 12h-4.01M12 12v4m6-4h.01M12 12h.01M12 8h.01M12 8h4.01M12 8h-4.01M16 12h.01M8 12h.01"
              />
            </svg>
            <div>
              <Text className={classes.qrTitle}>Message Me Directly</Text>
              <Text className={classes.qrSubtitle}>
                Scan to open encrypted chat instantly
              </Text>
            </div>
          </div>

          <div className={classes.qrCodeWrapper}>
            <div className={classes.qrCodeInner}>
              <QRCodeSVG
                value={dmLink}
                size={280}
                level="H"
                includeMargin={false}
                style={{
                  background: "white",
                  padding: "16px",
                  borderRadius: "12px",
                }}
              />
            </div>
          </div>

          <div className={classes.addressDisplay}>
            <Text className={classes.addressLabel}>Direct Message Link</Text>
            <Text className={classes.addressValue}>{dmLink}</Text>
          </div>

          <Button
            fullWidth
            size="lg"
            variant="gradient"
            gradient={{ from: "#0afff1", to: "#9772fb", deg: 135 }}
            onClick={handleClose}
            className={classes.closeButton}>
            Close
          </Button>
        </div>
      </div>
    </MantineModal>
  );
};
