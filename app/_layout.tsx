import { component } from "@/lib/rc";
import { Stack } from "expo-router";
import { LogBox } from "react-native";

LogBox.ignoreLogs([/.*webgl.*/, /.*tf.*/]);

export default component(() => {
  return (
    <Stack initialRouteName="(tabs)">
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
});
