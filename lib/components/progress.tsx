import { useEffect, useState } from "react";
import { Animated, Text, View } from "react-native";
import { component } from "../rc";

export default component<{ width: number }>(({ width }) => {
  const [progress, setProgress] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(progress, {
      toValue: width,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [width]);

  return (
    <View className="relative flex flex-row items-center justify-start py-2 px-4 my-1.5 rounded-xl bg-black/25 w-full overflow-hidden">
      <Animated.View
        className="absolute top-0 left-0 bottom-0 bg-yellow-500 w-[100px] h-[52px]"
        style={{ width: progress }}
      />
      <View className="relative py-1.5 px-4 rounded-full bg-white">
        <Text className="text-base text-black">Duck</Text>
      </View>
    </View>
  );
});
