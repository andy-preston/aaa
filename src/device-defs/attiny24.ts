export * from "./families/attiny-x4.ts";

export const SP = 0x5d; // Stack Pointer ------------------------- IO Address 3D

export const memory = {
    "ioEnd": 0x3f,
    "eepromEnd": 0x007f,
    "programEnd": 0x07ff,

    "registersStart": 0x0000,
    "registersEnd": 0x001f,
    "mappedIoStart": 0x0020,
    "mappedIoEnd": 0x005f,
    "ramStart": 0x0060,
    "ramEnd" : 0x00df,
};
