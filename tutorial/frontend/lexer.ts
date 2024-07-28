// let x = 22 + ( pp * qq)
// [ LetToken, IdentifierToken, EqualsToken, NumberToken ]

export enum TokenType {
    Number,
    Identifier,
    Equals,
    OpenParen,
    CloseParen,
    BinaryOperator,
    Let,
    Null,
    EOF, // End Of File
}

const KEYWORDS: Record<string, TokenType> = {
    let: TokenType.Let,
    null: TokenType.Null,
};

export interface Token {
    value: string;
    type: TokenType;
}

function token(value = "", type: TokenType): Token {
    return { value, type };
}

function isAplha(src: string) {
    return src.toLowerCase() != src.toUpperCase(); // if yes, it is string
}

function isInt(src: string) {
    const c = src.charCodeAt(0);
    const bounds = ["0".charCodeAt(0), "9".charCodeAt(0)];
    return c >= bounds[0] && c <= bounds[1];
}

function isSkippable(src: string) {
    return src == " " || src == "\n" || src == "\t";
}

export function tokenize(sourceCode: string): Token[] {
    const tokens = new Array<Token>();
    const src = sourceCode.split("");

    // Build each token until end of file
    while (src.length > 0) {
        if (src[0] == "(") {
            tokens.push(token(src.shift(), TokenType.OpenParen));
        } else if (src[0] == ")") {
            tokens.push(token(src.shift(), TokenType.CloseParen));
        } else if (
            src[0] == "+" ||
            src[0] == "-" ||
            src[0] == "*" ||
            src[0] == "/" ||
            src[0] == "%"
        ) {
            tokens.push(token(src.shift(), TokenType.BinaryOperator));
        } else if (src[0] == "=") {
            tokens.push(token(src.shift(), TokenType.Equals));
        } else {
            if (isInt(src[0])) {
                let num = "";
                while (src.length > 0 && isInt(src[0])) {
                    num += src.shift();
                }
                tokens.push(token(num, TokenType.Number));
            } else if (isAplha(src[0])) {
                let ident = "";
                while (src.length > 0 && isAplha(src[0])) {
                    ident += src.shift();
                }

                // check for reserved keywards
                const isReserved = KEYWORDS[ident];

                if (typeof isReserved == "number") {
                    tokens.push(token(ident, isReserved));
                } else {
                    tokens.push(token(ident, TokenType.Identifier));
                }
            } else if (isSkippable(src[0])) {
                src.shift(); //Skip the current char
            } else {
                console.log("Unrecognized charecter found at ", src[0]);
                process.exit(0);
            }
        }
    }

    tokens.push({ value: "EndOfFile", type: TokenType.EOF });
    return tokens;
}

// const source = "let x = 22 + ( 3 / 4)";
// for (const token of tokenize(source)) console.log(token);

// "ক খ গ ঘ ঙ চ ছ জ ঝ ঞ ট ঠ ড ঢ ণ ত থ দ ধ ন প ফ ব ভ ম ্ য র ল শ ষ স হ ড় ঢ় য় ৎ ং ঃ ঁ ০ ১ ২ ৩ ৪ ৫ ৬ ৭ ৮ ৯ া ি ী ু ূ ৃ ে ৈ ো ৌ অ আ ই ঈ উ ঊ ঋ এ ঐ ও ঔ ক্ষ ঙ্ক ঙ্গ জ্ঞ ঞ্চ ঞ্ছ ঞ্জ ত্ত ষ্ণ হ্ম ণ্ড ্য ্র । ৳ ৰ ৱ ঌ ় ঽ ৄ ৗ ৠ ৡ ৢ ৣ ৲ ৴ ৵ ৶ ৷ ৸ ৹ ৺"
