import { ReactNode, createContext, useContext, useState } from "react";

export type Photo = {
  uri: string;
  width: number;
  height: number;
};
export const PhotoContext = createContext<{
  photo: Photo | undefined;
  setPhoto: (photo: Photo) => void;
}>(null as any);

export function usePhoto() {
  const { photo, setPhoto } = useContext(PhotoContext);
  return { photo, setPhoto };
}

export function PhotoProvider({ children }: { children: ReactNode }) {
  const [photo, setPhoto] = useState<Photo | undefined>(undefined);
  return (
    <PhotoContext.Provider
      value={{
        photo,
        setPhoto,
      }}
    >
      {children}
    </PhotoContext.Provider>
  );
}
