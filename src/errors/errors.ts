import { ioOverflowAlternative, unsupportedInstructionAlternative } from "./hints.ts";

export class ErrorWithHints extends Error {
    hint: string;
    constructor(message: string) {
        super(message);
        this.name = this.constructor.name;
        this.hint = "";
    }
};

export class InternalError extends ErrorWithHints {
    constructor(message: string) {
        super(message);
        this.hint = "This should no have happened, please report this error";
    }
};

export class NotDefinedError extends ErrorWithHints {
    // This comes straight from a JavaScript error
    // maybe we can construct a hint based on the original message?
    // The name is very good either.
};

export class RedefinedError extends ErrorWithHints {
    // Needs a better name
    value: string;
    constructor(name: string, value: string) {
        super(`${name} already defined`);
        this.hint = `${name} already has the value ${value}`;
        this.value = value;
    }
}

export class JavascriptError extends ErrorWithHints {
    // This comes straight from a JavaScript error
    // maybe we can construct a hint based on the original message?
};

export class AssemblerSyntaxError extends ErrorWithHints {
    // TODO: Constructors with `message` should be avoided!
};

export class MiscellaneousError extends ErrorWithHints {
    // TODO: the existence of this class makes a mockery of everything
    // we're trying to achieve here.
};

export class OperandOutOfRange extends ErrorWithHints {
    operandName: string;
    operandValue: string;
    expectation: string;
    constructor(name: string, expectation: string, actual: string) {
        super(`${name} should be ${expectation} not ${actual}`.trim());
        this.operandName = name;
        this.operandValue = actual;
        this.expectation = expectation;
    }
};

export class IOPortOutOfRange extends ErrorWithHints {
    operandName: string;
    operandValue: string;
    expectation: string;
    tooHigh: boolean;
    constructor(
        name: string,
        expectation: string,
        actual: string,
        tooHigh: boolean
    ) {
        super(`${name} should be ${expectation} not ${actual}`.trim());
        this.operandName = name;
        this.operandValue = actual;
        this.expectation = expectation;
        this.tooHigh = tooHigh;
    }
    hinting(mnemonic: string) {
        if (this.tooHigh) {
            this.hint = ioOverflowAlternative(mnemonic);
        }
    }
};

export class DataMemoryUnavailable extends ErrorWithHints {
    bytes: number;
    available: number;
    constructor(bytes: number, available: number) {
        const prefix = `Can't allocate ${bytes} bytes in SRAM,`;
        const suffix = `there are only ${available} available`;
        super(`${prefix} ${suffix}`);
        this.bytes = bytes;
        this.available = available;
    }
};

export class ProgramMemoryUnavailable extends ErrorWithHints {
    address: number | undefined;
    endAddress: number;
    constructor(address: number | undefined, endAddress: number) {
        const prefix = address == undefined
            ? "out"
            : `${address} beyond end`;
        super(`${prefix} of program memory (${endAddress})`);
        this.address = address;
        this.endAddress = endAddress;
    }
};

export class NumericError extends ErrorWithHints {
    value: number;
    range: string;
    constructor(value: number, range: string) {
        super(`${value} must be: ${range}`);
        this.value = value;
        this.range = range;
    }
};

export class IncorrectNumberOfOperands extends ErrorWithHints {
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
        super(`expecting ${expectedString} got ${actualString}`);
        this.expected = expectedDescriptions;
        this.actual = actual;
    }
};

export class UnsupportedInstruction extends ErrorWithHints {
    mnemonic: string;
    device: string;
    constructor(mnemonic: string, deviceName: string) {
        super(`${mnemonic} is not available on ${deviceName}`);
        this.mnemonic = mnemonic;
        this.device = deviceName;
        this.hint = unsupportedInstructionAlternative(this.mnemonic);
    }
};

export class UnknownInstruction extends ErrorWithHints {
    mnemonic: string;
    constructor(unknownMnemonic: string) {
        super(unknownMnemonic);
        this.mnemonic = unknownMnemonic
    }
};

export class DeviceSelectionError extends ErrorWithHints {
    reason: string;
    constructor(reason: string) {
        super(`No device selected - can't ${reason}`);
        this.reason = reason;
        this.hint = "Select a target device with the \"device\" directive at the top of your source file.";
    }
};
