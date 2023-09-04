import AssetImage from "@/lib/components/asset-image";
import SnapComponent from "@/lib/components/snap";
import { clearAllSnaps, getSnaps } from "@/lib/data/snaps";
import { component } from "@/lib/rc";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { MaterialIcons } from "@expo/vector-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAssets } from "expo-asset";
import { Link } from "expo-router";
import { useCallback, useMemo } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Pressable,
  SafeAreaView,
  Text,
  View,
} from "react-native";

const { width: maxWidth } = Dimensions.get("window");

const OPTIONS = ["Delete all", "Cancel"] as ["Delete all", "Cancel"];

export default component(() => {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["snaps"],
    queryFn: getSnaps,
  });
  const { mutate } = useMutation({
    mutationKey: ["snaps", "delete", "all"],
    mutationFn: clearAllSnaps,
    onSuccess: async () => {
      await queryClient.invalidateQueries(["snaps"]);
    },
  });
  const { showActionSheetWithOptions } = useActionSheet();
  const [assets] = useAssets([require("../../assets/snap-empty.png")]);

  const emptyStateAsset = useMemo(() => assets?.[0], [assets]);

  const onMore = useCallback(async () => {
    const optionIndex =
      (await new Promise<number | undefined>((resolve) =>
        showActionSheetWithOptions(
          {
            title: "Options for your snaps",
            options: OPTIONS,
            cancelButtonIndex: OPTIONS.length - 1,
            destructiveButtonIndex: 0,
          },
          resolve
        )
      )) ?? OPTIONS.length - 1;

    switch (OPTIONS[optionIndex]) {
      case "Delete all": {
        mutate();
        break;
      }
    }
  }, []);

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
      <View className="py-3 w-full px-6 flex flex-row items-center justify-start bg-[#464C67] sticky top-0">
        <Text className="text-white text-xl font-bold">Your Snaps</Text>

        <Pressable className="ml-auto" onPress={onMore}>
          <MaterialIcons name="more-vert" size={24} color="white" />
        </Pressable>
      </View>
      <FlatList
        data={data}
        keyExtractor={({ id }) => id}
        contentContainerStyle={{
          width: maxWidth,
          alignItems: "center",
        }}
        renderItem={({ item }) => {
          return <SnapComponent {...item} />;
        }}
      />
    </SafeAreaView>
  );
});
