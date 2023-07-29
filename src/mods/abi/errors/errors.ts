import { BinaryReadError } from "@hazae41/binary";
import { InvalidBoolValueError } from "../types/bool/bool.js";

export type DecodingError =
  | BinaryReadError
  | InvalidBoolValueError