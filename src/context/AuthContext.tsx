import { Child } from "@/types";
import { createContext, useEffect, useMemo } from "react";
import { ENV } from "@/config/env";
import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { apiHandler } from "@/config/apiHandler";
import { Alert } from "react-native";

interface ContextProps {
  signIn: () => Promise<void>;
}

export const AuthContext = createContext({} as ContextProps);

export const AuthCtxProvider = ({ children }: Child) => {
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: ENV.googleWebClientId,
      iosClientId: ENV.googleIosClientId,
      scopes: ["profile", "email"],
    });
  }, []);

  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const idToken = userInfo.idToken;
      // Send the ID token to your backend for verification
      const response = await apiHandler.get("/auth/google");
      // Handle the response from your backend
      console.log(response.data);
      // Now you can handle the user session in your app
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        Alert.alert("User cancelled the login flow");
      } else if (error.code === statusCodes.IN_PROGRESS) {
        Alert.alert("Sign in is in progress");
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Alert.alert("Play services not available or outdated");
      } else {
        Alert.alert("Some other error happened");
      }
    }
  };

  const values = useMemo(
    () => ({
      signIn: signIn,
    }),
    []
  );

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};
