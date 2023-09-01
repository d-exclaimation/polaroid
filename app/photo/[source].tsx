import { component } from "@/lib/rc";
import * as MediaLibrary from "expo-media-library";
import { Stack, router, useLocalSearchParams } from "expo-router";
import { useMemo } from "react";
import { Image, Pressable, Text, View } from "react-native";

export default component(() => {
  const { source } = useLocalSearchParams<{ source: string }>();
  const uri = useMemo(() => decodeURIComponent(source), [source]);
  return (
    <>
      <Stack.Screen
        options={{
          title: "Save photo",
        }}
      />
      <View className="flex-1 flex items-center justify-center gap-12">
        <Image className="w-[400px] h-[400px] object-cover" source={{ uri }} />

        <View className="flex flex-row w-full items-center justify-between gap-4 px-12">
          <Pressable
            className="px-4 py-2 rounded-md bg-black"
            onPress={async () => {
              await MediaLibrary.saveToLibraryAsync(uri);
              router.push("/(tabs)");
            }}
          >
            <Text className="font-medium text-white">Save</Text>
          </Pressable>
          <Pressable
            className="px-4 py-2 rounded-md bg-red-600"
            onPress={() => {
              router.push("/(tabs)");
            }}
          >
            <Text className="font-medium text-white">Cancel</Text>
          </Pressable>
        </View>
      </View>
    </>
  );
});
