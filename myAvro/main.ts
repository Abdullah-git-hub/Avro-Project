import Parser from "./frontend/parser";
import { evaluate } from "./runtime/interpreter";

const parser = new Parser();

const program = parser.produceAST(
    "১০ + ২৩ * ৭ + ( ৯০ / ৩) + ((১৫ * ২) - ২ * ৩)"
);

// console.log(JSON.stringify(program));
// console.log("=================");
console.log(evaluate(program));
