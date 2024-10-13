import { deviceName } from "../context/mod.ts";
import type { GeneratedCode } from "../generate/mod.ts";

let address: number = 0;
let end: number = 0;

export const programMemoryOrigin = (newAddress: number) => {
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

export const programMemoryBytes = (bytes: number) => {
    end = Math.floor(bytes / 2);
};

export const programMemoryEnd = () => end;

export const programMemoryAddress = () => address;

export const programMemoryStep = (code: GeneratedCode): void => {
    // Flash addresses are in 16-bit words, not bytes
    address += code.length / 2;
    if (address > end) {
        throw new Error(`Out of program memory (0x${end.toString(16)})`);
    }
};
