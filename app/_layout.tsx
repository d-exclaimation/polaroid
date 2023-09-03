import TensorflowProvider from "@/lib/context/tensorflow-provider";
import { component } from "@/lib/rc";
import { ThemeProvider } from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { LogBox } from "react-native";

LogBox.ignoreLogs([/.*webgl.*/, /.*tf.*/]);

const queryClient = new QueryClient();

export default component(() => {
  return (
    <QueryClientProvider client={queryClient}>
      <TensorflowProvider>
        <ThemeProvider
          value={{
            dark: true,
            colors: {
              primary: "#FFFFFF",
              background: "#464C67",
              card: "#262C47",
              text: "#FFFFFF",
              border: "#484E69",
              notification: "#FFFFFF",
            },
          }}
        >
          <Stack initialRouteName="(tabs)">
            <Stack.Screen
              name="(tabs)"
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="captured"
              options={{
                presentation: "modal",
              }}
            />
          </Stack>
        </ThemeProvider>
      </TensorflowProvider>
    </QueryClientProvider>
  );
});
