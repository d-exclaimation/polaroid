import { component } from "@/lib/rc";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView, Text } from "react-native";

export default component(() => {
  const searchParams = useLocalSearchParams<Record<string, string>>();
  return (
    <SafeAreaView className="flex-1 items-center justify-center">
      <Text>{JSON.stringify(searchParams, null, 2)}</Text>
    </SafeAreaView>
  );
});
