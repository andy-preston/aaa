import { GeneratedCode } from "../generate/mod.ts";

export const newListing = () => {
    const listing: Array<Array<string>> = [];

    const longestSizes: Map<string, number> = new Map();

    const longest = (name: string, check: number) => {
        const existing = longestSizes.get(name);
        if (existing == undefined || check > existing) {
            longestSizes.set(name, check);
        }
    };

    const padded = (rawString: string | undefined, name: string) => {
        const length = longestSizes.get(name);
        const column = rawString == undefined ? "" : rawString;
        return column.padStart(length == undefined ? 0 : length, " ");
    };

    const codeString = (code: GeneratedCode): string =>
        code.map((byte) => byte.toString(16).padStart(2, "0"))
            .join(" ")
            .padEnd(10, " ");

    const add = (
        sourceFile: string,
        lineNumber: number,
        address: number,
        generatedCode: GeneratedCode,
        source: string,
        errorMessage: string,
    ) => {
        longest("sourceFile", sourceFile.length);
        const lineNumberString = `${lineNumber + 1}`;
        longest("lineNumber", lineNumberString.length);
        const addressString = address.toString(16);
        longest("address", addressString.length);
        const line = [
            sourceFile,
            lineNumberString,
            addressString,
            codeString(generatedCode),
            source,
            errorMessage,
        ];
        listing.push(line);
    }

    const write = (_fileName: string) => {
        for (const line of listing) {
            const file = padded(line.shift(), "sourceFile");
            const lineNumber = padded(line.shift(), "lineNumber");
            const address = padded(line.shift(), "address");
            const [object, source, errorMessage] = line;
            const error = errorMessage ? `\n${errorMessage}` : "";
            console.log(`${file} ${lineNumber} ${address} ${object} ${source}`);
            if (error != "") {
                console.log(error);
            }
        }
    };

    return {"add": add, "write": write};
};
