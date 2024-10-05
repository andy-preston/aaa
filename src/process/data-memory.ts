import { deviceName } from "../context/mod.ts";

let startAddress: number;
let endAddress: number;
let stackSize: number;
let allocated: number;

const available = (): number =>
    endAddress - startAddress - stackSize - allocated;

const allocationCheck = (bytes: number) => {
    if (bytes == 0) {
        return;
    }
    if (bytes < 0) {
        throw new Error("Allocations must be positive");
    }
    deviceName("determine size of Data Memory");
    if (bytes > available()) {
        throw new Error(
            `Can't allocate ${bytes} bytes in SRAM, there are only ${available()} available`
        );
    }
};

export const resetDataMemory = () => {
    stackSize = 0;
    allocated = 0;
};

export const newDataMemory = () => {
    startAddress = 0;
    endAddress = 0;
    resetDataMemory();
};

export const setRamStart = (address: number) => {
    startAddress = address;
};

export const setRamEnd = (address: number) => {
    endAddress = address;
};

export const ramStart = (): number => startAddress;

export const ramEnd = (): number => endAddress;

export const allocStack = (bytes: number) => {
    // It's entirely optional to allocate space for a stack.
    // but you can if you're worried that your RAM allocations might eat up
    // all the space.
    if (stackSize != 0) {
        throw new Error("Stack already allocated");
    }
    allocationCheck(bytes);
    stackSize = bytes;
};

export const alloc = (bytes: number): number => {
    allocationCheck(bytes);
    const address = startAddress + allocated;
    allocated += bytes;
    return address;
};
