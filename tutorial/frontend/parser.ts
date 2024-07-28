import {
    Stmt,
    Program,
    Expr,
    BinaryExpr,
    NumericLiteral,
    Identifier,
    NullLiteral,
} from "./ast";

import { tokenize, Token, TokenType } from "./lexer";

export default class Parser {
    private tokens: Token[] = [];

    private at() {
        return this.tokens[0] as Token;
    }

    private eat() {
        return this.tokens.shift() as Token;
    }

    private expect(type: TokenType, err: any) {
        const prev = this.tokens.shift() as Token;
        if (!prev || prev.type != type) {
            console.log("Parse error:\n", err, prev, " - Expecting: ", type);
            process.exit(0);
        }

        return prev;
    }

    private not_eof(): boolean {
        return this.tokens[0].type != TokenType.EOF;
    }

    private parse_stmt(): Stmt {
        // skip to parse_expr

        return this.parse_expr();
    }

    private parse_expr(): Expr {
        return this.parse_additive_expr();
    }

    // (10 + 5) - 5
    private parse_additive_expr(): Expr {
        let left = this.parse_multiplicative_expr();

        while (this.at().value == "+" || this.at().value == "-") {
            const operator = this.eat().value;
            const right = this.parse_multiplicative_expr();
            left = {
                kind: "BinaryExpr",
                left,
                right,
                operator,
            } as BinaryExpr;
        }

        return left;
    }

    private parse_multiplicative_expr(): Expr {
        let left = this.parse_primary_expr();

        while (
            this.at().value == "/" ||
            this.at().value == "*" ||
            this.at().value == "%"
        ) {
            const operator = this.eat().value;
            const right = this.parse_primary_expr();
            left = {
                kind: "BinaryExpr",
                left,
                right,
                operator,
            } as BinaryExpr;
        }

        return left;
    }

    private parse_primary_expr(): Expr {
        const tk = this.at().type;

        switch (tk) {
            case TokenType.Identifier:
                return {
                    kind: "Identifier",
                    symbol: this.eat().value,
                } as Identifier;

            case TokenType.Number:
                return {
                    kind: "NumericLiteral",
                    value: parseFloat(this.eat().value),
                } as NumericLiteral;

            case TokenType.Null:
                this.eat(); //advance past null keyword
                return {
                    kind: "NullLiteral",
                    value: "null",
                } as NullLiteral;

            case TokenType.OpenParen:
                this.eat(); // eat opening paren
                const value = this.parse_expr();
                this.expect(
                    TokenType.CloseParen,
                    "Unexpected token found inside parenthesised expression. Expected closing parenthesis."
                );

                return value;

            default:
                console.log(
                    "Unexpected token found during parsing!",
                    this.at()
                );
                process.exit(0);
        }
    }

    // ==========**********************=============
    public produceAST(sourceCode: string): Program {
        this.tokens = tokenize(sourceCode);
        const program: Program = {
            kind: "Program",
            body: [],
        };

        while (this.not_eof()) {
            program.body.push(this.parse_stmt());
        }

        return program;
    }
}
