import { Cursor } from "@hazae41/cursor";

export abstract class AbstractSignature {

  abstract sizeOrThrow(): number

  abstract writeOrThrow(cursor: Cursor): void

  abstract intoOrThrow(): unknown

  /**
   * @deprecated
   */
  abstract toJSON(): unknown

}