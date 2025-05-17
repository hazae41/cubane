import { Cursor } from "@hazae41/cursor";

export abstract class AbstractVerifyingKey {

  abstract sizeOrThrow(): number

  abstract writeOrThrow(cursor: Cursor): void

  abstract intoOrThrow(): unknown

  /**
   * @deprecated
   */
  abstract toJSON(): unknown

}