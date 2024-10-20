export class InternalError extends Error { };

export class OperandRangeError extends RangeError {
    operandName: string;
    operandValue: string;

    constructor(name: string, expectation: string, actual: string) {
        const problem = `${name} should be ${expectation} not ${actual}`.trim();
        super(`Operand out of range: ${problem}`);
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, OperandRangeError);
        }
        this.name = "OperandRangeError";
        this.operandName = name;
        this.operandValue = actual;
    }
}
