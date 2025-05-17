import { Cursor } from "@hazae41/cursor";

export abstract class AbstractVerifyingKey<T> {

  abstract sizeOrThrow(): 65

  abstract writeOrThrow(cursor: Cursor): void

  abstract intoOrThrow(): T

  /**
   * @deprecated
   */
  abstract toJSON(): unknown

}