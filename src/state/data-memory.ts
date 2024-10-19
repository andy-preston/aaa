import type { DeviceProperties } from "./mod.ts"; // mod = public

export const dataMemory = (properties: DeviceProperties) => {
    let ramStart = 0;
    let ramEnd = 0;
    let stack = 0;
    let allocated = 0;

    const ramAvailable = (): number => ramEnd - ramStart - stack - allocated;

    const allocationCheck = (bytes: number) => {
        if (bytes == 0) {
            return;
        }
        if (bytes < 0) {
            throw new Error("Allocations must be positive");
        }
        properties.name("determine size of SRAM");
        const available = ramAvailable();
        if (bytes > available) {
            throw new Error(
                `Can't allocate ${bytes} bytes in SRAM, there are only ${available} available`
            );
        }
    };

    const reset = () => {
        stack = 0;
        allocated = 0;
    };

    const allocStack = (bytes: number) => {
        // It's entirely optional to allocate space for a stack.
        // but you can if you're worried that your RAM allocations might eat up
        // all the space.
        if (stack != 0) {
            throw new Error("Stack already allocated");
        }
        allocationCheck(bytes);
        stack = bytes;
    };

    const alloc = (bytes: number): number => {
        allocationCheck(bytes);
        const address = ramStart + allocated;
        allocated += bytes;
        return address;
    };

    const setRamStart = (value: number) => {
        ramStart = value;
    };

    const setRamEnd = (value: number) => {
        ramEnd = value;
    };

    return {
        "reset": reset,
        "ramStart": setRamStart,
        "ramEnd": setRamEnd,
        "public": {
            "ramStart": () => ramStart,
            "ramEnd": () => ramEnd,
            "allocStack": allocStack,
            "alloc": alloc
        }
    };
};

export type DataMemory = ReturnType<typeof dataMemory>;
