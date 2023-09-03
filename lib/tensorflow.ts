import * as od from "@tensorflow-models/coco-ssd";
import * as tf from "@tensorflow/tfjs";
import { useCallback, useContext } from "react";
import { TensorflowContext } from "./context/tensorflow-provider";

export function useTensorflow() {
  const { tfReady } = useContext(TensorflowContext);

  const dispose = useCallback(
    (...args: Parameters<typeof tf.dispose>) => tf.dispose(...args),
    []
  );

  return { ready: tfReady, dispose };
}

export function useCocoSsd() {
  const {
    tfReady,
    models: { cocossd },
    setModel,
  } = useContext(TensorflowContext);

  const detect = useCallback(
    async (...args: Parameters<NonNullable<typeof cocossd>["detect"]>) => {
      console.log("Loading coco-ssd model (from cache or creating new)...");
      const model = cocossd ?? (await od.load());
      console.log("Loaded coco-ssd model.");
      if (!cocossd) {
        setModel("cocossd", model);
      }
      return model.detect(...args);
    },
    [cocossd, setModel]
  );

  const dispose = useCallback(
    (...args: Parameters<typeof tf.dispose>) => tf.dispose(...args),
    []
  );

  return { ready: tfReady, detect, dispose };
}
