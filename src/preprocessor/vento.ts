import { Environment } from "vento/src/environment.ts";
import { FileLoader } from "vento/src/loader.ts";
import ifTag from "vento/plugins/if.ts";
import forTag from "vento/plugins/for.ts";
import includeTag from "vento/plugins/include.ts";
import setTag from "vento/plugins/set.ts";
import jsTag from "vento/plugins/js.ts";
import functionTag from "vento/plugins/function.ts";
import echoTag from "vento/plugins/echo.ts";

// see interface Options in https://github.com/ventojs/vento/blob/main/mod.ts

////////////////////////////////////////////////////////////////////////////////
//
// I think we're going to need an option in aaa to set the includes directories
//
////////////////////////////////////////////////////////////////////////////////

export const preprocessor = (): Environment => {
    const env = new Environment({
        "loader": new FileLoader(Deno.cwd()),
        "dataVarname": "it",
        // cSpell:words autoescape
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
