let dataBytes: Array<string>;

let address: number;

let checksumTotal: number;

const dataRecordType = "00";

const hex = (value: number, digits: number) =>
    value.toString(16).toUpperCase().padStart(digits, "0");

// https://en.wikipedia.org/wiki/Intel_HEX
const checksum = () =>
    0x0100 - ((checksumTotal + dataBytes.length) & 0xff);

export const newRecord = (startAddress: number) => {
    dataBytes = [];
    address = startAddress;
    checksumTotal = (address & 0xff) + ((address & 0xff00) >> 8);
}

export const addTwoToRecord = (first: number, second: number) => {
    checksumTotal = checksumTotal + first + second;
    // Flip 'em over to make 'em big endian!
    dataBytes.push(hex(second, 2));
    dataBytes.push(hex(first, 2));
};

export const recordAsString = () => [
    ":",
    hex(dataBytes.length, 2), // usually 8, 16 or 32 some warez don't like 32
    hex(address, 4), // for > 64K use extended segment address
    dataRecordType,
    dataBytes.join(""),
    hex(checksum(), 2)
].join("");
