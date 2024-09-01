import type { GeneratedCode } from "../generate/mod.ts";
import { checkSum } from "./checkSum.ts";
import type { OutputWriteLine } from "./file.ts";

export const intelHex = () => {
    const records: Array<string> = [];

    const byteBuffer: Array<number> = [];

    let address = 0;

    const hex = (value: number, digits: number) =>
        value.toString(16).toUpperCase().padStart(digits, "0");

    const aRecord = (bytes: number) => {
        const check = checkSum(address, bytes);
        const recordBytes: Array<string> = [];
        for (let index = 0; index < bytes; index += 2) {
            const first = byteBuffer.shift()!;
            check.byte(first);
            const second = byteBuffer.shift()!;
            check.byte(second);
            // Flip 'em over to make 'em big endian!
            recordBytes.push(hex(second, 2));
            recordBytes.push(hex(first, 2));
        }
        return [
            ":",
            hex(bytes, 2), // it's usually 8, 16 or 32 some warez don't like 32
            hex(address, 4), // for > 64K use extended segment address
            "00", // Data record type
            recordBytes.join(""),
            hex(check.sum(), 2)
        ].join("");
    };

    const saveRecords = (limit: number) => {
        while (byteBuffer.length > limit) {
            const bytes = Math.min(16, byteBuffer.length);
            records.push(aRecord(bytes));
            address += bytes;
        }
    };

    const add = (wordAddress: number, code: GeneratedCode) => {
        const newByteAddress = wordAddress * 2;
        const expectedAddress = address + byteBuffer.length;
        if (newByteAddress != expectedAddress) {
            saveRecords(0);
            address = newByteAddress;
        }
        code.forEach((byte) => byteBuffer.push(byte));
        if (byteBuffer.length >= 16) {
            saveRecords(16);
        }
    };

    const save = (writeLine: OutputWriteLine) => {
        saveRecords(0);
        // extended segment address always zero unless something has more
        // than 64K of flash - bear in mind this applies to the ATMega 1284
        // which I do want to support
        writeLine(":020000020000FC");
        records.forEach(writeLine);
        writeLine(":00000001FF");
    };

    return { "add": add, "save": save };
};

export type IntelHex = ReturnType<typeof intelHex>;
