import { usePhoto } from "@/lib/photo";
import { component } from "@/lib/rc";
import { FontAwesome5 } from "@expo/vector-icons";
import { Camera, CameraType, ImageType } from "expo-camera";
import { router } from "expo-router";
import { useMemo, useRef, useState } from "react";
import { Pressable, View } from "react-native";

type Objects = {
  name: string;
  bbox: {
    top: number;
    left: number;
    width: number;
    height: number;
  };
};

const DIMENSIONS = {
  width: 400,
  height: 500,
};

export default component(() => {
  const { setPhoto } = usePhoto();
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

          const res = await camera.current.takePictureAsync({
            imageType: ImageType.jpg,
          });
          console.log(res);

          setPhoto({
            uri: res.uri,
            width: res.width,
            height: res.height,
          });
          router.push({
            pathname: "/result",
          });
        }}
      >
        <FontAwesome5 name="camera" size={32} color="black" />
      </Pressable>
    </View>
  );
});
