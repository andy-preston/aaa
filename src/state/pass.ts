export const passes = [1, 2] as const;
type Pass = typeof passes[number];

type ResetStateCallback = () => void;

export const newPass = (resetStateCallback: ResetStateCallback) => {
    let current: Pass;

    const start = (pass: Pass) => {
        current = pass;
        resetStateCallback();
    };

    const showErrors = () => current == 2;
    const ignoreErrors = () => current == 1;

    return {
        "start": start,
        "ignoreErrors": ignoreErrors,
        "showErrors": showErrors
    };
};
