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

type OutputFile = ReturnType<typeof outputFile>;

export type OutputWriteLine = OutputFile["writeLine"];
