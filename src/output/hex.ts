import type { GeneratedCode } from "../process/mod.ts";
import { WriteFile } from "./file.ts";
import {
    addBytesToBuffer,
    byteBufferAddress,
    byteBufferHasAtLeast,
    bytePairsFromBuffer,
    isContinuous,
    restartAt
} from "./hex-buffer.ts";
import { addTwoToRecord, newRecord, recordAsString } from "./hex-record.ts";

let dataRecords: Array<string>;

export const newHexFile = () => {
    dataRecords = [];
}

const saveRecordsFromByteBuffer = (minimumRecordSize: 1 | 16) => {
    while (byteBufferHasAtLeast(minimumRecordSize)) {
        newRecord(byteBufferAddress());
        for (const [first, second] of bytePairsFromBuffer()) {
            addTwoToRecord(first, second);
        }
        dataRecords.push(recordAsString());
    }
};

export const codeForHex = (wordAddress: number, code: GeneratedCode) => {
    const newAddress = wordAddress * 2;
    if (!isContinuous(newAddress)) {
        saveRecordsFromByteBuffer(1);
        restartAt(newAddress);
    }
    addBytesToBuffer(code);
    if (byteBufferHasAtLeast(16)) {
        saveRecordsFromByteBuffer(16);
    }
};

export const saveHexFile = (writeFile: WriteFile) => {
    saveRecordsFromByteBuffer(1);
    // extended segment address always zero unless something has more
    // than 64K of flash - bear in mind this applies to the ATMega 1284
    // which I do want to support
    writeFile(":020000020000FC");
    dataRecords.forEach(writeFile);
    writeFile(":00000001FF");
};
