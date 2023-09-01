import { usePhoto } from "@/lib/photo";
import { component } from "@/lib/rc";
import * as cocossd from "@tensorflow-models/coco-ssd";
import * as tf from "@tensorflow/tfjs";
import { decodeJpeg, fetch } from "@tensorflow/tfjs-react-native";
import { Redirect, Stack } from "expo-router";
import { useEffect, useState } from "react";
import { Image, Text, View } from "react-native";

type Objects = {
  name: string;
  bbox: {
    top: number;
    left: number;
    width: number;
    height: number;
  };
};

export default component(() => {
  const { photo } = usePhoto();
  const [isDetecting, setIsDetecting] = useState(false);
  const [model, setModel] = useState<cocossd.ObjectDetection | null>(null);
  const [objects, setObjects] = useState<Objects[]>([]);

  useEffect(() => {
    async function detect() {
      try {
        if (!photo) return;
        await tf.ready();
        const model = await cocossd.load();
        const res = await fetch(photo.uri, {}, { isBinary: true });
        const imageBuffer = await res.arrayBuffer();
        const imageArray = new Uint8Array(imageBuffer);
        const imageTensor = decodeJpeg(imageArray);
        const predictions = await model.detect(imageTensor);
        setObjects(
          predictions.map(({ bbox: [x, y, width, height], class: name }) => ({
            name,
            bbox: {
              top: y,
              left: x,
              width,
              height,
            },
          }))
        );
      } catch (e) {}
    }
    setIsDetecting(true);
    detect().then(() => setIsDetecting(false));

    return () => {
      setIsDetecting(false);
    };
  }, [photo]);

  if (!photo) return <Redirect href="/(tabs)/snap" />;

  return (
    <>
      <Stack.Screen options={{ title: "Snapshot" }} />
      <View className="flex-1 flex items-center justify-center gap-0">
        <View className="flex">
          <Image className="w-[400px] h-[500px]" source={{ uri: photo.uri }} />
          {objects.map(({ name, bbox: { top, left, width, height } }) => {
            return (
              <View
                key={`${name}-${top}-${left}-box`}
                className="absolute border-2 border-white rounded-sm"
                style={{
                  top: `${Math.round((top / photo.height) * 100)}%`,
                  left: `${Math.round((left / photo.width) * 100)}%`,
                  width: Math.round((width / photo.width) * 400),
                  height: Math.round((height / photo.height) * 500),
                }}
              />
            );
          })}
          {objects.map(({ name, bbox: { top, left } }) => {
            return (
              <Text
                key={`${name}-${top}-${left}-text`}
                className="text-xs text-white -translate-y-0 absolute"
                style={{
                  top: `${Math.round((top / photo.height) * 100)}%`,
                  left: `${Math.round((left / photo.width) * 100)}%`,
                }}
              >
                {name}
              </Text>
            );
          })}
        </View>
        <Text className="mt-10 text-lg font-bold">
          {isDetecting
            ? "Detecting..."
            : objects.length
            ? "Found something"
            : "Nothing found"}
        </Text>
      </View>
    </>
  );
});
