import { RuntimeVal, NullVal, NumberVal } from "./values";
import { BinaryExpr, NumericLiteral, Program, Stmt } from "../frontend/ast";

function eval_program(program: Program): RuntimeVal {
    let lastEvaluated: RuntimeVal = { value: "null", type: "null" } as NullVal;

    for (const statement of program.body) {
        lastEvaluated = evaluate(statement);
    }

    return lastEvaluated;
}

function eval_numeric_binary_expr(
    lhs: NumberVal,
    rhs: NumberVal,
    operator: string
): RuntimeVal {
    let result: number;

    if (operator == "+") {
        result = lhs.value + rhs.value;
    } else if (operator == "-") {
        result = lhs.value - rhs.value;
    } else if (operator == "*") {
        result = lhs.value * rhs.value;
    } else if (operator == "/") {
        // TODO: Division by zero checks
        result = lhs.value / rhs.value;
    } else {
        result = lhs.value % rhs.value;
    }

    return { value: result, type: "number" } as NumberVal;
}

function eval_binary_expr(binop: BinaryExpr): RuntimeVal {
    const lhs = evaluate(binop.left);
    const rhs = evaluate(binop.right);

    if (lhs.type == "number" && rhs.type == "number") {
        return eval_numeric_binary_expr(
            lhs as NumberVal,
            rhs as NumberVal,
            binop.operator
        );
    }

    return { value: "null", type: "null" } as NullVal;
}

export function evaluate(astNode: Stmt): RuntimeVal {
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

        case "BinaryExpr":
            return eval_binary_expr(astNode as BinaryExpr);

        case "Program":
            return eval_program(astNode as Program);

        default:
            console.error("এই AST নোড ইন্টারপ্রিটেশনের জন্য তৈরি নয় ", astNode);
            process.exit(0);
    }
}
