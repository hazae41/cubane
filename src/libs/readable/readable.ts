import { Readable } from "@hazae41/binary";

export type ReadOutputs<T extends readonly Readable[]> = {
  [Index in keyof T]: Readable.ReadOutput<T[Index]>
}