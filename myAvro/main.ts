import Parser from "./frontend/parser.ts";
import Environment from "./runtime/environment.ts";
import { evaluate } from "./runtime/interpreter.ts";
import { MK_BOOL, MK_NULL, MK_NUM } from "./runtime/values.ts";

const parser = new Parser();
const env = new Environment();
// env.declareVar("ক", MK_NUM(120), true);
// env.declareVar("খ", MK_NUM(10), true);
env.declareVar("ঠিক", MK_BOOL(true), true);
env.declareVar("ভুল", MK_BOOL(false), true);
env.declareVar("কিছুনা", MK_NULL(), true);

// INITIALIZE REPL
console.log("\nRepl v0.1");

// Continue Repl Until User Stops Or Types `exit`
while (true) {
    const input = prompt("> ") || "ক";
    // Check for no user input or exit keyword.
    if (!input || input.includes("exit")) {
        Deno.exit(1);
    }

    // Produce AST From sourc-code
    const program = parser.produceAST(input?.toString());

    const result = evaluate(program, env);
    console.log(result);
}
