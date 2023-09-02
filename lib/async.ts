import { useCallback, useState } from "react";

export function useLoading(initial: boolean = false) {
  const [loading, setLoading] = useState(initial);
  const start = useCallback(
    <T extends () => Promise<void>>(action: T) => {
      setLoading(true);
      action().finally(() => setLoading(false));
    },
    [setLoading]
  );
  const complete = useCallback(() => setLoading(true), [setLoading]);
  const clear = useCallback(() => setLoading(false), [setLoading]);
  const reset = useCallback(() => setLoading(initial), [setLoading, initial]);

  return { loading, start, complete, reset, clear };
}
