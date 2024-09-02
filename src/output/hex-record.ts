export const record = (address: number, recordSize: number) => {
    const dataBytes: Array<string> = [];

    const dataRecordType = "00";

    const hex = (value: number, digits: number) =>
        value.toString(16).toUpperCase().padStart(digits, "0");

    const addTwo = (first: number, second: number) => {
        // Flip 'em over to make 'em big endian!
        dataBytes.push(hex(second, 2));
        dataBytes.push(hex(first, 2));
    };

    const asString = (checksum: number) =>
        [
            ":",
            hex(recordSize, 2), // usually 8, 16 or 32 some warez don't like 32
            hex(address, 4), // for > 64K use extended segment address
            dataRecordType,
            dataBytes.join(""),
            hex(checksum, 2)
        ].join("");

    return {
        "addTwo": addTwo,
        "asString": asString
    };
};
