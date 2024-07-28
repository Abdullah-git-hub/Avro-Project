import Parser from "./frontend/parser";

const parser = new Parser();

const program = parser.produceAST("ক + ( কিছুনা * ১০ ) + ( ৫ )");

console.log(JSON.stringify(program));
