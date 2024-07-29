import Parser from "./frontend/parser";
import Environment from "./runtime/environment";
import { evaluate } from "./runtime/interpreter";
import { MK_BOOL, MK_NULL, MK_NUM } from "./runtime/values";

const parser = new Parser();
const env = new Environment();
env.declareVar("ক", MK_NUM(120));
env.declareVar("ঠিক", MK_BOOL(true));
env.declareVar("ভুল", MK_BOOL(false));
env.declareVar("কিছুনা", MK_NULL());

const program = parser.produceAST("ধ্রুবক প = ১০;");

// console.log(JSON.stringify(program));
// console.log("=================");
console.log(evaluate(program, env));
