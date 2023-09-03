import * as cocossd from "@tensorflow-models/coco-ssd";
import * as tf from "@tensorflow/tfjs";
import {
  ReactNode,
  createContext,
  useCallback,
  useEffect,
  useState,
} from "react";
import { component } from "../rc";

type TensorflowModels = {
  cocossd?: cocossd.ObjectDetection;
};

type TensorflowContextValue = {
  tfReady: boolean;
  models: TensorflowModels;
  setModel: <K extends keyof TensorflowModels>(
    kind: K,
    model: TensorflowModels[K]
  ) => void;
};

export const TensorflowContext = createContext<TensorflowContextValue>(
  {} as any
);

export default component<{ children: ReactNode }>(({ children }) => {
  const [tfReady, setTfReady] = useState(false);
  const [models, setModels] = useState<TensorflowContextValue["models"]>({});

  const setModel = useCallback(
    <K extends keyof TensorflowModels>(kind: K, model: TensorflowModels[K]) => {
      setModels((prev) => ({
        ...prev,
        [kind]: model,
      }));
    },
    [setModels]
  );

  useEffect(() => {
    if (tfReady) return;
    (async () => {
      await tf.ready();
      setTfReady(true);
    })();
  }, [tfReady, setTfReady, setModels]);

  return (
    <TensorflowContext.Provider value={{ tfReady, models, setModel }}>
      {children}
    </TensorflowContext.Provider>
  );
});
