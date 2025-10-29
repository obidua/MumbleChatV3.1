import {
  Box,
  Group,
  LoadingOverlay,
  ScrollArea,
  Stack,
  Text,
  type MantineStyleProps,
} from "@mantine/core";
import classes from "./ContentLayout.module.css";

export type ContentLayoutProps = React.PropsWithChildren<{
  aside?: React.ReactNode;
  asideOpened?: boolean;
  footer?: React.ReactNode;
  headerActions?: React.ReactNode;
  loading?: boolean;
  maxHeight?: MantineStyleProps["mah"];
  title?: React.ReactNode;
  withBorders?: boolean;
  withScrollArea?: boolean;
  withScrollAreaPadding?: boolean;
  withScrollFade?: boolean;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  footerClassName?: string;
  asideClassName?: string;
}>;

export type ContentLayoutHeaderProps = Pick<
  ContentLayoutProps,
  "title" | "headerActions" | "withBorders" | "headerClassName"
>;

export const ContentLayoutHeader: React.FC<ContentLayoutHeaderProps> = ({
  headerActions,
  title,
  withBorders,
  headerClassName,
}) => {
  const headerClassNames = [
    classes.header,
    withBorders && classes.withBorders,
    headerClassName,
  ].filter(Boolean);
  return (
    <Group
      align="center"
      gap="xs"
      p="md"
      wrap="nowrap"
      className={headerClassNames.join(" ")}>
      {typeof title === "string" ? (
        <Text fw={700} size="lg" truncate>
          {title}
        </Text>
      ) : (
        title
      )}
      {headerActions && (
        <Box className={classes.headerActions}>{headerActions}</Box>
      )}
    </Group>
  );
};

export type ContentLayoutContentProps = Pick<
  ContentLayoutProps,
  | "children"
  | "footer"
  | "maxHeight"
  | "withBorders"
  | "withScrollArea"
  | "withScrollAreaPadding"
  | "withScrollFade"
  | "className"
>;

export const ContentLayoutContent: React.FC<ContentLayoutContentProps> = ({
  children,
  footer,
  maxHeight,
  withBorders,
  withScrollArea,
  withScrollAreaPadding,
  withScrollFade,
  className,
}) => {
  const contentClassNames = [
    classes.content,
    withScrollFade && classes.contentScrollFade,
    !footer && classes.noFooter,
    withBorders && classes.withBorders,
    className,
  ].filter(Boolean);
  return (
    <Box className={contentClassNames.join(" ")}>
      {withScrollArea ? (
        <ScrollArea
          type="scroll"
          className={classes.scrollArea}
          px={withScrollAreaPadding ? "md" : 0}>
          <Box mah={maxHeight}>{children}</Box>
        </ScrollArea>
      ) : (
        <>{children}</>
      )}
    </Box>
  );
};

export type ContentLayoutFooterProps = Pick<
  ContentLayoutProps,
  "footer" | "withBorders" | "footerClassName"
>;

export const ContentLayoutFooter: React.FC<ContentLayoutFooterProps> = ({
  footer,
  withBorders,
  footerClassName,
}) => {
  const footerClassNames = [
    classes.footer,
    withBorders && classes.withBorders,
    footerClassName,
  ].filter(Boolean);
  return (
    <Group
      gap="xs"
      align="center"
      className={footerClassNames.join(" ")}
      wrap="nowrap">
      {footer}
    </Group>
  );
};

export const ContentLayout: React.FC<ContentLayoutProps> = ({
  aside,
  asideOpened,
  children,
  footer,
  headerActions,
  loading = false,
  maxHeight,
  title,
  withBorders = true,
  withScrollArea = true,
  withScrollAreaPadding = true,
  withScrollFade = true,
  className,
  headerClassName,
  contentClassName,
  footerClassName,
  asideClassName,
}) => {
  const rootClassNames = [classes.root, className].filter(Boolean);
  const asideClassNames = [
    classes.aside,
    asideOpened && classes.showAside,
    asideClassName,
  ].filter(Boolean);
  return (
    <Stack className={rootClassNames.join(" ")} gap={0}>
      <LoadingOverlay visible={loading} />
      {(title || headerActions) && (
        <ContentLayoutHeader
          title={title}
          headerActions={headerActions}
          withBorders={withBorders}
          headerClassName={headerClassName}
        />
      )}
      <ContentLayoutContent
        withScrollArea={withScrollArea}
        withScrollAreaPadding={withScrollAreaPadding}
        maxHeight={maxHeight}
        withScrollFade={withScrollFade}
        footer={footer}
        withBorders={withBorders}
        className={contentClassName}>
        {children}
      </ContentLayoutContent>
      {aside && <Box className={asideClassNames.join(" ")}>{aside}</Box>}
      {footer && (
        <ContentLayoutFooter
          footer={footer}
          withBorders={withBorders}
          footerClassName={footerClassName}
        />
      )}
    </Stack>
  );
};
