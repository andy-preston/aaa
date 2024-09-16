// cSpell:words mcus

import { allInstructions } from "./all-instructions.ts";

const allMcus = () => {
    const command = new Deno.Command("avr-as", {
        "args": [ "--help" ],
        "stdin": "null",
        "stdout": "piped",
        "stderr": "null"
    });
    const { stdout } = command.outputSync();
    const [symbolicText, listText] = new TextDecoder().decode(stdout).split(
        "[avr-name] can be:"
    )[1]!.split(
        "Known MCU names:"
    );
    const symbolic = symbolicText!.split("\n").filter(
        (line): boolean => line.trim().startsWith("avr")
    ).map(
        (line): string => line.split("-")[0]!.trim()
    );
    // Another silly bug in avr-as
    if (!symbolic.includes("avrxmega1")) {
        symbolic.push("avrxmega1");
    }
    const list = listText!.split("Report bugs")[0]!.trim().split(/\s+/).filter(
        (line): boolean => !symbolic.includes(line)
    );
    list.sort();
    return list;
}

const gnuAssembler = (mcu: string) => {
    const command = new Deno.Command("avr-as", {
        "args": [ `-mmcu=${mcu}` ],
        "stdin": "piped",
        "stdout": "null",
        "stderr": "piped"
    });
    return command.spawn();
};

const tryInstruction = async (
    assembler: Deno.ChildProcess,
    instruction: string
) => {
    const writer = assembler.stdin.getWriter();
    await writer.write(new TextEncoder().encode(`${instruction}\n`));
    writer.releaseLock();
    await assembler.stdin.close();
};

const errorMessages = async (
    assembler: Deno.ChildProcess
): Promise<Array<string>> => {
    const { success } = await assembler.status;
    if (success) {
        return [];
    }
    // There's a long standing and decidedly "wacky" error in avr-as: It seems
    // to be correctly identifying mnemonics that are not available on a given
    // chip but it's reporting them incorrectly e.g.:
    // DES 8 - "illegal opcode __gcc_isr for mcu attiny2313"
    // ELPM R16, Z - "illegal opcode nop for mcu attiny2313"
    // XCH Z, R16 - "illegal opcode las for mcu attiny2313"
    const { stderr } = await assembler.output();
    return new TextDecoder().decode(stderr).split("\n");
};

const missingMnemonics: Map<string, Array<string>> = new Map();

const list = (mcu: string, mnemonic: string) => {
    if (missingMnemonics.has(mcu)) {
        missingMnemonics.get(mcu)!.push(mnemonic);
    } else {
        missingMnemonics.set(mcu, [mnemonic]);
    }
};

const doSomethingAbout = (mcu: string, instruction: string, error: string) => {
    if (error.includes("register name or number from 16 to 31 required")) {
        // Some chips (e.g. atTiny10) only have 16 registers.
        // This is covered by the ATDF files, and we don't need to care here.
        return;
    }
    const mnemonic = instruction.split(" ")[0]!;
    if (error.includes("illegal opcode")) {
        list(mcu, mnemonic);
        return;
    }
    if (error.includes("addressing mode not supported")) {
        if (!["LD", "ST"].includes(mnemonic)) {
            throw new Error(
                `Addressing mode but not LD or ST ${mcu}, ${instruction}`
            );
        }
        list(mcu, mnemonic);
        return;
    }
    if (error.includes("postincrement not supported")) {
        if (!["LPM", "ELPM"].includes(mnemonic)) {
            throw new Error(
                `Postincrement but not LPM or ELPM ${mcu}, ${instruction}`
            );
        }
        if (!instruction.endsWith("Z+")) {
            throw new Error(
                `Postincrement but not Rx,Z+ ${mcu}, ${instruction}`
            );
        }
        list(mcu, `${mnemonic}.Z+`);
        return;
    }
    throw new Error(`Unhandled error: ${mcu} ${instruction} ${error}`);
};

for (const mcu of allMcus()) {
    console.log(mcu);
    for (const instruction of allInstructions) {
        const assembler = gnuAssembler(mcu);
        await tryInstruction(assembler, instruction);
        const messages = await errorMessages(assembler);
        for (const message of messages) {
            if (message.includes("Error:")) {
                doSomethingAbout(mcu, instruction, message);
            }
        }
    }
}
Deno.writeTextFileSync(
    "./build/instruction-sets/gnu-specs.json",
    JSON.stringify(Object.fromEntries(missingMnemonics))
);
