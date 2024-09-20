export * from "./families/attiny-x4.ts";

export const SP = 0x5d; // Stack Pointer ------------------------- IO Address 3D

export const ioEnd = 0x3f;
export const eepromEnd = 0x007f;
export const programEnd = 0x07ff;

export const mappedIoStart = 0x0020;
export const mappedIoEnd = 0x005f;
export const ramStart = 0x0060;
export const ramEnd = 0x00df;
