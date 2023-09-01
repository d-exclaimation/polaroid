import { PhotoProvider } from "@/lib/photo";
import { component } from "@/lib/rc";
import { Stack } from "expo-router";
import { LogBox } from "react-native";

LogBox.ignoreLogs([/.*webgl.*/]);

export default component(() => {
  return (
    <PhotoProvider>
      <Stack initialRouteName="(tabs)">
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
    </PhotoProvider>
  );
});
