import {
  Client,
  type ClientOptions,
  type ExtractCodecContentTypes,
  type Signer,
} from "@xmtp/browser-sdk";
import { MarkdownCodec } from "@xmtp/content-type-markdown";
import { ReactionCodec } from "@xmtp/content-type-reaction";
import { ReadReceiptCodec } from "@xmtp/content-type-read-receipt";
import { RemoteAttachmentCodec } from "@xmtp/content-type-remote-attachment";
import { ReplyCodec } from "@xmtp/content-type-reply";
import { TransactionReferenceCodec } from "@xmtp/content-type-transaction-reference";
import { WalletSendCallsCodec } from "@xmtp/content-type-wallet-send-calls";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import { ActionsCodec } from "@/content-types/Actions";
import { IntentCodec } from "@/content-types/Intent";
import { useActions } from "@/stores/inbox/hooks";

export type ContentTypes = ExtractCodecContentTypes<
  [
    ReactionCodec,
    ReplyCodec,
    RemoteAttachmentCodec,
    TransactionReferenceCodec,
    WalletSendCallsCodec,
    ReadReceiptCodec,
    ActionsCodec,
    IntentCodec,
    MarkdownCodec,
  ]
>;

export type InitializeClientOptions = {
  dbEncryptionKey?: Uint8Array;
  env?: ClientOptions["env"];
  loggingLevel?: ClientOptions["loggingLevel"];
  signer: Signer;
  // If true, skip auto-registration (used for already registered wallets)
  disableAutoRegister?: boolean;
};

export type XMTPContextValue = {
  /**
   * The XMTP client instance
   */
  client?: Client<ContentTypes>;
  /**
   * Set the XMTP client instance
   */
  setClient: React.Dispatch<
    React.SetStateAction<Client<ContentTypes> | undefined>
  >;
  initialize: (
    options: InitializeClientOptions,
  ) => Promise<Client<ContentTypes> | undefined>;
  initializing: boolean;
  error: Error | null;
  disconnect: () => void;
};

export const XMTPContext = createContext<XMTPContextValue>({
  setClient: () => {},
  initialize: () => Promise.reject(new Error("XMTPProvider not available")),
  initializing: false,
  error: null,
  disconnect: () => {},
});

export type XMTPProviderProps = React.PropsWithChildren & {
  /**
   * Initial XMTP client instance
   */
  client?: Client<ContentTypes>;
};

export const XMTPProvider: React.FC<XMTPProviderProps> = ({
  children,
  client: initialClient,
}) => {
  const { reset } = useActions();
  const [client, setClient] = useState<Client<ContentTypes> | undefined>(
    initialClient,
  );

  const [initializing, setInitializing] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  // client is initializing
  const initializingRef = useRef(false);

  /**
   * Initialize an XMTP client
   */
  const initialize = useCallback(
    async ({
      dbEncryptionKey,
      env,
      loggingLevel,
      signer,
      disableAutoRegister,
    }: InitializeClientOptions) => {
      // only initialize a client if one doesn't already exist
      if (!client) {
        // if the client is already initializing, don't do anything
        if (initializingRef.current) {
          return undefined;
        }

        // flag the client as initializing
        initializingRef.current = true;

        // reset error state
        setError(null);
        // reset initializing state
        setInitializing(true);

        let xmtpClient: Client<ContentTypes>;

        try {
          // create a new XMTP client
          // Use disableAutoRegister to prevent creating new installations for already registered wallets
          xmtpClient = await Client.create(signer, {
            env,
            loggingLevel,
            dbEncryptionKey,
            appVersion: "xmtp.chat/0",
            disableAutoRegister: disableAutoRegister ?? false,
            codecs: [
              new ReactionCodec(),
              new ReplyCodec(),
              new RemoteAttachmentCodec(),
              new TransactionReferenceCodec(),
              new WalletSendCallsCodec(),
              new ReadReceiptCodec(),
              new ActionsCodec(),
              new IntentCodec(),
              new MarkdownCodec(),
            ],
          });

          // If we disabled auto-register, check if registration is needed
          // Do this AFTER setting the client to not block the UI
          if (disableAutoRegister) {
            // Set client first for faster UI response
            setClient(xmtpClient);
            
            // Then check registration in background
            xmtpClient.isRegistered().then((isRegistered) => {
              if (!isRegistered) {
                // Wallet was marked as registered but actually isn't - register now
                console.log("XMTP: Client not registered, registering now...");
                return xmtpClient.register();
              } else {
                console.log("XMTP: Reusing existing installation (no new registration needed)");
              }
            }).catch((regError) => {
              console.error("XMTP: Registration check failed:", regError);
              
              // Check for RamaPay-specific private key error
              const errorMessage = regError?.message || regError?.toString() || "";
              if (errorMessage.includes("invalid private key") || 
                  errorMessage.includes("RamaPayProvider")) {
                const ramaPayError = new Error(
                  "RamaPay wallet signing failed. This is a known issue with the RamaPay extension. Please try using MetaMask or WalletConnect instead, or contact RamaPay support to fix their signing implementation."
                );
                setError(ramaPayError);
              }
            });
          } else {
            setClient(xmtpClient);
          }
        } catch (e) {
          const error = e as Error;
          const errorMessage = error.message || "";

          // Handle RamaPay wallet private key error
          if (errorMessage.includes("invalid private key") || 
              errorMessage.includes("RamaPayProvider")) {
            console.error(
              "XMTP: RamaPay wallet signing failed. This is a bug in the RamaPay extension.",
              error,
            );

            const ramaPayError = new Error(
              "RamaPay wallet signing failed. This is a known issue with the RamaPay browser extension - it returns an invalid private key when signing. Please try using MetaMask or WalletConnect instead, or contact RamaPay support.",
            );

            setClient(undefined);
            setError(ramaPayError);
            initializingRef.current = false;
            setInitializing(false);
            throw ramaPayError;
          }

          // Handle "Unknown signer" error - typically caused by SCW mode with unsupported chain
          if (errorMessage.includes("Unknown signer")) {
            console.error(
              "XMTP: Unknown signer error. This usually happens when using Smart Contract Wallet mode with an unsupported chain.",
              error,
            );

            const signerError = new Error(
              "Wallet signature verification failed. If you're using a Smart Contract Wallet, please try connecting with a standard wallet. For Ramestta chain, only EOA wallets are supported.",
            );

            setClient(undefined);
            setError(signerError);
            initializingRef.current = false;
            setInitializing(false);
            throw signerError;
          }

          // Handle "Multiple create operations detected" error
          if (error.message.includes("Multiple create operations detected")) {
            console.error(
              "XMTP identity already exists for this address. Please try reconnecting.",
            );
            // Note: Do NOT delete IndexedDB as it contains message history
          }

          // Handle installation limit error
          if (
            error.message.includes("already registered 10/10 installations")
          ) {
            console.error(
              "XMTP: Maximum installations reached (10/10). You need to revoke old installations.",
            );

            // Create a user-friendly error
            const installError = new Error(
              "Maximum XMTP installations (10/10) reached. Please revoke old installations before connecting again. Visit https://xmtp.chat to manage your installations.",
            );

            setClient(undefined);
            setError(installError);
            initializingRef.current = false;
            setInitializing(false);
            throw installError;
          }

          setClient(undefined);
          setError(error);
          // re-throw error for upstream consumption
          throw error;
        } finally {
          initializingRef.current = false;
          setInitializing(false);
        }

        return xmtpClient;
      }
      return client;
    },
    [client],
  );

  const disconnect = useCallback(() => {
    if (client) {
      client.close();
    }
    setClient(undefined);
    // Reset the inbox store to clear all conversations and messages
    reset();
  }, [client, reset]);

  // memo-ize the context value to prevent unnecessary re-renders
  const value = useMemo(
    () => ({
      client,
      setClient,
      initialize,
      initializing,
      error,
      disconnect,
    }),
    [client, initialize, initializing, error, disconnect],
  );

  return <XMTPContext.Provider value={value}>{children}</XMTPContext.Provider>;
};

export const useXMTP = () => {
  return useContext(XMTPContext);
};

export const useClient = () => {
  const { client } = useXMTP();
  if (!client) {
    throw new Error("useClient: XMTP client not initialized");
  }
  return client;
};
