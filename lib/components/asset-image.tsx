import type { Asset } from "expo-asset";
import { Image, type ImageProps } from "react-native";
import { sourceOf } from "../image";
import { component } from "../rc";

type Props = Omit<ImageProps, "source"> & {
  asset: Asset | undefined | null;
};

export default component<Props>(({ asset, ...rest }) => {
  return asset ? <Image {...rest} source={sourceOf(asset)} /> : null;
});
