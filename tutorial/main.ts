import Parser from "./frontend/parser";
// import { readFileSync } from "fs";

function repl(sourceCode: string) {
    const parser = new Parser();
    console.log("\nRepl v0.1");

    // const file = readFileSync("./demo.txt", "utf-8");
    // const program = parser.produceAST(file);
    const program = parser.produceAST(sourceCode);
    console.log(JSON.stringify(program));

    // while (true) {
    //     const input = prompt("> ");

    //     if (!input || input.includes("exit")) {
    //         process.exit(0);
    //     }

    //     const program = parser.produceAST(input);
    //     console.log(program);
    // }
}

repl("null + 10");
