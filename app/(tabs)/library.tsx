import { component } from "@/lib/rc";
import { MaterialIcons } from "@expo/vector-icons";
import { SaveFormat, manipulateAsync } from "expo-image-manipulator";
import { MediaTypeOptions, launchImageLibraryAsync } from "expo-image-picker";
import { router } from "expo-router";
import { useState } from "react";
import {
  Image,
  Pressable,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type PhotoAsset = {
  uri: string;
  width: number;
  height: number;
};
type DetectedObject = {
  name: string;
  bbox: { x: number; y: number; width: number; height: number };
};
const DIMENSIONS = {
  width: 350,
  height: 350,
};

export default component(() => {
  const [image, setImage] = useState<PhotoAsset>();

  return (
    <SafeAreaView className="flex-1 flex items-center justify-center gap-10">
      {!image ? (
        <View className="flex w-[400px] h-[400px] items-center justify-center border border-dashed border-neutral-400">
          <TouchableOpacity
            className="px-4 py-2 rounded-md bg-neutral-200"
            onPress={async () => {
              const res = await launchImageLibraryAsync({
                mediaTypes: MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 1,
                selectionLimit: 1,
              });
              if (res.canceled || res.assets.length === 0) return;
              const { width, height, uri } = res.assets[0];
              const resize =
                width > height
                  ? {
                      width: 400,
                      height: Math.round((height / width) * 400),
                    }
                  : {
                      width: Math.round((width / height) * 400),
                      height: 400,
                    };
              const image = await manipulateAsync(uri, [{ resize }], {
                compress: 1,
                format: SaveFormat.JPEG,
              });
              setImage(image);
            }}
          >
            <Text className="text-black font-medium">Select a photo</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <View className="h-[450px] w-[375px] bg-white relative flex flex-col items-center justify-start py-3">
            <View className="w-[350px] h-[350px] relative">
              <Image
                className="w-[350px] h-[350px]"
                source={{ uri: image.uri }}
              />
              <TouchableOpacity
                className="absolute top-2 right-2 p-1 rounded-full bg-black"
                onPress={() => {
                  setImage(undefined);
                }}
              >
                <MaterialIcons name="close" size={20} color={"#ffffff"} />
              </TouchableOpacity>
            </View>
          </View>
          <Pressable
            className="px-4 py-1.5 rounded-md flex flex-row items-center justify-center bg-black/25 active:bg-black/50 ml-4"
            onPress={() => {
              router.push({
                pathname: "/captured",
                params: {
                  uri: image.uri,
                  width: image.width,
                  height: image.height,
                },
              });
              setImage(undefined);
            }}
          >
            <Text className="text-green-200 font-medium text-lg leading-7">
              Select
            </Text>
          </Pressable>
        </>
      )}
    </SafeAreaView>
  );
});
