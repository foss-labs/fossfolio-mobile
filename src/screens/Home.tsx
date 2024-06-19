import { View, Button, Alert } from "react-native";
import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { apiHandler } from "@/config/apiHandler";

const Home = () => {
  const signIn = async () => {
    // try {
    //   await GoogleSignin.hasPlayServices();
    //   const userInfo = await GoogleSignin.signIn();
    //   const idToken = userInfo.idToken;
    //   // Send the ID token to your backend for verification
    //   const response = await apiHandler.get("/auth/google");
    //   // Handle the response from your backend
    //   console.log(response.data);
    //   // Now you can handle the user session in your app
    // } catch (error) {
    //   if (error.code === statusCodes.SIGN_IN_CANCELLED) {
    //     Alert.alert("User cancelled the login flow");
    //   } else if (error.code === statusCodes.IN_PROGRESS) {
    //     Alert.alert("Sign in is in progress");
    //   } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
    //     Alert.alert("Play services not available or outdated");
    //   } else {
    //     Alert.alert("Some other error happened");
    //   }
    // }
  };

  return (
    <View>
      <Button title="Login" onPress={signIn} />
    </View>
  );
};

export default Home;
