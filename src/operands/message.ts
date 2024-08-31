export const operandMessage = (
    name: string,
    expectation: string,
    actual: string
) => {
    const problem = `${name} should be ${expectation} not ${actual}`.trim();
    return `Operand out of range: ${problem}`;
};
