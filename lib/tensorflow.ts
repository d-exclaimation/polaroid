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
  const { tfReady, cocossd } = useContext(TensorflowContext);

  const detect = useCallback(
    async (
      img:
        | tf.Tensor3D
        | ImageData
        | HTMLImageElement
        | HTMLCanvasElement
        | HTMLVideoElement,
      maxNumBoxes?: number,
      minScore?: number
    ) => {
      const model = await cocossd();
      return model.detect(img, maxNumBoxes, minScore);
    },
    [cocossd]
  );

  const dispose = useCallback(
    (...args: Parameters<typeof tf.dispose>) => tf.dispose(...args),
    []
  );

  return { ready: tfReady && !!cocossd, detect, dispose };
}
