import { component } from "@/lib/rc";
import { FontAwesome5 } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default component(() => {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: "Gallery",
        }}
      />
      <Tabs.Screen
        name="snap"
        options={{
          title: "Snaps",
          tabBarLabelStyle: {
            display: "none",
          },
          tabBarIcon: (props) => (
            <FontAwesome5 name="camera" size={24} color={props.color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
        }}
      />
    </Tabs>
  );
});
