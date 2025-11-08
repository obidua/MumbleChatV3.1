import { Button, Modal as MantineModal, Stack, Text } from "@mantine/core";
import { Html5Qrcode } from "html5-qrcode";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import classes from "./QRScannerModal.module.css";

interface QRScannerModalProps {
  opened: boolean;
  onClose: () => void;
  onScan?: (address: string) => void;
}

export const QRScannerModal: React.FC<QRScannerModalProps> = ({
  opened,
  onClose,
  onScan,
}) => {
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const scannerIdRef = useRef(
    "qr-scanner-" + Math.random().toString(36).substr(2, 9),
  );
  const navigate = useNavigate();

  const handleClose = useCallback(() => {
    if (scannerRef.current && scanning) {
      scannerRef.current
        .stop()
        .then(() => {
          scannerRef.current?.clear();
          scannerRef.current = null;
        })
        .catch((err) => {
          console.error("Error stopping scanner:", err);
        });
    }
    setScanning(false);
    setError(null);
    onClose();
  }, [onClose, scanning]);

  const startScanning = useCallback(async () => {
    setError(null);
    try {
      // First check if camera permission is granted
      if (navigator.permissions) {
        try {
          const permissionStatus = await navigator.permissions.query({
            name: "camera" as PermissionName,
          });

          if (permissionStatus.state === "denied") {
            setError(
              "Camera access denied. Please enable camera permissions in your browser settings.",
            );
            return;
          }
        } catch (permErr) {
          // Some browsers don't support permissions.query for camera
          console.log("Permission query not supported:", permErr);
        }
      }

      // Request camera access
      const html5QrCode = new Html5Qrcode(scannerIdRef.current);
      scannerRef.current = html5QrCode;

      await html5QrCode.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          // Successfully scanned
          handleClose();

          // Check if it's a DM link (e.g., https://example.com/dm/0x123... or /dm/0x123...)
          const dmLinkMatch = decodedText.match(/\/dm\/([a-zA-Z0-9]+)/);

          if (dmLinkMatch) {
            // It's a direct DM link - navigate to it
            const address = dmLinkMatch[1];
            void navigate(`/dm/${address}`);
          } else if (onScan) {
            // It's just an address - pass it to the callback
            onScan(decodedText);
          } else {
            // No callback provided, treat as DM link
            void navigate(`/dm/${decodedText}`);
          }
        },
        (errorMessage) => {
          // Scanning errors (can be ignored as they're frequent)
          // console.log("Scan error:", errorMessage);
        },
      );
      setScanning(true);
    } catch (err: unknown) {
      console.error("Error starting scanner:", err);

      const errorMessage = err instanceof Error ? err.message : String(err);

      if (
        errorMessage.includes("Permission") ||
        errorMessage.includes("permission") ||
        errorMessage.includes("NotAllowedError") ||
        errorMessage.includes("denied")
      ) {
        setError(
          "Camera access denied. Please allow camera access when prompted by your browser.",
        );
      } else if (
        errorMessage.includes("NotFoundError") ||
        errorMessage.includes("not found")
      ) {
        setError("No camera found on this device.");
      } else if (
        errorMessage.includes("NotReadableError") ||
        errorMessage.includes("in use")
      ) {
        setError("Camera is already in use by another application.");
      } else {
        setError(
          "Unable to access camera. Please ensure camera permissions are granted and try again.",
        );
      }
    }
  }, [onScan, handleClose, navigate]);

  useEffect(() => {
    if (opened && !scanning) {
      void startScanning();
    }

    return () => {
      if (scannerRef.current && scanning) {
        scannerRef.current
          .stop()
          .then(() => {
            scannerRef.current?.clear();
            scannerRef.current = null;
          })
          .catch((err) => {
            console.error("Error cleaning up scanner:", err);
          });
      }
    };
  }, [opened, scanning, startScanning]);

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
      <div className={classes.scannerContainer}>
        <div className={classes.scannerContent}>
          <div className={classes.scannerHeader}>
            <svg
              className={classes.scannerIcon}
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
              <Text className={classes.scannerTitle}>Scan QR Code</Text>
              <Text className={classes.scannerSubtitle}>
                Scan to open chat or enter address
              </Text>
            </div>
          </div>

          <div className={classes.scannerWrapper}>
            <div id={scannerIdRef.current} className={classes.scannerBox} />
            {error && (
              <div className={classes.errorBox}>
                <svg
                  width="20"
                  height="20"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <Text size="sm">{error}</Text>
                <Button
                  size="xs"
                  variant="light"
                  onClick={() => void startScanning()}
                  mt="xs">
                  Try Again
                </Button>
              </div>
            )}
          </div>

          <Stack gap="sm">
            <Text className={classes.instructions} ta="center">
              Position the QR code within the frame. The scan will happen
              automatically.
            </Text>
            <Button
              fullWidth
              size="lg"
              variant="light"
              onClick={handleClose}
              className={classes.cancelButton}>
              Cancel
            </Button>
          </Stack>
        </div>
      </div>
    </MantineModal>
  );
};
