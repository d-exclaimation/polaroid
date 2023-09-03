import { useQuery } from "@tanstack/react-query";
import * as cocossd from "@tensorflow-models/coco-ssd";
import * as tf from "@tensorflow/tfjs";
import { ReactNode, createContext } from "react";
import { component } from "../rc";

type TensorflowContextValue = {
  tfReady: boolean;
  cocossd: () => Promise<cocossd.ObjectDetection>;
};

export const TensorflowContext = createContext<TensorflowContextValue>(
  {} as any
);

export default component<{ children: ReactNode }>(({ children }) => {
  const { isSuccess: tfReady } = useQuery({
    queryKey: ["tensorflow", "initial"],
    queryFn: async () => {
      await tf.ready();
      return {};
    },
    retry: false,
    retryOnMount: false,
    staleTime: Infinity,
    cacheTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
  const { data: cocossdModel, refetch: loadCocossd } = useQuery({
    queryKey: ["tensorflow", "cocossd"],
    queryFn: async () => {
      const model = await cocossd.load();
      return model;
    },
    enabled: false,
    retry: false,
    retryOnMount: false,
    staleTime: Infinity,
    cacheTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  return (
    <TensorflowContext.Provider
      value={{
        tfReady,
        cocossd: async () => {
          if (cocossdModel) {
            return cocossdModel;
          }
          const res = await loadCocossd();
          if (res.isError) throw res.error;
          return res.data!;
        },
      }}
    >
      {children}
    </TensorflowContext.Provider>
  );
});
