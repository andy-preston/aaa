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
