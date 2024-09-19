export * from "./families/attiny-x4.ts";

export const SPL = 0x5d; // Stack Pointer ------------------------ IO Address 3D
export const SPH = 0x5e; // Stack Pointer ------------------------ IO Address 3E

export const memory = {
    "ioEnd": 0x3f,
    "eepromEnd": 0x01ff,
    "programEnd": 0x1fff,

    "registersStart": 0x0000,
    "registersEnd": 0x001f,
    "mappedIoStart": 0x0020,
    "mappedIoEnd": 0x005f,
    "ramStart": 0x0060,
    "ramEnd" : 0x025f,
};
