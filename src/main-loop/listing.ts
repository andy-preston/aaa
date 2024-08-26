import { GeneratedCode } from "../generate/mod.ts";

export const newListing = (topFileName: string) => {
    const encoder = new TextEncoder();

    let currentFileName = "";

    const theFile = Deno.openSync(
        topFileName.substring(0, topFileName.lastIndexOf(".")) + ".lst",
        { create: true, write: true, truncate: true}
    );

    const writeLine = (text: string) => {
        theFile.writeSync(encoder.encode(`${text}\n`));
    };

    const listFileName = (name: string) => {
        if (name != currentFileName) {
            writeLine(`\n${name}\n${"=".repeat(name.length)}\n`);
            currentFileName = name;
        }
    };

    const close = () => theFile.close();

    const line = (
        sourceFile: string,
        lineNumber: number,
        address: number,
        generatedCode: GeneratedCode,
        source: string,
        errorMessage: string,
    ) => {
        listFileName(sourceFile);
        const lineNumberString = `${lineNumber + 1}`.padStart(4, " ");
        const addressString = address.toString(16).padStart(5, "0").toUpperCase();
        const object = generatedCode.map(
            (byte) => byte.toString(16).padStart(2, "0")
        ).join(" ").padEnd(11, " ").toUpperCase();
        writeLine(`${addressString} ${object} ${lineNumberString} ${source}`);
        if (errorMessage != "") {
            writeLine(`${">".repeat(17)} ${lineNumberString} ${errorMessage}`);
        }
    };

    return {"line": line, "close": close};
};
