import { encode as branchOnStatus } from "./branch-on-status.ts";
import { encode as byteImmediate } from "./byte-immediate.ts";
import { encode as dataDirect } from "./data-direct.ts";
import { encode as des } from "./des.ts";
import { encode as directProgram } from "./direct-program.ts";
import { encode as implicit } from "./implicit.ts";
import { encode as indexIndirectOffset } from "./index-indirect-offset.ts";
import { encode as indexIndirect } from "./index-indirect.ts";
import { encode as iOBit } from "./io-bit.ts";
import { encode as iOByte } from "./io-byte.ts";
import { encode as multiply } from "./multiply.ts";
import { encode as programMemory } from "./program-memory.ts";
import { encode as relativeProgram } from "./relative-program.ts";
import { encode as singleRegisterBit } from "./single-register-bit.ts";
import { encode as singleRegisterDirect } from "./single-register-direct.ts";
import { encode as statusManipulation } from "./status-manipulation.ts";
import { encode as twoRegisterDirect } from "./two-register-direct.ts";
import { encode as wordDirect } from "./word-direct.ts";
import { encode as wordImmediate } from "./word-immediate.ts";

export const addressingModes = [
    branchOnStatus,
    byteImmediate,
    dataDirect,
    des,
    directProgram,
    implicit,
    indexIndirectOffset,
    indexIndirect,
    iOBit,
    iOByte,
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
