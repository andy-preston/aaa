import { ImportDeclaration, Project, SourceFile } from "ts_morph";

const cwd = `${Deno.cwd()}/src`;

const shortPath = (path: string) => path.replace(cwd, "");

const importsFromDeclaration = function* (
    importingFile: string,
    importingDirectory: string,
    importDeclaration: ImportDeclaration
): Generator<[string, string, string], void, unknown> {
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
            yield* importsFromDeclaration(
                importingFile,
                importingDirectory,
                importDeclaration
            );
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

type IdentifierMap = Map<string, Array<string>>;

const groups: IdentifierMap = new Map();
const relationships: IdentifierMap = new Map();
const labels: Map<string, string> = new Map();

const addToMap = (map: IdentifierMap, file: string, identifier: string) => {
    if (!map.has(file)) {
        map.set(file, [identifier]);
    } else {
        const identifiers = map.get(file)!;
        if (!identifiers.includes(identifier)) {
            identifiers.push(identifier);
        }
    }
};

const addLabel = (qualifiedIdentifier: string, label: string) => {
    if (!labels.has(qualifiedIdentifier)) {
        labels.set(qualifiedIdentifier, label);
    }
}

const nameForGraph = (fileName: string) =>
    `_${fileName.replace(/^\//, "").replace(/[\/\.]/g, "_")}`;

const labelFor = (identifier: string) =>
    labels.has(identifier) ? labels.get(identifier) : identifier;

for (const anImport of allImports()) {
    const [importingFile, importedFile, identifierLabel] = anImport;

    const identifierGroup = nameForGraph(importedFile);
    const qualifiedIdentifier =
        `${identifierGroup}.${nameForGraph(identifierLabel)}`;
    addLabel(qualifiedIdentifier, identifierLabel);
    addToMap(groups, identifierGroup, qualifiedIdentifier);

    const sourceOfImport = nameForGraph(importingFile);
    addLabel(sourceOfImport, importingFile);
    addToMap(relationships, sourceOfImport, qualifiedIdentifier);
}

const encoder = new TextEncoder();

const d2File = Deno.openSync("graph.d2", {
    create: true,
    write: true,
    truncate: true
});

const write = (output: string) => {
    d2File.writeSync(encoder.encode(`${output}\n`));
}

write("direction: right");
for (const [group, identifiers] of groups) {
    write(`${group}: ${labelFor(group)}`);
    for (const identifier of identifiers) {
        write(`${identifier}: ${labelFor(identifier)}`);
    }
}
for (const [source, identifiers] of relationships) {
    for (const identifier of identifiers) {
        if (!groups.has(source)) {
            write(`${source}: ${labelFor(source)}`);
        }
        write(`${source} -> ${identifier}`);
    }
}
d2File.close();
