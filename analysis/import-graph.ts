import { ImportDeclaration, Project, SourceFile } from "ts_morph";

const cwd = `${Deno.cwd()}/src/`;

const shortPath = (path: string) => path.replace(cwd, "");

const importsFromDeclaration = function* (
    importingFile: string,
    importingDirectory: string,
    importDeclaration: ImportDeclaration
) {
    const importedFile = importDeclaration.getModuleSpecifierValue();
    const adjustedFile = importedFile.startsWith("./")
        ? importedFile.replace("./", importingDirectory)
        : importedFile.replace("../", "");
    for (const namedImport of importDeclaration.getNamedImports()) {
        const importedName = namedImport.getName();
        yield [importingFile, adjustedFile, importedName];
    }
};

const importsFromSource = function* (sourceFile: SourceFile) {
    const importingFile = shortPath(sourceFile.getFilePath());
    if (!importingFile.endsWith(".test.ts")) {
        const importingDirectory =
            `${shortPath(sourceFile.getDirectoryPath())}/`;
        for (const importDeclaration of sourceFile.getImportDeclarations()) {
            yield* importsFromDeclaration(importingFile, importingDirectory, importDeclaration);
        }
    }
};

const allImports = function* () {
    const project = new Project();
    project.addSourceFilesAtPaths("./src/**/*.ts");
    for (const sourceFile of project.getSourceFiles()) {
        yield* importsFromSource(sourceFile);
    }
};

for(const anImport of allImports()) {
    console.log(anImport);
}
