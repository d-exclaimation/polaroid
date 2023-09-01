import { component } from "@/lib/rc";
import { MaterialIcons } from "@expo/vector-icons";
import { Camera, CameraType, ImageType } from "expo-camera";
import { SaveFormat, manipulateAsync } from "expo-image-manipulator";
import { router } from "expo-router";
import { useMemo, useRef, useState } from "react";
import { Pressable, View } from "react-native";

const DIMENSIONS = {
  width: 400,
  height: 400,
};

export default component(() => {
  const camera = useRef<Camera>(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [permission, requestPermission] = Camera.useCameraPermissions();

  const canTakePicture = useMemo(
    () => cameraReady && permission?.granted,
    [cameraReady, permission]
  );

  return (
    <View className="flex-1 flex items-center justify-center gap-12 bg-black">
      <Camera
        ref={camera}
        className="w-[400px] h-[400px]"
        ratio="1:1"
        pictureSize="1:1"
        type={CameraType.back}
        onCameraReady={() => setCameraReady(true)}
      />

      <Pressable
        className="px-4 py-4 rounded-full bg-white"
        onPress={async () => {
          if (!camera.current || !canTakePicture) return;

          const { uri, width, height } = await camera.current.takePictureAsync({
            imageType: ImageType.jpg,
          });

          const resize =
            width > height
              ? { width: 400, height: Math.round((height / width) * 400) }
              : { width: Math.round((width / height) * 400), height: 400 };

          const image = await manipulateAsync(
            uri,
            [
              {
                resize,
              },
            ],
            {
              compress: 1,
              format: SaveFormat.JPEG,
            }
          );

          router.push(`/photo/${encodeURIComponent(image.uri)}`);
        }}
      >
        <MaterialIcons name="center-focus-weak" size={32} color="black" />
      </Pressable>
    </View>
  );
});
