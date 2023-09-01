/**
 * Create a React native component
 */
export function component<T extends () => JSX.Element | null>(fn: T): T {
  return fn;
}
