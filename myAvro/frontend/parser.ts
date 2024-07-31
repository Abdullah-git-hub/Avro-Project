import {
    Stmt,
    Expr,
    Program,
    Identifier,
    NumericLiteral,
    BinaryExpr,
    VarDeclaration,
    AssignmentExpr,
} from "./ast.ts";

import { Token, TokenType, tokenize } from "./lexer.ts";

export default class Parser {
    private tokens: Token[] = [];

    private not_eof(): boolean {
        return this.tokens[0].type != TokenType.EOF;
    }

    private at() {
        return this.tokens[0] as Token;
    }

    private eat() {
        return this.tokens.shift() as Token;
    }

    private expect(type: TokenType, err: string) {
        const prev = this.eat();

        if (!prev || prev.type != type) {
            console.log(
                "পার্স করতে পারি নি:\n",
                prev,
                " - চেয়েছিলাম: ",
                err,
                type
            );
            Deno.exit(0);
        }

        return prev;
    }

    private BtoENumConvert(banglaNum: string) {
        let srcNumArr = banglaNum.split("");
        let banglaNumArr = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
        let engNumArr: number[] = [];

        for (const num of srcNumArr) {
            engNumArr.push(banglaNumArr.indexOf(num));
        }

        return engNumArr.join("");
    }

    private parse_stmt(): Stmt {
        switch (this.at().type) {
            case TokenType.Let:
            case TokenType.Const:
                return this.parse_var_declaration();
            default:
                return this.parse_expr();
        }
    }

    // let p = 90

    parse_var_declaration(): Stmt {
        const isConstant = this.eat().type == TokenType.Const; // let
        const identifier = this.expect(
            TokenType.Identifier, // p
            "চলক অথবা ধ্রুবকের নাম দেওয়া আবশ্যক"
        ).value;

        if (this.at().type == TokenType.Semicolon) {
            this.eat(); // let p
            if (isConstant) {
                throw "ধ্রুবক তৈরি করতে সাথে মান দেওয়া আবশ্যক";
            }

            return {
                kind: "VarDeclaration",
                identifier,
                constant: false,
            } as VarDeclaration;
        }

        this.expect(
            TokenType.Equals, // = equal sign tao eat() hoye jabe
            "চলক তৈরি করতে চলকের নামের পর '=' চিহ্ন প্রয়োজন"
        );

        const declaration = {
            kind: "VarDeclaration",
            identifier,
            constant: isConstant,
            value: this.parse_expr(),
        } as VarDeclaration;

        // this.expect(
        //     TokenType.Semicolon,
        //     "প্রতিটি স্টেটমেন্ট একটি সেমিকোলন ';' দিয়ে শেষ হতে হবে"
        // );

        return declaration;
    }

    // assignment -> additive -> multiplictive -> primary
    private parse_expr(): Expr {
        return this.parse_assignment_expr();
    }

    private parse_assignment_expr(): Expr {
        const left = this.parse_additive_expr();

        if (this.at().type == TokenType.Equals) {
            this.eat();
            const right = this.parse_assignment_expr();
            return {
                kind: "AssignmentExpr",
                assigne: left,
                value: right,
            } as AssignmentExpr;
        }

        return left;
    }

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
            this.at().value == "*" ||
            this.at().value == "/" ||
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
                const banglaNum = this.eat().value;
                const convertedEngNum = this.BtoENumConvert(banglaNum);
                return {
                    kind: "NumericLiteral",
                    value: parseFloat(convertedEngNum),
                } as NumericLiteral;

            case TokenType.OpenParen:
                this.eat();
                const value = this.parse_expr();
                this.expect(
                    TokenType.CloseParen,
                    "অপ্রত্যাশিত টোকেন পেয়েছি। একটি বন্ধ বন্ধনী আশা করেছিলাম"
                );

                return value;

            default:
                console.log(
                    "পার্সিংয়ের সময় অপ্রত্যাশিত টোকেন পাওয়া গেছে! :'(",
                    this.at()
                );
                Deno.exit(0);
        }
    }

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
