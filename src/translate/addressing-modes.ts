import {
    encode as branchOnStatus
} from "./addressing-modes/branch-on-status.ts";
import {
    encode as byteImmediate
} from "./addressing-modes/byte-immediate.ts";
import {
    encode as dataDirect
} from "./addressing-modes/data-direct.ts";
import {
    encode as des
} from "./addressing-modes/des.ts";
import {
    encode as directProgram
} from "./addressing-modes/direct-program.ts";
import {
    encode as implicit
} from "./addressing-modes/implicit.ts";
import {
    encode as indexIndirectOffset
} from "./addressing-modes/index-indirect-offset.ts";
import {
    encode as indexIndirect
} from "./addressing-modes/index-indirect.ts";
import {
    encode as ioBit
} from "./addressing-modes/io-bit.ts";
import {
    encode as ioByte
} from "./addressing-modes/io-byte.ts";
import {
    encode as multiply
} from "./addressing-modes/multiply.ts";
import {
    encode as programMemory
} from "./addressing-modes/program-memory.ts";
import {
    encode as relativeProgram
} from "./addressing-modes/relative-program.ts";
import {
    encode as singleRegisterBit
} from "./addressing-modes/single-register-bit.ts";
import {
    encode as singleRegisterDirect
} from "./addressing-modes/single-register-direct.ts";
import {
    encode as statusManipulation
} from "./addressing-modes/status-manipulation.ts";
import {
    encode as twoRegisterDirect
} from "./addressing-modes/two-register-direct.ts";
import {
    encode as wordDirect
} from "./addressing-modes/word-direct.ts";
import {
    encode as wordImmediate
} from "./addressing-modes/word-immediate.ts";

import type { AddressingMode } from "./translate.ts";

export const addressingModes : Array<AddressingMode> = [
    branchOnStatus,
    byteImmediate,
    dataDirect,
    des,
    directProgram,
    implicit,
    indexIndirectOffset,
    indexIndirect,
    ioBit,
    ioByte,
    multiply,
    programMemory,
    relativeProgram,
    singleRegisterBit,
    singleRegisterDirect,
    statusManipulation,
    twoRegisterDirect,
    wordDirect,
    wordImmediate
] as const;
