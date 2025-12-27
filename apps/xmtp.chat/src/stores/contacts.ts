import { useCallback, useMemo } from "react";
import { createStore, useStore } from "zustand";
import { persist } from "zustand/middleware";

// Contact nickname - custom name given by user for a wallet address
export type ContactNickname = {
  address: string; // lowercase wallet address
  nickname: string; // user-defined nickname
  updatedAt: number; // timestamp
};

export type ContactsState = {
  nicknames: Record<string, ContactNickname>; // keyed by lowercase address
};

export type ContactsActions = {
  setNickname: (address: string, nickname: string) => void;
  removeNickname: (address: string) => void;
  getNickname: (address: string) => string | null;
  hasNickname: (address: string) => boolean;
  getAllNicknames: () => ContactNickname[];
  reset: () => void;
};

const initialState: ContactsState = {
  nicknames: {},
};

// Persisted store for contact nicknames
export const contactsStore = createStore<ContactsState & ContactsActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      setNickname: (address: string, nickname: string) => {
        const lowerAddress = address.toLowerCase();
        const trimmedNickname = nickname.trim();

        if (!trimmedNickname) {
          // If nickname is empty, remove it
          get().removeNickname(address);
          return;
        }

        set((state) => ({
          nicknames: {
            ...state.nicknames,
            [lowerAddress]: {
              address: lowerAddress,
              nickname: trimmedNickname,
              updatedAt: Date.now(),
            },
          },
        }));
      },

      removeNickname: (address: string) => {
        const lowerAddress = address.toLowerCase();
        set((state) => {
          const { [lowerAddress]: _, ...rest } = state.nicknames;
          return { nicknames: rest };
        });
      },

      getNickname: (address: string) => {
        const lowerAddress = address.toLowerCase();
        const contact = get().nicknames[lowerAddress] as
          | ContactNickname
          | undefined;
        return contact !== undefined ? contact.nickname : null;
      },

      hasNickname: (address: string) => {
        const lowerAddress = address.toLowerCase();
        return lowerAddress in get().nicknames;
      },

      getAllNicknames: () => {
        return Object.values(get().nicknames);
      },

      reset: () => {
        set(initialState);
      },
    }),
    {
      name: "mumble-contacts", // localStorage key
      version: 1,
    },
  ),
);

// Hook to use the contacts store
export const useContacts = () => {
  return useStore(contactsStore);
};

// Hook to get a specific nickname
export const useContactNickname = (address: string | undefined) => {
  // Subscribe to the entire nicknames object to ensure re-renders when it changes
  const nicknames = useStore(contactsStore, (state) => state.nicknames);
  const setNicknameAction = useStore(
    contactsStore,
    (state) => state.setNickname,
  );
  const removeNicknameAction = useStore(
    contactsStore,
    (state) => state.removeNickname,
  );

  // Compute nickname from the subscribed state
  const nickname = useMemo(() => {
    if (!address) return null;
    const lowerAddress = address.toLowerCase();
    const contact = nicknames[lowerAddress] as
      | { address: string; nickname: string; updatedAt: number }
      | undefined;
    return contact !== undefined ? contact.nickname : null;
  }, [address, nicknames]);

  const updateNickname = useCallback(
    (newNickname: string) => {
      if (!address) return;
      setNicknameAction(address, newNickname);
    },
    [address, setNicknameAction],
  );

  const clearNickname = useCallback(() => {
    if (!address) return;
    removeNicknameAction(address);
  }, [address, removeNicknameAction]);

  return {
    nickname,
    setNickname: updateNickname,
    removeNickname: clearNickname,
    hasNickname: !!nickname,
  };
};

// Helper to get display name (nickname > ENS/basename > truncated address)
export const getDisplayName = (
  address: string,
  nickname: string | null,
  ensName: string | null,
): string => {
  if (nickname) return nickname;
  if (ensName) return ensName;
  // Truncate address
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};
