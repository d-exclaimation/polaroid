import { component } from "@/lib/rc";
import { MaterialIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default component(() => {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: "Snaps",
          headerShown: false,
          tabBarLabelStyle: {
            display: "none",
          },
          tabBarIcon: (props) => (
            <MaterialIcons name="camera" size={24} color={props.color} />
          ),
        }}
      />
      <Tabs.Screen
        name="capture"
        options={{
          title: "Capture",
          headerShown: false,
          tabBarLabelStyle: {
            display: "none",
          },
          tabBarIcon: (props) => (
            <MaterialIcons name="photo-camera" size={24} color={props.color} />
          ),
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarLabelStyle: {
            display: "none",
          },
          tabBarIcon: (props) => (
            <MaterialIcons name="settings" size={24} color={props.color} />
          ),
        }}
      />
    </Tabs>
  );
});
