import { Readable } from "@hazae41/binary";

export type ReadOutputs<T extends readonly Readable[]> = {
  readonly [Index in keyof T]: Readable.ReadOutput<T[Index]>
}