import type { GeneratedCode } from "../generate/mod.ts";

let address = 0;
let end = Math.floor(0xffff / 2);

export const programMemoryOrigin = (newAddress: number) => {
    if (newAddress < 0) {
        throw new Error("Addresses must be positive");
    }
    if (newAddress > end) {
        throw new Error(`${newAddress} beyond programEnd (${end})`);
    }
    address = newAddress;
};

export const setProgramMemoryEnd = (bytes: number) => {
    end = Math.floor(bytes / 2);
};

export const getProgramMemoryEnd = function() {
    return end;
};

export const programMemoryAddress = () => address;

export const programMemoryStep = (code: GeneratedCode): void => {
    // Flash addresses are in 16-bit words, not bytes
    address += code.length / 2;
};
