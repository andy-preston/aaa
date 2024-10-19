import { deviceName } from "../context/mod.ts";
import type { GeneratedCode } from "../translate/mod.ts";

// TODO: once context is properly coupled to state, this can go inside
// the dataMemory "constructor" function
let end: number = 0;

// TODO: once context is properly coupled to state, this becomes irrelevant
export const programMemoryBytes = (bytes: number) => {
    end = Math.floor(bytes / 2);
};

export const programMemory = () => {
    let address = 0;

    const origin = (newAddress: number) => {
        if (newAddress == 0) {
            address = 0;
            return;
        }
        if (newAddress < 0) {
            throw new Error("Addresses must be positive");
        }
        deviceName("determine size of Program Memory");
        if (end > 0 && newAddress > end) {
            throw new Error(
                `${newAddress} beyond end of program memory (0x${end.toString(16)})`
            );
        }
        address = newAddress;
    };

    const step = (code: GeneratedCode): void => {
        // Flash addresses are in 16-bit words, not bytes
        address += code.length / 2;
        if (address > end) {
            throw new Error(`Out of program memory (0x${end.toString(16)})`);
        }
    };

    return {
        "end": () => end,
        "address": () => address,
        "origin": origin,
        "step": step
    };
};

export type ProgramMemory = ReturnType<typeof programMemory>;
