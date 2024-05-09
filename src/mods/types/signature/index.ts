import { Uint8Array } from "@hazae41/bytes"

export interface RsvSignatureInit {
  readonly r: Uint8Array<32>
  readonly s: Uint8Array<32>
  readonly v: number
}

export class RsvSignature {

  constructor(
    readonly r: Uint8Array<32>,
    readonly s: Uint8Array<32>,
    readonly v: number
  ) { }

  static from(init: RsvSignatureInit): RsvSignature {
    return new RsvSignature(init.r, init.s, init.v)
  }

}

