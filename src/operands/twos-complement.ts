export const twosComplement = (
    value: number,
    bits: number,
    required: boolean
): number => {
    const highValue = 2 ** bits;
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
