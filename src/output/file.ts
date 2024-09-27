const encoder = new TextEncoder();

let theFile: Deno.FsFile;

export const openFile = (fileName: string, extension: string) => {
    theFile = Deno.openSync(
        fileName.substring(0, fileName.lastIndexOf(".")) + extension,
        { create: true, write: true, truncate: true }
    );
};

export const writeFile = (text: string) => {
    theFile.writeSync(encoder.encode(`${text}\n`));
};

export const closeFile = () => {
    theFile.close();
};

export type WriteFile = typeof writeFile;
