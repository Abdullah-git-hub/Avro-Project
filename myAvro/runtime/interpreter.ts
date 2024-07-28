import { RuntimeVal, NullVal, NumberVal } from "./values";
import { NodeType, NumericLiteral, Stmt } from "../frontend/ast";

export function evaluate(astNode: Stmt): RuntimeVal {
    console.log(astNode.kind, "kkk");

    switch (astNode.kind) {
        case "NumericLiteral":
            return {
                type: "number",
                value: (astNode as NumericLiteral).value,
            } as NumberVal;

        case "NullLiteral":
            return {
                type: "null",
                value: "null",
            } as NullVal;

        default:
            console.error("এই AST নোড ইন্টারপ্রিটেশনের জন্য তৈরি নয় ", astNode);
            process.exit(0);
    }
}
