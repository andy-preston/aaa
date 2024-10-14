import type { CodeBlock } from "../translate/mod.ts";
import type { FileWrite } from "./file.ts";
import { hexBuffer } from "./hex-buffer.ts";
import { hexRecord } from "./hex-record.ts";

const programMemoryAddressInBytes = (programMemoryAddress: number): number =>
    programMemoryAddress * 2;

export const newHexFile = () => {
    const dataRecords: Array<string> = [];
    const buffer = hexBuffer();

    const codeBlock = (block: CodeBlock) => {
        const newAddress = programMemoryAddressInBytes(block.address);
        if (!buffer.isContinuous(newAddress)) {
            saveRecordsFromByteBuffer(1);
            buffer.restartAt(newAddress);
        }
        buffer.add(block.code);
        if (buffer.hasAtLeast(16)) {
            saveRecordsFromByteBuffer(16);
        }
    };

    const saveRecordsFromByteBuffer = (minimumRecordSize: 1 | 16) => {
        while (buffer.hasAtLeast(minimumRecordSize)) {
            const record = hexRecord(buffer.address());
            buffer.pairs().forEach(record.add);
            dataRecords.push(record.asString());
        }
    };

    const save = (write: FileWrite) => {
        saveRecordsFromByteBuffer(1);
        // extended segment address always zero unless something has more
        // than 64K of flash - bear in mind this applies to the ATMega 1284
        // which I do want to support
        write(":020000020000FC");
        dataRecords.forEach(write);
        write(":00000001FF");
    };

    return {
        "codeBlock": codeBlock,
        "save": save
    };
}

export type Hex = ReturnType<typeof newHexFile>;
