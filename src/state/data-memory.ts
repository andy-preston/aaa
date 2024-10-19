import { deviceName } from "../context/mod.ts";

// TODO: once context is properly coupled to state, these can go inside
// the dataMemory "constructor" function
let ramStart = 0;
let ramEnd = 0;

// TODO: once context is properly coupled to state, this becomes irrelevant
export const setRamStart = (address: number) => {
    ramStart = address;
};

// TODO: once context is properly coupled to state, this becomes irrelevant
export const setRamEnd = (address: number) => {
    ramEnd = address;
};

export const dataMemory = () => {
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
        deviceName("determine size of SRAM");
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

    return {
        "reset": reset,
        "public": {
            "ramStart": () => ramStart,
            "ramEnd": () => ramEnd,
            "allocStack": allocStack,
            "alloc": alloc
        }
    };
};
