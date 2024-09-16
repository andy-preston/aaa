// cSpell:words gavr

import { allInstructions } from "./all-instructions.ts";
import { list } from "./list.ts";

const theList = list();

const allChips = async () => {
    const command = new Deno.Command("gavrasm", {
        "args": [ "-T" ],
        "stdin": "piped",
        "stdout": "piped",
        "stderr": "null"
    });
    const assembler = command.spawn();
    await assembler.stdin.close();
    const { stdout } = await assembler.output();
    const list = new TextDecoder().decode(stdout).split("\n").filter(
        (line): boolean => /^\d/.test(line.trim())
    ).map(
        (line): string => line.trim().split(/\s+/)[1]!
    );
    list.sort();
    return list;
}

const testFile = "/var/tmp/test.asm";

const gavrAssembler = (chip: string, instruction: string) => {
    Deno.writeTextFileSync(testFile, `.device ${chip}\n${instruction}\n`);
    const command = new Deno.Command("gavrasm", {
        "args": [ testFile ],
        "stdin": "null",
        "stdout": "piped",
        "stderr": "piped"
    });
    const stdout = command.outputSync().stdout;
    return new TextDecoder().decode(stdout).split("\n");
};

const specificIndex = (modelInstruction: string) => {
    const split = modelInstruction.split(/[,\s]/);
    if (split.length > 1) {
        const lastBit = split.pop();
        if (lastBit!.includes("Z")) {
            return lastBit;
        }
    }
    return "";
};

const theseMatch = (modelInstruction: string, mnemonic: string) =>
    modelInstruction == mnemonic ||
    (["LD", "ST"].includes(mnemonic) && modelInstruction == "LD/ST");

const doSomethingAbout = (chip: string, instruction: string, error: string) => {
    const mnemonic = instruction.split(" ")[0]!;
    if (error.includes("Illegal instruction") && error.includes("device type")) {
        const detail = error.match(/\((.*?)\)/)![1]!;
        if (theseMatch(detail, mnemonic)) {
            theList.add(chip, mnemonic);
            return;
        }
        const index = specificIndex(detail);
        if (index != "") {
            theList.add(chip, `${mnemonic}.${index}`);
            return;
        }
    }
    if (error.includes("Code segment") && error.includes("exceeds limit")) {
        ////////////////////////////////////////////////////////////////////////
        //
        // TODO: I have no idea what on Earth this is about!
        //
        ////////////////////////////////////////////////////////////////////////
        return;
    }
    throw new Error(`Unhandled error: ${chip} ${instruction} ${error}`);
};

for (const chip of await allChips()) {
    console.log(chip);
    for (const instruction of allInstructions) {
        const messages = gavrAssembler(chip, instruction);
        for (const message of messages) {
            if (message.includes(`[${testFile}`)) {
                doSomethingAbout(chip, instruction, message);
            }
        }
    }
}
Deno.writeTextFileSync(
    "./build/instruction-sets/gavrasm-specs.json",
    theList.json()
);
