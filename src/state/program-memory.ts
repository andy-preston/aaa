import { NumericError, ProgramMemoryUnavailable } from "../errors/errors.ts";
import type { GeneratedCode } from "../translate/mod.ts";
import type { DeviceProperties } from "./mod.ts"; // mod = public interface

export const programMemory = (properties: DeviceProperties) => {
    let address = 0;
    let end = 0;

    const origin = (newAddress: number) => {
        if (newAddress == 0) {
            address = 0;
            return;
        }
        if (newAddress < 0) {
            throw new NumericError(newAddress, ">= 0");
        }
        properties.name("determine size of Program Memory");
        if (end > 0 && newAddress > end) {
            throw new ProgramMemoryUnavailable(newAddress, end);
        }
        address = newAddress;
    };

    const step = (code: GeneratedCode): void => {
        // Flash addresses are in 16-bit words, not bytes
        address += code.length / 2;
        if (end > 0 && address > end ) {
            throw new ProgramMemoryUnavailable(undefined, end);
        }
    };

    const setBytes = (bytes: number) => {
        end = Math.floor(bytes / 2);
    };

    return {
        "bytes": setBytes,
        "public": {
            "end": () => end,
            "address": () => address,
            "origin": origin,
            "step": step
        }
    };
};

export type ProgramMemory = ReturnType<typeof programMemory>;
