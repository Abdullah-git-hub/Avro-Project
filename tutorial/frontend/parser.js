"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lexer_1 = require("./lexer");
class Parser {
    constructor() {
        this.tokens = [];
    }
    at() {
        return this.tokens[0];
    }
    eat() {
        return this.tokens.shift();
    }
    expect(type, err) {
        const prev = this.tokens.shift();
        if (!prev || prev.type != type) {
            console.log("Parse error:\n", err, prev, " - Expecting: ", type);
            process.exit(0);
        }
        return prev;
    }
    not_eof() {
        return this.tokens[0].type != lexer_1.TokenType.EOF;
    }
    parse_stmt() {
        // skip to parse_expr
        return this.parse_expr();
    }
    parse_expr() {
        return this.parse_additive_expr();
    }
    // (10 + 5) - 5
    parse_additive_expr() {
        let left = this.parse_multiplicative_expr();
        while (this.at().value == "+" || this.at().value == "-") {
            const operator = this.eat().value;
            const right = this.parse_multiplicative_expr();
            left = {
                kind: "BinaryExpr",
                left,
                right,
                operator,
            };
        }
        return left;
    }
    parse_multiplicative_expr() {
        let left = this.parse_primary_expr();
        while (this.at().value == "/" ||
            this.at().value == "*" ||
            this.at().value == "%") {
            const operator = this.eat().value;
            const right = this.parse_primary_expr();
            left = {
                kind: "BinaryExpr",
                left,
                right,
                operator,
            };
        }
        return left;
    }
    parse_primary_expr() {
        const tk = this.at().type;
        switch (tk) {
            case lexer_1.TokenType.Identifier:
                return {
                    kind: "Identifier",
                    symbol: this.eat().value,
                };
            case lexer_1.TokenType.Number:
                return {
                    kind: "NumericLiteral",
                    value: parseFloat(this.eat().value),
                };
            case lexer_1.TokenType.Null:
                this.eat(); //advance past null keyword
                return {
                    kind: "NullLiteral",
                    value: "null",
                };
            case lexer_1.TokenType.OpenParen:
                this.eat(); // eat opening paren
                const value = this.parse_expr();
                this.expect(lexer_1.TokenType.CloseParen, "Unexpected token found inside parenthesised expression. Expected closing parenthesis.");
                return value;
            default:
                console.log("Unexpected token found during parsing!", this.at());
                process.exit(0);
        }
    }
    // ==========**********************=============
    produceAST(sourceCode) {
        this.tokens = (0, lexer_1.tokenize)(sourceCode);
        const program = {
            kind: "Program",
            body: [],
        };
        while (this.not_eof()) {
            program.body.push(this.parse_stmt());
        }
        return program;
    }
}
exports.default = Parser;
