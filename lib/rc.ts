import type { FC } from "react";

/**
 * Create a React native component
 */
export function component<T = {}>(fn: (props: T) => JSX.Element | null): FC<T> {
  return fn;
}
