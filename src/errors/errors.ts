export class ErrorWithHints extends Error {
    constructor(message: string, name: string) {
        super(message);
        this.name = name;
    }
};

export interface HintedError {
    message: string;
    name: string;
    hint: () => string;
}

export class InternalError extends ErrorWithHints implements HintedError {
    constructor(message: string) {
        super(message, "InternalError");
    }
    hint() { return "This should no have happened, please report this error"; }
};

export class NotDefinedError extends ErrorWithHints implements HintedError {
    constructor(message: string) {
        super(message, "NotDefinedError");
    }
    hint() { return ""; }
};

export class RedefinedError extends ErrorWithHints implements HintedError {
    value: string;
    constructor(name: string, value: string) {
        super(`${name} already defined`, "RedefinedError");
        this.value = value;
    }
    hint() { return `${name} already has the value ${this.value}`; }
}

export class JavascriptError extends ErrorWithHints implements HintedError {
    constructor(message: string) {
        super(message, "JavascriptError");
    }
    hint() { return ""; }
};

export class AssemblerSyntaxError extends ErrorWithHints implements HintedError {
    constructor(message: string) {
        super(message, "AssemblerSyntaxError");
    }
    hint() { return ""; }
};

export class MiscellaneousError extends ErrorWithHints implements HintedError {
    constructor(message: string) {
        super(message, "MiscellaneousError");
    }
    hint() { return ""; }
};

export class OperandOutOfRange extends ErrorWithHints implements HintedError {
    operandName: string;
    operandValue: string;
    expectation: string;
    constructor(name: string, expectation: string, actual: string) {
        const message = `${name} should be ${expectation} not ${actual}`.trim();
        super(message, "OperandOutOfRange");
        this.operandName = name;
        this.operandValue = actual;
        this.expectation = expectation;
    }
    hint() { return ""; }
};

export class DataMemoryUnavailable extends ErrorWithHints implements HintedError {
    bytes: number;
    available: number;
    constructor(bytes: number, available: number) {
        const prefix = `Can't allocate ${bytes} bytes in SRAM,`;
        const suffix = `there are only ${available} available`;
        super(`${prefix} ${suffix}`, "DataMemoryUnavailable");
        this.bytes = bytes;
        this.available = available;
    }
    hint() { return ""; }
};

export class ProgramMemoryUnavailable extends ErrorWithHints implements HintedError {
    address: number | undefined;
    endAddress: number;
    constructor(address: number | undefined, endAddress: number) {
        const prefix = address == undefined
            ? "out"
            : `${address} beyond end`;
        super(
            `${prefix} of program memory (${endAddress})`,
            "ProgramMemoryUnavailable"
        );
        this.address = address;
        this.endAddress = endAddress;
    }
    hint() { return ""; }
};

export class NumericError extends ErrorWithHints implements HintedError {
    value: number;
    range: string;
    constructor(value: number, range: string) {
        super(`${value} must be: ${range}`, "NumericError");
        this.value = value;
        this.range = range;
    }
    hint() { return ""; }
};

export class IncorrectNumberOfOperands extends ErrorWithHints implements HintedError {
    expected: Array<string>;
    actual: Array<string>;
    constructor(
        expectedDescriptions: Array<string>,
        actual: Array<string>
    ) {
        const expectedString = expectedDescriptions.length == 0
            ? "none"
            : expectedDescriptions.join(" and ");
        const actualString = actual.length == 0
            ? "none"
            : actual.join(" and ");
        super(
            `expecting ${expectedString} got ${actualString}`,
            "IncorrectNumberOfOperands"
        );
        this.expected = expectedDescriptions;
        this.actual = actual;
    }
    hint() { return ""; }
};

const instructionAlternatives = new Map([
    ['JMP', 'RJMP'],
    ['CALL', "RCALL"],
    ["EICALL", "CALL or RCALL"],
    ["EIJMP", "JMP or RJMP"],
])

export class UnsupportedInstruction extends ErrorWithHints implements HintedError {
    mnemonic: string;
    device: string;
    constructor(mnemonic: string, deviceName: string) {
        super(
            `${mnemonic} is not available on ${deviceName}`,
            "UnsupportedInstruction"
        );
        this.mnemonic = mnemonic;
        this.device = deviceName;
    }
    hint() {
        if (instructionAlternatives.has(this.mnemonic)) {
            const alternative = instructionAlternatives.get(this.mnemonic);
            return `perhaps you should be using ${alternative}?`
        }
        return "";
    }
};

export class UnknownInstruction extends ErrorWithHints implements HintedError {
    mnemonic: string;
    constructor(unknownMnemonic: string) {
        super(unknownMnemonic, "UnknownInstruction");
        this.mnemonic = unknownMnemonic
    }
    hint() { return ""; }
};

export class DeviceSelectionError extends ErrorWithHints implements HintedError {
    reason: string;
    constructor(reason: string) {
        super(
            `No device selected - can't ${reason}`,
            "DeviceSelectionError"
        );
        this.reason = reason
    }
    hint() {
        return "Select a target device with the \"device\" directive at the top of your source file.";
    }
};
