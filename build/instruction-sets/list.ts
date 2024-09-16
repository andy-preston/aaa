export const list = () => {
    const theActualList: Map<string, Array<string>> = new Map();

    const add = (chip: string, mnemonic: string) => {
        if (theActualList.has(chip)) {
            theActualList.get(chip)!.push(mnemonic);
        } else {
            theActualList.set(chip, [mnemonic]);
        }
    };

    const json = (): string =>
        JSON.stringify(Object.fromEntries(theActualList));

    return { "add": add, "json": json, };
};
