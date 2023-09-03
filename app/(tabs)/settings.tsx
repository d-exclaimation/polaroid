import { component } from "@/lib/rc";
import { Link } from "expo-router";
import { SafeAreaView } from "react-native";

export default component(() => {
  return (
    <SafeAreaView>
      <Link
        href={{
          pathname: "/captured",
        }}
      >
        Settings
      </Link>
    </SafeAreaView>
  );
});
