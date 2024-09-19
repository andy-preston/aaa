export * from "./families/attiny-x4.ts";

export const SPL = 0x5d; // Stack Pointer ------------------------ IO Address 3D
export const SPH = 0x5e; // Stack Pointer ------------------------ IO Address 3E

export const ioEnd = 0x3f;
export const eepromEnd = 0x01ff;
export const programEnd = 0x1fff;

export const mappedIoStart = 0x0020;
export const mappedIoEnd = 0x005f;
export const ramStart = 0x0060;
export const ramEnd = 0x025f;
