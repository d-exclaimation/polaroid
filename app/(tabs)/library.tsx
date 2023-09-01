import { component } from "@/lib/rc";
import { MaterialIcons } from "@expo/vector-icons";
import * as cocossd from "@tensorflow-models/coco-ssd";
import * as tf from "@tensorflow/tfjs";
import { decodeJpeg, fetch } from "@tensorflow/tfjs-react-native";
import { SaveFormat, manipulateAsync } from "expo-image-manipulator";
import { MediaTypeOptions, launchImageLibraryAsync } from "expo-image-picker";
import { useCallback, useEffect, useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

type PhotoAsset = {
  uri: string;
  width: number;
  height: number;
};
type DetectedObject = {
  name: string;
  bbox: { x: number; y: number; width: number; height: number };
};

export default component(() => {
  const [image, setImage] = useState<PhotoAsset>();
  const [tfReady, setTfReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [detectedObjects, setDetectedObjects] = useState<DetectedObject[]>([]);

  const classify = useCallback(async () => {
    if (!tfReady || !image) return;
    const model = await cocossd.load();
    const imageAsset = await fetch(image.uri, {}, { isBinary: true });
    const imageBuffer = await imageAsset.arrayBuffer();
    const imageTensor = decodeJpeg(new Uint8Array(imageBuffer), 3);
    const detected = await model.detect(imageTensor);
    setDetectedObjects(
      detected.map(({ class: name, bbox: [x, y, width, height] }) => ({
        name,
        bbox: { x, y, width, height },
      }))
    );
  }, [setDetectedObjects, tfReady, image]);

  useEffect(() => {
    if (tfReady) return;
    (async () => {
      await tf.ready();
      setTfReady(true);
    })();
  }, [tfReady]);

  return (
    <View className="flex-1 flex items-center justify-center gap-10">
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
        <View className="w-[400px] h-[400px] relative">
          <Image className="w-[400px] h-[400px]" source={{ uri: image.uri }} />
          <TouchableOpacity
            className="absolute top-4 right-4 p-1 rounded-full bg-black"
            onPress={() => {
              setImage(undefined);
            }}
          >
            <MaterialIcons name="close" size={20} color={"#ffffff"} />
          </TouchableOpacity>
          {detectedObjects.map(({ name, bbox: { x, y, width, height } }, i) => {
            return (
              <View
                key={`${name}-${i}`}
                className="border border-indigo-500 absolute"
                style={{
                  left: (x / image.width) * 400,
                  top: (y / image.height) * 400,
                  width: (width / image.width) * 400,
                  height: (height / image.height) * 400,
                }}
              />
            );
          })}
        </View>
      )}

      <TouchableOpacity
        className="px-4 py-2 rounded-md bg-neutral-200"
        disabled={!tfReady || !image || loading}
        onPress={() => {
          setLoading(true);
          classify()
            .then(() => setLoading(false))
            .catch(console.error);
        }}
      >
        <Text className="text-black font-medium">
          {tfReady && image && !loading ? "Detect" : "Loading..."}
        </Text>
      </TouchableOpacity>
    </View>
  );
});
