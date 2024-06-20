import type { Child } from "@/types";
import { createContext, useEffect, useMemo } from "react";
import { ENV } from "@/config/env";
import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { apiHandler } from "@/config/apiHandler";
import { Alert } from "react-native";
import { useAuthTokens } from "@/store/useAuthTokens";
import { getTokens } from "@/config/handleTokens";

interface ContextProps {
  signIn: () => Promise<void>;
}

export const AuthContext = createContext({} as ContextProps);

export const AuthCtxProvider = ({ children }: Child) => {
  const { setToken } = useAuthTokens();

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: ENV.googleWebClientId,
      iosClientId: ENV.googleIosClientId,
      scopes: ["profile", "email"],
    });
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: No need to set setToken as dependency
  useEffect(() => {
    (async () => {
      // Accessing token from storage is expensive so we only does when app mounts
      const tokens = await getTokens();
      setToken(tokens.refreshToken, tokens.accessToken);
    })();
  }, []);

  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const idToken = userInfo.idToken;
      // Send the ID token to your backend for verification
      const url = encodeURI(`/auth/google/callback/mobile?token=${idToken}`);
      await apiHandler.get(url);
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        Alert.alert("User cancelled the login flow");
      } else if (error.code === statusCodes.IN_PROGRESS) {
        Alert.alert("Sign in is in progress");
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Alert.alert("Play services not available or outdated");
      } else {
        Alert.alert("Unable to signIn");
      }
    }
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: SignIn Dont need to be a dependency
  const values = useMemo(
    () => ({
      signIn: signIn,
    }),
    []
  );

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};
