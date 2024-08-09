import { encode as branchOnStatus } from "./BranchOnStatus.ts";
import { encode as byteImmediate } from "./ByteImmediate.ts";
import { encode as des } from "./DES.ts";
import { encode as dataDirect } from "./DataDirect.ts";
import { encode as directProgram } from "./DirectProgram.ts";
import { encode as iOBit } from "./IOBit.ts";
import { encode as iOByte } from "./IOByte.ts";
import { encode as implicit } from "./Implicit.ts";
import { encode as indexIndirect } from "./IndexIndirect.ts";
import { encode as multiply } from "./Multiply.ts";
import { encode as relativeProgram } from "./RelativeProgram.ts";
import { encode as singleRegisterBit } from "./SingleRegisterBit.ts";
import { encode as singleRegisterDirect } from "./SingleRegisterDirect.ts";
import { encode as statusManipulation } from "./StatusManipulation.ts";
import { encode as twoRegisterDirect } from "./TwoRegisterDirect.ts";
import { encode as wordDirect } from "./WordDirect.ts";
import { encode as wordImmediate } from "./WordImmediate.ts";

export const addressingModes = [
    branchOnStatus,
    byteImmediate,
    des,
    dataDirect,
    directProgram,
    iOBit,
    iOByte,
    implicit,
    indexIndirect,
    multiply,
    relativeProgram,
    singleRegisterBit,
    singleRegisterDirect,
    statusManipulation,
    twoRegisterDirect,
    wordDirect,
    wordImmediate
];
