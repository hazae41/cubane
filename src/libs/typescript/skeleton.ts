export type Skeleton<T> = {
  [K in keyof T]?: unknown
}