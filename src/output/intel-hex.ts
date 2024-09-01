import type { GeneratedCode } from "../generate/mod.ts";
// twosComplement shouldn't be in operands if it's finding use out here
import { twosComplement } from "../operands/twos-complement.ts";
import type { OutputWriteLine } from "./file.ts";

export const intelHex = () => {
    const recordStash: Array<string> = [];

    const codeStash: Array<number> = [];

    let stashedAddress = 0;

    const hex = (value: number, digits: number) =>
        value.toString(16).toUpperCase().padStart(digits, "0");

    const aRecord = (address: number, bytes: number) => {
        const byteBuffer: Array<string> = [];
        let sum = 0;
        for (let index = 0; index < bytes; index += 2) {
            const first = codeStash.shift()!;
            const second = codeStash.shift()!;
            // Flip 'em over to make 'em big endian!
            byteBuffer.push(hex(second, 2));
            byteBuffer.push(hex(first, 2));
            sum += (first + second);
        }
        const checksum = twosComplement(sum & 0x0f, 8, true);
        return [
            ":",
            hex(bytes, 2), // it's usually 8, 16 or 32 some warez don't like 32
            hex(address, 4), // for more than 64K use extended segment address
            "00", // Data
            byteBuffer.join(""),
            hex(checksum, 2)
        ].join("");
    };

    const saveRecords = (limit: number) => {
        let address = stashedAddress;
        while (codeStash.length > limit) {
            const bytes = Math.min(16, codeStash.length);
            recordStash.push(aRecord(address, bytes));
            address += bytes / 2;
        }
    };

    const add = (address: number, code: GeneratedCode) => {
        const expectedAddress = stashedAddress + codeStash.length / 2;
        if (address != expectedAddress) {
            saveRecords(0);
            stashedAddress = address;
        }
        code.forEach((byte) => codeStash.push(byte));
        if (codeStash.length >= 16) {
            saveRecords(16);
        }
    };

    const save = (writeLine: OutputWriteLine) => {
        // extended segment address always zero unless something has more
        // than 64K of flash - bear in mind this applies to the ATMega 1284
        // which I do want to support
        writeLine(":020000020000FC");
        recordStash.forEach(writeLine);
        writeLine(":00000001FF");
    };

    return { "add": add, "save": save };
};

export type IntelHex = ReturnType<typeof intelHex>;
