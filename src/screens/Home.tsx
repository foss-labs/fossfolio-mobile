import { useAuth } from "@/hooks/useAuth";
import { View, Button, Alert } from "react-native";

const Home = () => {
  const { signIn } = useAuth();

  return (
    <View>
      <Button title="Login" onPress={signIn} />
    </View>
  );
};

export default Home;
