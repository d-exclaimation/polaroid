import { useLoading } from "@/lib/async";
import { component } from "@/lib/rc";
import { MaterialIcons } from "@expo/vector-icons";
import { Camera, CameraType, ImageType } from "expo-camera";
import { SaveFormat, manipulateAsync } from "expo-image-manipulator";
import {
  MediaTypeOptions,
  launchImageLibraryAsync,
  useMediaLibraryPermissions,
} from "expo-image-picker";
import { router } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Pressable, SafeAreaView, View } from "react-native";

export default component(() => {
  const camera = useRef<Camera>(null);
  const [cameraReady, setCameraReady] = useState(false);
  const { loading: takingPicture, start } = useLoading();
  const [cameraPermission, requestCameraPermission] =
    Camera.useCameraPermissions();
  const [libraryPermission, requestLibraryPermission] =
    useMediaLibraryPermissions();

  const canTakePicture = useMemo(
    () => cameraReady && cameraPermission?.granted,
    [cameraReady, cameraPermission]
  );

  const snap1x1PictureAsync = useCallback(async () => {
    if (!camera.current || !canTakePicture || takingPicture) return;
    const { uri, width, height } = await camera.current.takePictureAsync({
      imageType: ImageType.jpg,
    });

    const resize =
      width > height
        ? { width: 400, height: Math.round((height / width) * 400) }
        : { width: Math.round((width / height) * 400), height: 400 };

    const image = await manipulateAsync(uri, [{ resize }], {
      compress: 1,
      format: SaveFormat.JPEG,
    });

    router.push({
      pathname: "/captured",
      params: {
        uri: image.uri,
        width: image.width,
        height: image.height,
      },
    });
  }, [canTakePicture, takingPicture]);

  const pick1x1PictureAsync = useCallback(async () => {
    if (!libraryPermission?.granted) {
      const res = await requestLibraryPermission();
      if (!res.granted) {
        return;
      }
    }

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
    router.push({
      pathname: "/captured",
      params: {
        uri: image.uri,
        width: image.width,
        height: image.height,
      },
    });
  }, [libraryPermission, requestLibraryPermission]);

  useEffect(() => {
    if (cameraPermission && !cameraPermission.granted) {
      requestCameraPermission();
    }
  }, [cameraPermission]);

  return (
    <SafeAreaView className="flex-1 flex items-center justify-center gap-12 bg-black">
      <View className="relative flex items-center justify-center border border-neutral-300/30">
        <Camera
          ref={camera}
          className="w-[400px] h-[400px]"
          type={CameraType.back}
          onCameraReady={() => setCameraReady(true)}
        />
      </View>

      <View className="w-[76px] h-[76px] rounded-full flex items-center justify-center bg-black border-4 border-white">
        <Pressable
          className="p-4 rounded-full bg-white border-2 border-black transition-all duration-500 active:scale-90"
          disabled={!canTakePicture || takingPicture}
          onPress={() => start(() => snap1x1PictureAsync())}
          style={{
            opacity: canTakePicture ? 1 : 0.5,
          }}
        >
          <MaterialIcons name="center-focus-weak" size={32} color="black" />
        </Pressable>
      </View>

      <Pressable
        className="absolute bottom-6 left-6 p-3 rounded-full bg-white/25 flex flex-row items-center justify-center active:bg-white/25"
        onPress={() => start(() => pick1x1PictureAsync())}
      >
        <MaterialIcons name="photo-library" size={20} color="white" />
      </Pressable>
    </SafeAreaView>
  );
});
