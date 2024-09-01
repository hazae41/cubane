export type BytesOrCopiable<T extends Uint8Array = Uint8Array> =
  | T
  | Copiable<T>

export interface Copiable<T extends Uint8Array = Uint8Array> extends Disposable {
  readonly bytes: T
}

export class Copied<T extends Uint8Array = Uint8Array> implements Copiable<T> {

  constructor(
    readonly bytes: T
  ) { }

  [Symbol.dispose]() { }

}

export namespace Copiable {

  export function copyAndDispose(copiable: Copiable): Uint8Array {
    using _ = copiable

    return copiable.bytes.slice()
  }

}