import { Readable, Writable } from "@hazae41/binary";

export interface Instance extends Writable<Error, Error> {
  dynamic?: boolean
}

export interface Type extends Readable<Instance, Error> {
  dynamic?: boolean
}