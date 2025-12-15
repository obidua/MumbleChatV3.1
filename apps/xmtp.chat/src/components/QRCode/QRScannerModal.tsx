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

// Detect if running in an in-app browser (WebView)
const isInAppBrowser = (): boolean => {
  const ua = navigator.userAgent || navigator.vendor || "";
  // Common in-app browser patterns
  return (
    /FBAN|FBAV|Instagram|Twitter|Line|Snapchat|WeChat|MicroMessenger|Ramapay|TrustWallet|MetaMask|Coinbase/i.test(
      ua,
    ) ||
    // Generic WebView detection
    /wv|WebView/i.test(ua) ||
    // Android WebView
    (/Android/i.test(ua) && /Version\/[\d.]+/i.test(ua) && !/Chrome/i.test(ua))
  );
};

// Request camera permission explicitly - crucial for in-app browsers
const requestCameraPermission = async (): Promise<MediaStream | null> => {
  try {
    // For in-app browsers, we need to explicitly request getUserMedia
    // This triggers the native permission dialog
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: "environment",
        width: { ideal: 1280 },
        height: { ideal: 720 },
      },
    });
    return stream;
  } catch (error) {
    console.error("Camera permission request failed:", error);
    return null;
  }
};

// Stop all tracks on a media stream
const stopMediaStream = (stream: MediaStream | null) => {
  if (stream) {
    stream.getTracks().forEach((track) => {
      track.stop();
    });
  }
};

export const QRScannerModal: React.FC<QRScannerModalProps> = ({
  opened,
  onClose,
  onScan,
}) => {
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [permissionRequested, setPermissionRequested] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const scannerIdRef = useRef(
    "qr-scanner-" + Math.random().toString(36).substr(2, 9),
  );
  const navigate = useNavigate();

  const handleClose = useCallback(() => {
    // Stop the scanner first
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
    // Also stop any media stream we opened
    stopMediaStream(mediaStreamRef.current);
    mediaStreamRef.current = null;
    setScanning(false);
    setError(null);
    setPermissionRequested(false);
    onClose();
  }, [onClose, scanning]);

  const startScanning = useCallback(async () => {
    setError(null);

    // Check if mediaDevices API is available
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError(
        "Camera access is not supported in this browser. Please try opening the app in a regular browser like Chrome or Safari.",
      );
      return;
    }

    try {
      const inAppBrowser = isInAppBrowser();

      // For in-app browsers, we need to explicitly request camera permission
      // This triggers the native permission dialog that WebViews require
      if (inAppBrowser || !permissionRequested) {
        console.log(
          "Requesting camera permission explicitly for in-app browser...",
        );

        // Request camera access first to trigger the permission dialog
        const stream = await requestCameraPermission();

        if (!stream) {
          setError(
            inAppBrowser
              ? "Camera access was not granted. Please:\n1. Check if Ramapay has camera permission in your device settings\n2. Go to Settings > Apps > Ramapay > Permissions > Camera\n3. Enable camera access and try again"
              : "Camera access denied. Please allow camera access when prompted.",
          );
          return;
        }

        // Store the stream reference so we can stop it later
        mediaStreamRef.current = stream;
        setPermissionRequested(true);

        // Stop the stream - html5-qrcode will request its own
        // But we needed this to trigger the permission dialog
        stopMediaStream(stream);
        mediaStreamRef.current = null;
      }

      // Now start the QR scanner
      const html5QrCode = new Html5Qrcode(scannerIdRef.current);
      scannerRef.current = html5QrCode;

      await html5QrCode.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          // Additional config for better in-app browser compatibility
          aspectRatio: 1.0,
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
        () => {
          // Scanning errors (can be ignored as they're frequent)
          // These are not actual errors, just frames without QR codes
        },
      );
      setScanning(true);
    } catch (err: unknown) {
      console.error("Error starting scanner:", err);

      const errorMessage = err instanceof Error ? err.message : String(err);
      const inAppBrowser = isInAppBrowser();

      if (
        errorMessage.includes("Permission") ||
        errorMessage.includes("permission") ||
        errorMessage.includes("NotAllowedError") ||
        errorMessage.includes("denied")
      ) {
        if (inAppBrowser) {
          setError(
            "Camera permission not granted. To fix this:\n\n" +
              "1. Go to your device Settings\n" +
              "2. Find Ramapay in Apps\n" +
              "3. Tap Permissions > Camera\n" +
              "4. Allow camera access\n" +
              "5. Return here and try again",
          );
        } else {
          setError(
            "Camera access denied. Please allow camera access when prompted by your browser.",
          );
        }
      } else if (
        errorMessage.includes("NotFoundError") ||
        errorMessage.includes("not found") ||
        errorMessage.includes("Requested device not found")
      ) {
        setError("No camera found on this device.");
      } else if (
        errorMessage.includes("NotReadableError") ||
        errorMessage.includes("in use") ||
        errorMessage.includes("Could not start video source")
      ) {
        setError(
          "Camera is already in use by another application. Please close other apps using the camera.",
        );
      } else if (errorMessage.includes("NotSupportedError")) {
        setError(
          "Camera access is not supported. Please try opening the app in a regular browser.",
        );
      } else if (
        errorMessage.includes("AbortError") ||
        errorMessage.includes("Starting video source failed")
      ) {
        setError(
          "Failed to start camera. Please try again or restart the app.",
        );
      } else {
        setError(
          inAppBrowser
            ? "Unable to access camera. Please check camera permissions in your device settings for Ramapay app."
            : "Unable to access camera. Please ensure camera permissions are granted and try again.",
        );
      }
    }
  }, [onScan, handleClose, navigate, permissionRequested]);

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
