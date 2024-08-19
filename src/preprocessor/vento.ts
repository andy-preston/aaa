import { Environment } from "https://deno.land/x/vento@v0.9.1/src/environment.ts";
import { FileLoader } from "https://deno.land/x/vento@v0.9.1/src/loader.ts";
import ifTag from "https://deno.land/x/vento@v0.9.1/plugins/if.ts";
import forTag from "https://deno.land/x/vento@v0.9.1/plugins/for.ts";
import includeTag from "https://deno.land/x/vento@v0.9.1/plugins/include.ts";
import setTag from "https://deno.land/x/vento@v0.9.1/plugins/set.ts";
import jsTag from "https://deno.land/x/vento@v0.9.1/plugins/js.ts";
import functionTag from "https://deno.land/x/vento@v0.9.1/plugins/function.ts";
import echoTag from "https://deno.land/x/vento@v0.9.1/plugins/echo.ts";

// see interface Options in https://github.com/ventojs/vento/blob/main/mod.ts

// cSpell:words autoescape

export const preprocessor = (): Environment => {
    const env = new Environment({
        "loader": new FileLoader(Deno.cwd()),
        "dataVarname": "it",
        "autoescape": false,
        "useWith": true
    });
    env.use(ifTag());
    env.use(forTag());
    env.use(jsTag());
    env.use(includeTag());
    env.use(setTag());
    env.use(functionTag());
    env.use(echoTag());
    return env;
}
