export const outputFile = (fileName: string, extension: string) => {
    const encoder = new TextEncoder();

    const theFile = Deno.openSync(
        fileName.substring(0, fileName.lastIndexOf(".")) + extension,
        { create: true, write: true, truncate: true }
    );

    return {
        "writeLine": (text: string) =>
            theFile.writeSync(encoder.encode(`${text}\n`)),
        "close": () => theFile.close()
    };
};

export type OutputFile = ReturnType<typeof outputFile>;
