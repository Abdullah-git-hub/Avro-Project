export type NodeType =
    // stmt
    | "Program"
    | "VarDeclaration"

    // Expr
    | "NumericLiteral"
    | "Identifier"
    | "BinaryExpr";

// stmt -> Program -> expr

export interface Stmt {
    kind: NodeType;
}

// one in a single file
export interface Program extends Stmt {
    kind: "Program";
    body: Stmt[];
}

export interface VarDeclaration extends Stmt {
    kind: "VarDeclaration";
    constant: boolean;
    identifier: string;
    value?: Expr;
}

export interface Expr extends Stmt {}

export interface BinaryExpr extends Expr {
    kind: "BinaryExpr";
    left: Expr;
    right: Expr;
    operator: string;
}

export interface Identifier extends Expr {
    kind: "Identifier";
    symbol: string;
}

export interface NumericLiteral extends Expr {
    kind: "NumericLiteral";
    value: number;
}
