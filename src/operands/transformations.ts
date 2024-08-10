export const twosComplement = (
    value: number,
    bits: number,
    required: boolean
): number => {
    const highValue = Math.pow(2, bits);
    const maxPositive = highValue - 1;
    const max = highValue / 2;
    const min = -(max - 1);
    if (!required && value >= 0) {
        if (value > maxPositive) {
            throw new RangeError(
                `${value} out of range -` +
                    ` should be between ${min} and ${max}` +
                    ` or 0 and ${maxPositive}`
            );
        }
        return value;
    }
    if (value < min || value > max) {
        throw new RangeError(
            `${value} out of range - should be between ${min} and ${max}`
        );
    }
    return value < 0 ? highValue + value : value;
};

export const relativeJump = (
    target: number,
    bits: number,
    programCounter: number
) => {
    try {
        return twosComplement(target - 1 - programCounter, bits, true);
    } catch (error) {
        throw new RangeError(`Relative jump ${error.message}`);
    }
};

export const registerFrom16 = (register: number): number => register - 16;

export const registerPair = (register: number, startingAt: number): number =>
    (register - startingAt) / 2;

