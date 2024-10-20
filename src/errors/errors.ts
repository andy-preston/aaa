export class ErrorWithHint extends Error {
    hint: string;
    constructor(message: string, additionalHint: string) {
        super(message);
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ErrorWithHint);
        }
        this.hint = additionalHint;
    }
};

export class InternalError extends ErrorWithHint {
    constructor(message: string) {
        super(
            message,
            "This should no have happened, please report this error"
        );
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ErrorWithHint);
        }
    }
};

export class OperandRangeError extends ErrorWithHint {
    operandName: string;
    operandValue: string;
    constructor(name: string, expectation: string, actual: string) {
        const problem = `${name} should be ${expectation} not ${actual}`.trim();
        super(
            `Operand out of range: ${problem}`,
            ""
        );
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, OperandRangeError);
        }
        this.name = "OperandRangeError";
        this.operandName = name;
        this.operandValue = actual;
    }
};

export class OperandCountError extends ErrorWithHint {
    expected: Array<string>;
    actual: Array<string>;
    constructor(
        expectedDescriptions: Array<string>,
        actualList: Array<string>
    ) {
        const expectedString = expectedDescriptions.length == 0
            ? "none"
            : expectedDescriptions.join(" and ");
        const actualString = actualList.length == 0
            ? "none"
            : actualList.join(" and ");
        const description = `expecting ${expectedString} got ${actualString}`;
        super(
            `Incorrect number of operands - ${description}`,
            ""
        );
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, OperandCountError);
        }
        this.name = "OperandCountError";
        this.expected = expectedDescriptions;
        this.actual = actualList;
    }
};

export class UnsupportedInstruction extends ErrorWithHint {
    mnemonic: string;
    device: string;
    constructor(unsupportedMnemonic: string, deviceName: string) {
        super(
            `${unsupportedMnemonic} is not available on ${deviceName}`,
            ""
        );
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, UnsupportedInstruction);
        }
        this.name = "UnsupportedInstruction";
        this.mnemonic = unsupportedMnemonic
        this.device = deviceName;
    }
};

export class UnknownInstruction extends ErrorWithHint {
    mnemonic: string;
    constructor(unknownMnemonic: string) {
        super(unknownMnemonic, "");
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, UnknownInstruction);
        }
        this.name = "UnknownInstruction";
        this.mnemonic = unknownMnemonic
    }
};

export class DeviceSelectionError extends ErrorWithHint {
    reason: string;
    constructor(reason: string) {
        super(
            `No device selected - can't ${reason}`,
            "Select a target device with the \"device\" directive at the top of your source file."
        );
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, UnknownInstruction);
        }
        this.reason = reason
    }
};
