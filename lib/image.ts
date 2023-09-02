import type { Asset } from "expo-asset";
import type { ImageProps } from "react-native";

export function sourceOf(asset: Asset): ImageProps["source"] {
  return {
    ...asset,
    width: asset.width ?? undefined,
    height: asset.height ?? undefined,
  };
}
