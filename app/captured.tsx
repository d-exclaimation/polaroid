import { useLoading } from "@/lib/async";
import { PhotoParams, setSnap } from "@/lib/data/snaps";
import { component } from "@/lib/rc";
import { useCocoSsd } from "@/lib/tensorflow";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as cocossd from "@tensorflow-models/coco-ssd";
import { decodeJpeg, fetch } from "@tensorflow/tfjs-react-native";
import * as MediaLibrary from "expo-media-library";
import { Stack, router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Image, Pressable, Text, View } from "react-native";

const DIMENSIONS = {
  width: 350,
  height: 350,
};

export default component(() => {
  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();
  const { detect, dispose, ready } = useCocoSsd();

  const queryClient = useQueryClient();
  const { mutateAsync } = useMutation({
    mutationKey: ["snaps", "save"],
    mutationFn: setSnap,
    onSuccess: async () => {
      await queryClient.invalidateQueries(["snaps"]);
      router.push("/(tabs)");
    },
  });

  const params = useLocalSearchParams();
  const photo = useMemo(() => {
    const res = PhotoParams.safeParse(params);
    if (res.success) {
      return res.data;
    }
    return undefined;
  }, [params]);

  const { loading, start } = useLoading(true);
  const [result, setResult] = useState<cocossd.DetectedObject[] | undefined>(
    undefined
  );

  const savePhoto = useCallback(async () => {
    if (!photo) return;

    if (!permissionResponse?.granted) {
      const res = await requestPermission();
      if (!res.granted) {
        // TODO: Show error
        return;
      }
    }

    const { uri, height, width, creationTime } =
      await MediaLibrary.createAssetAsync(photo.uri);
    const createdAt = new Date(creationTime);
    await mutateAsync({
      id: createdAt.toISOString(),
      photo: {
        uri,
        height,
        width,
      },
      kind: "regular",
      createdAt,
    });
  }, [photo, mutateAsync, permissionResponse]);

  const validate = useCallback(async () => {
    if (!ready || !photo) return;
    console.log(`starting detection for ${photo.uri}`);
    const imageAsset = await fetch(photo.uri, {}, { isBinary: true });
    const imageBuffer = await imageAsset.arrayBuffer();
    const imageTensor = decodeJpeg(new Uint8Array(imageBuffer), 3);
    const detected = await detect(imageTensor);
    setResult(detected);
    dispose(imageTensor);
    console.log(`finished detection for ${photo.uri}`);
  }, [setResult, ready, detect, dispose, photo]);

  useEffect(() => {
    if (!ready || !photo) return;
    start(() => validate());
  }, [ready, photo?.uri]);

  useEffect(() => {
    if (!photo) {
      router.push("/(tabs)/capture");
    }
  }, [photo]);

  if (!photo) {
    return null;
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: "Save photo",
        }}
      />
      <View className="flex-1 flex flex-col items-center justify-center">
        <View
          className="h-[450px] w-[375px] bg-white relative flex flex-col items-center justify-start py-3"
          style={{
            transform: [{ rotate: "1deg" }],
          }}
        >
          <View className="w-[350px] h-[350px] relative">
            {photo ? (
              <Image
                className="w-[350px] h-[350px] object-cover"
                source={photo}
              />
            ) : (
              <View className="w-[350px] h-[350px] bg-black" />
            )}
            {photo && result
              ? result.map(
                  ({ class: name, bbox: [x, y, width, height] }, i) => {
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
                  }
                )
              : null}
          </View>
        </View>

        <View className="my-6 px-8 w-full flex items-center justify-center">
          <View className="bg-black/20 rounded-md w-full p-2 flex flex-row items-center justify-center">
            {loading ? (
              <>
                <ActivityIndicator size="small" color="#ffffff" />
                <Text className="ml-2 py-4 text-lg text-white/75">
                  Loading result
                </Text>
              </>
            ) : (
              <Text className="py-4 text-lg text-white/75">Result loaded</Text>
            )}
          </View>
        </View>

        <View className="flex flex-row w-full items-center justify-end px-8 mb-10">
          <Pressable
            className="px-4 py-1.5 rounded-md flex flex-row items-center justify-center bg-black/25 active:bg-black/50"
            onPress={() => {
              router.push("/(tabs)");
            }}
          >
            <Text className="text-red-200 font-medium text-lg leading-7">
              Delete
            </Text>
          </Pressable>
          <Pressable
            className="px-4 py-1.5 rounded-md flex flex-row items-center justify-center bg-black/25 active:bg-black/50 ml-4"
            disabled={!ready || !photo}
            onPress={savePhoto}
          >
            <Text className="text-blue-200 font-medium text-lg leading-7">
              Save
            </Text>
          </Pressable>
        </View>
      </View>
    </>
  );
});
