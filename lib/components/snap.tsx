import AssetImage from "@/lib/components/asset-image";
import { Snap } from "@/lib/data/snaps";
import { MaterialIcons } from "@expo/vector-icons";
import { useAssets } from "expo-asset";
import { useCallback, useMemo } from "react";
import { Image, Pressable, Text, View } from "react-native";

import { useActionSheet } from "@expo/react-native-action-sheet";
import { component } from "../rc";

const DIMENSIONS = {
  width: 375,
  height: 375,
};

const OPTIONS = ["Delete", "Share", "Cancel"] as ["Delete", "Share", "Cancel"];

export default component<Snap>(({ photo, detections, kind, createdAt }) => {
  const { showActionSheetWithOptions } = useActionSheet();

  const [assets] = useAssets([
    require("../../assets/snap-regular.png"),
    require("../../assets/snap-pic.png"),
    require("../../assets/snap-fav.png"),
    require("../../assets/snap-achieve.png"),
  ]);

  const regularAsset = useMemo(() => assets?.[0], [assets]);
  const picAsset = useMemo(() => assets?.[1], [assets]);
  const favAsset = useMemo(() => assets?.[2], [assets]);
  const achieveAsset = useMemo(() => assets?.[3], [assets]);

  const datetime = useMemo(
    () =>
      createdAt.toLocaleString("en-NZ", {
        weekday: "long",
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    [createdAt]
  );

  const onMore = useCallback(async () => {
    const optionIndex =
      (await new Promise<number | undefined>((resolve) =>
        showActionSheetWithOptions(
          {
            title: `Option for snap from ${datetime}`,
            options: OPTIONS,
            cancelButtonIndex: OPTIONS.length - 1,
            destructiveButtonIndex: 0,
          },
          resolve
        )
      )) ?? OPTIONS.length - 1;

    switch (OPTIONS[optionIndex]) {
      case "Delete": {
        break;
      }
      case "Share": {
        break;
      }
      case "Cancel": {
        break;
      }
    }
  }, [datetime]);

  return (
    <View className="p-3">
      <View className="w-[375px] h-[375px] relative overflow-hidden rounded-xl">
        <Image className="w-[375px] h-[375px] bg-black" source={photo} />
        {detections.map(({ class: name, bbox: [x, y, width, height] }, i) => {
          const color =
            i % 3 === 0
              ? "border-rose-500"
              : i % 3 === 1
              ? "border-amber-500"
              : "border-blue-500";
          return (
            <View
              key={`${name}-${i}`}
              className={`border absolute ${color}`}
              style={{
                left: (x / photo.width) * DIMENSIONS.width,
                top: (y / photo.height) * DIMENSIONS.height,
                width: (width / photo.width) * DIMENSIONS.width,
                height: (height / photo.height) * DIMENSIONS.height,
              }}
            />
          );
        })}
      </View>

      <View className="flex flex-row my-3 px-1 items-center justify-start">
        <AssetImage
          className="h-[28px] w-[28px]"
          asset={
            kind === "regular"
              ? regularAsset
              : kind === "pic"
              ? picAsset
              : kind === "fav"
              ? favAsset
              : achieveAsset
          }
        />
        <Text className="text-white text-xs font-medium ml-3">{datetime}</Text>

        <Pressable className="ml-auto" onPress={onMore}>
          <MaterialIcons name="more-horiz" size={20} color="white" />
        </Pressable>
      </View>
    </View>
  );
});
