export const javaScriptError = (exception: Error) => ({
    "name": "JavaScriptError" as const,
    "exception": exception
});

export const outOfRange = (
    min: number,
    max: number,
    actual: number,
    expectation: string
) => ({
    "name": "OutOfRange" as const,
    "min": min,
    "max": max,
    "actual": actual,
    "expectation": expectation
});

export const notInteger = (actual: string) => ({
    "name": "NotInteger" as const,
    "actual": actual
});

type ErrorObject =
    | ReturnType<typeof javaScriptError>
    | ReturnType<typeof outOfRange>
    | ReturnType<typeof notInteger>;

export const errorResult = (error: ErrorObject) => {
    const errors: Array<ErrorObject> = [error];
    return {
        "which": "errors" as const,
        "errors": errors
    };
};

export type Errors = ReturnType<typeof errorResult>;
