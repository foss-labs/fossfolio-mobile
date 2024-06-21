import { useAuth } from "@/hooks/useAuth";
import { View, Button, Alert, Text } from "react-native";

const Home = () => {
  const { signIn, user } = useAuth();

  return (
    <View>
      <Button title="Login" onPress={signIn} />
      <Text>{user?.email && user?.email}</Text>
    </View>
  );
};

export default Home;
