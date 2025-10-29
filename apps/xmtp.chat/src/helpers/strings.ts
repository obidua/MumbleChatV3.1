export const isValidEthereumAddress = (
  address: string,
): address is `0x${string}` => /^0x[a-fA-F0-9]{40}$/.test(address);

export const isValidInboxId = (inboxId: string): boolean =>
  /^[a-z0-9]{64}$/.test(inboxId);

const shouldTruncate = (inputLength: number, prefix: number, suffix: number) =>
  inputLength > prefix + suffix + 3;

const buildTruncatedValue = (
  value: string,
  prefix: number,
  suffix: number,
): string => {
  if (!shouldTruncate(value.length, prefix, suffix)) {
    return value;
  }

  return `${value.substring(0, prefix)}...${value.substring(value.length - suffix)}`;
};

export const shortAddress = (value: string, length: number = 4): string => {
  if (!value) {
    return value;
  }

  const trimmed = value.trim();
  const safeLength = Math.max(1, length);

  if (isValidEthereumAddress(trimmed)) {
    const prefix = Math.min(trimmed.length, safeLength + 2);
    const suffix = Math.max(
      1,
      Math.min(trimmed.length - prefix, safeLength),
    );
    return buildTruncatedValue(trimmed, prefix, suffix);
  }

  if (isValidInboxId(trimmed)) {
    const prefix = Math.min(trimmed.length, safeLength);
    const suffix = Math.max(
      1,
      Math.min(trimmed.length - prefix, safeLength),
    );
    return buildTruncatedValue(trimmed, prefix, suffix);
  }

  const prefix = Math.min(trimmed.length, safeLength);
  const suffix = Math.max(
    1,
    Math.min(
      trimmed.length - prefix,
      Math.max(safeLength, Math.ceil(safeLength * 1.5)),
    ),
  );
  return buildTruncatedValue(trimmed, prefix, suffix);
};

export const MEMBER_NO_LONGER_IN_GROUP =
  "This member is no longer in the group";
