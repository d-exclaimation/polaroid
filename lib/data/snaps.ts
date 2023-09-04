import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";
import { z } from "zod";

export type PhotoParams = z.infer<typeof PhotoParams>;
export const PhotoParams = z.object({
  uri: z.string(),
  width: z.coerce.number(),
  height: z.coerce.number(),
});

export type Photo = z.infer<typeof Photo>;
export const Photo = z.object({
  uri: z.string(),
  width: z.number(),
  height: z.number(),
});

export type Detection = z.infer<typeof Detection>;
export const Detection = z.object({
  class: z.string(),
  score: z.number(),
  bbox: z.tuple([z.number(), z.number(), z.number(), z.number()]),
});

export type Snap = z.infer<typeof Snap>;
export const Snap = z.object({
  id: z.string(),
  createdAt: z.coerce.date(),
  kind: z.enum(["regular", "pic", "fav", "achieve"]),
  photo: Photo,
  detections: z.array(Detection).default([]),
});

export const SnapArray = z.array(Snap);

export async function getSnaps(): Promise<Snap[]> {
  const data = await AsyncStorage.getItem("snaps:global");
  if (!data) return [];
  const raw = JSON.parse(data);

  const maybeSnaps = await SnapArray.safeParseAsync(raw);
  if (!maybeSnaps.success) {
    console.error(maybeSnaps.error);
    return [];
  }
  return maybeSnaps.data;
}

export async function setSnap(snap: Snap) {
  const snaps = await getSnaps();
  const newSnaps = [snap, ...snaps];
  await AsyncStorage.setItem("snaps:global", JSON.stringify(newSnaps));
}

export async function clearAllSnaps() {
  await AsyncStorage.removeItem("snaps:global");
  await FileSystem.deleteAsync(FileSystem.documentDirectory + "snaps");
}
