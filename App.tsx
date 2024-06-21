import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthCtxProvider } from "@/context/AuthContext";
import { SCREEN_NAMES } from "@/screens";
import HomeScreen from "@/screens/Home";

const Stack = createNativeStackNavigator();
const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthCtxProvider>
        <NavigationContainer>
          <StatusBar style="auto" />
          <Stack.Navigator>
            <Stack.Screen name={SCREEN_NAMES.HOME} component={HomeScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </AuthCtxProvider>
    </QueryClientProvider>
  );
}
