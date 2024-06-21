import AsyncStorage from "@react-native-async-storage/async-storage";

export const storeTokens = async (
  refreshToken: string,
  accessToken: string
) => {
  try {
    await AsyncStorage.setItem("refresh-token", refreshToken);
    await AsyncStorage.setItem("access-token", accessToken);
  } catch (e) {
    console.warn("Unable to store the tokens");
  }
};

export const getTokens = async () => {
  try {
    const refreshToken = await AsyncStorage.getItem("refresh-token");
    const accessToken = await AsyncStorage.getItem("access-token");
    return {
      refreshToken,
      accessToken,
    };
  } catch (e) {
    console.warn("Unable to store the tokens");
  }
};
