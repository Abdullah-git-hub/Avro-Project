import Parser from "./frontend/parser.ts";
import Environment from "./runtime/environment.ts";
import { evaluate } from "./runtime/interpreter.ts";
import { MK_BOOL, MK_NULL, MK_NUM } from "./runtime/values.ts";

async function run(filename: string) {
    const parser = new Parser();
    const env = new Environment();

    const input = await Deno.readTextFile(filename);
    const program = parser.produceAST(input.toString());
    const result = evaluate(program, env);
    console.log(result);
}

// INITIALIZE REPL
// console.log("\nAvroRepl v1.0");

// Continue Repl Until User Stops Or Types `exit`
// while (true) {
//     const input = prompt("> ") || "ক";
//     if (!input || input.includes("exit")) {
//         Deno.exit(1);
//     }

//     const program = parser.produceAST(input?.toString());

//     const result = evaluate(program, env);
//     console.log(result);
// }

run("./mycode.txt");
