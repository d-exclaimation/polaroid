import AssetImage from "@/lib/components/asset-image";
import { getSnaps } from "@/lib/data/snaps";
import { component } from "@/lib/rc";
import { useQuery } from "@tanstack/react-query";
import { useAssets } from "expo-asset";
import { Link } from "expo-router";
import { useMemo } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  SafeAreaView,
  Text,
  View,
} from "react-native";

const { width: maxWidth } = Dimensions.get("window");

export default component(() => {
  const { data, isLoading } = useQuery({
    queryKey: ["snaps"],
    queryFn: getSnaps,
  });
  const [assets, assetError] = useAssets([
    require("../../assets/snap-empty.png"),
    require("../../assets/snap-regular.png"),
    require("../../assets/snap-pic.png"),
    require("../../assets/snap-fav.png"),
    require("../../assets/snap-achieve.png"),
  ]);

  const emptyStateAsset = useMemo(() => assets?.[0], [assets]);
  const regularAsset = useMemo(() => assets?.[1], [assets]);
  const picAsset = useMemo(() => assets?.[2], [assets]);
  const favAsset = useMemo(() => assets?.[3], [assets]);
  const achieveAsset = useMemo(() => assets?.[4], [assets]);

  if (assetError) {
    console.log(assetError);
  }

  // Loading state
  if (isLoading || !data) {
    return (
      <SafeAreaView className="flex-1 flex flex-col items-center justify-center">
        <ActivityIndicator size="large" color="#FAFAFA" />
      </SafeAreaView>
    );
  }

  // Empty state
  if (data.length === 0) {
    return (
      <SafeAreaView className="flex-1 flex flex-col items-start justify-start">
        <View className="flex-1 w-full h-full flex flex-col items-center justify-center">
          <AssetImage className="h-[180px] w-[177px]" asset={emptyStateAsset} />

          <Text className="mt-6 font-bold text-lg text-neutral-300">
            No snaps for today yet
          </Text>

          <Link
            href="/(tabs)/capture"
            className="mt-2 text-sm text-neutral-300/75 active:text-neutral-300"
          >
            Start taking photos to see them here &rarr;
          </Link>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 flex flex-col items-center justify-center">
      <FlatList
        data={data}
        keyExtractor={({ id }) => id}
        contentContainerStyle={{
          width: maxWidth,
          alignItems: "center",
        }}
        renderItem={({ item: { photo, kind, createdAt } }) => {
          return (
            <View className="p-3">
              <View className="w-[375px] h-[375px] relative overflow-hidden rounded-2xl">
                <Image
                  className="w-[375px] h-[375px] bg-black"
                  source={photo}
                />
              </View>

              <View className="flex flex-row my-4 px-1 items-center justify-start">
                <AssetImage
                  className="h-[32px] w-[32px]"
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
                <Text className="capitalize mx-3 font-bold text-neutral-100">
                  {kind}
                </Text>
                <Text className="text-neutral-200 ml-auto">
                  {createdAt.toLocaleString("en-NZ")}
                </Text>
              </View>
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
});
