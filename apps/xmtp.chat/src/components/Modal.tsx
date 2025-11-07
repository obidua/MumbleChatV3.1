import { Modal as MantineModal, type ModalProps } from "@mantine/core";

export const Modal: React.FC<ModalProps> = ({ children, ...props }) => {
  return (
    <MantineModal
      {...props}
      radius="md"
      styles={{
        content: {
          display: "flex",
          flexDirection: "column",
          background:
            "linear-gradient(180deg, rgba(6, 9, 20, 0.95), rgba(4, 7, 18, 0.98))",
          border: "1px solid rgba(10, 255, 241, 0.16)",
          boxShadow:
            "0 32px 64px rgba(4, 8, 20, 0.7), 0 0 80px rgba(10, 255, 241, 0.08)",
          backdropFilter: "blur(20px)",
        },
        body: {
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
        },
        header: {
          background: "transparent",
          borderBottom: "1px solid rgba(10, 255, 241, 0.12)",
        },
        title: {
          color: "#0afff1",
          fontWeight: 700,
          fontSize: "1.1rem",
        },
        close: {
          color: "rgba(10, 255, 241, 0.7)",
          transition: "all 0.2s ease",
          "&:hover": {
            background: "rgba(10, 255, 241, 0.12)",
            color: "#0afff1",
          },
        },
        overlay: {
          backdropFilter: "blur(8px)",
          background: "rgba(4, 6, 15, 0.75)",
        },
      }}>
      {children}
    </MantineModal>
  );
};
