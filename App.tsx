import { Camera, CameraType } from "expo-camera";
import { SafeAreaView, Text } from "react-native";

export default function App() {
  const [permission, requestPermission] = Camera.useCameraPermissions();
  return (
    <SafeAreaView className="flex-1 items-center justify-center">
      <Camera className="w-[300px] h-[300px]" type={CameraType.back}>
        <Text>Camera is working!</Text>
      </Camera>
      <Text>{permission?.granted ? "Yes" : "Bad"}</Text>
    </SafeAreaView>
  );
}
