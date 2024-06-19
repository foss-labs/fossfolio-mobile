import { Child } from "@/types";
import { createContext, useEffect } from "react";
import { ENV } from "@/config/env";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

export const AuthContext = createContext({});

export const AuthCtxProvider = ({ children }: Child) => {
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: ENV.googleWebClientId,
      iosClientId: ENV.googleIosClientId,
      scopes: ["profile", "email"],
    });
  }, []);
  return <AuthContext.Provider value={{}}>{children}</AuthContext.Provider>;
};
