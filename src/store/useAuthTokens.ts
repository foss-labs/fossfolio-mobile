import { create } from "zustand";

interface AuthTokensState {
  refreshToken: string | null;
  accessToken: string | null;
}

interface AuthTokensActions {
  removeAllToken: () => void;
  setToken: (refreshToken: string, accessToken: string) => void;
}

export const useAuthTokens = create<AuthTokensState & AuthTokensActions>(
  (set) => ({
    refreshToken: null,
    accessToken: null,
    removeAllToken: () => set({ refreshToken: null, accessToken: null }),
    setToken: (refreshToken, accessToken) =>
      set({ refreshToken: refreshToken, accessToken: accessToken }),
  })
);
