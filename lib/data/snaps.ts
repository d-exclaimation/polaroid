import AsyncStorage from "@react-native-async-storage/async-storage";
import { z } from "zod";

export type Snap = z.infer<typeof Snap>;

export const Snap = z.object({
  id: z.string(),
  createdAt: z.coerce.date(),
  kind: z.enum(["regular", "pic", "fav", "achieve"]),
  image: z.object({
    uri: z.string(),
    width: z.number(),
    height: z.number(),
  }),
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
