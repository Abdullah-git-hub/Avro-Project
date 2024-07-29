import { RuntimeVal, NumberVal } from "./values.ts";
import {
    AssignmentExpr,
    BinaryExpr,
    Identifier,
    NumericLiteral,
    Program,
    Stmt,
    VarDeclaration,
} from "../frontend/ast.ts";
import Environment from "./environment.ts";
import {
    eval_identifier,
    eval_binary_expr,
    eval_assignment_expr,
} from "./eval/expressions.ts";
import { eval_program, eval_var_declaration } from "./eval/statements.ts";

export function evaluate(astNode: Stmt, env: Environment): RuntimeVal {
    switch (astNode.kind) {
        case "NumericLiteral":
            return {
                type: "number",
                value: (astNode as NumericLiteral).value,
            } as NumberVal;

        case "Identifier":
            return eval_identifier(astNode as Identifier, env);

        case "AssignmentExpr":
            return eval_assignment_expr(astNode as AssignmentExpr, env);

        case "BinaryExpr":
            return eval_binary_expr(astNode as BinaryExpr, env);

        case "VarDeclaration":
            return eval_var_declaration(astNode as VarDeclaration, env);

        case "Program":
            return eval_program(astNode as Program, env);

        default:
            console.error("এই AST নোড ইন্টারপ্রিটেশনের জন্য তৈরি নয় ", astNode);
            Deno.exit(0);
    }
}
