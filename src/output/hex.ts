import type { GeneratedCode } from "../generate/mod.ts";
import type { OutputWriteLine } from "./file.ts";
import { byteBuffer } from "./hex-buffer.ts";
import { checksum } from "./hex-checksum.ts";
import { record } from "./hex-record.ts";

export const intelHex = () => {
    const dataRecords: Array<string> = [];

    const bytes = byteBuffer(0);

    const saveRecords = (limit: number) => {
        while (bytes.has(limit)) {
            const recordSize = bytes.recordSize();
            const baseAddress = bytes.baseAddress();
            const check = checksum(baseAddress, recordSize);
            const theRecord = record(baseAddress, recordSize);
            for (let index = 0; index < recordSize; index += 2) {
                const [first, second] = bytes.getTwo();
                check.byte(first);
                check.byte(second);
                theRecord.addTwo(first, second);
            }
            dataRecords.push(theRecord.asString(check.sum()));
        }
    };

    const add = (wordAddress: number, code: GeneratedCode) => {
        const newAddress = wordAddress * 2;
        if (!bytes.isContinuous(newAddress)) {
            saveRecords(1);
            bytes.restartAt(newAddress);
        }
        bytes.add(code);
        if (bytes.has(16)) {
            saveRecords(16);
        }
    };

    const save = (writeLine: OutputWriteLine) => {
        saveRecords(1);
        // extended segment address always zero unless something has more
        // than 64K of flash - bear in mind this applies to the ATMega 1284
        // which I do want to support
        writeLine(":020000020000FC");
        dataRecords.forEach(writeLine);
        writeLine(":00000001FF");
    };

    return { "add": add, "save": save };
};

export type IntelHex = ReturnType<typeof intelHex>;
