import Parser from "./frontend/parser";

const parser = new Parser();

const program = parser.produceAST("ক + ১০ - (৯৯ / ৩) * ফ");

console.log(JSON.stringify(program));
