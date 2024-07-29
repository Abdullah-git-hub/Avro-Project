export enum TokenType {
    Number,
    Identifier,
    Equals,
    OpenParen,
    CloseParen,
    BinaryOperator,
    Let,
    Const,
    Semicolon,
    EOF, // End Of File
}

export interface Token {
    value: string;
    type: TokenType;
}

const KEYWORDS: Record<string, TokenType> = {
    চলক: TokenType.Let,
    ধ্রুবক: TokenType.Const,
};

function tokenBuilder(value = "", type: TokenType): Token {
    return { value, type };
}

function isInt(src: string): boolean {
    const c = src.charCodeAt(0);
    const bounds = ["০".charCodeAt(0), "৯".charCodeAt(0)];
    return c >= bounds[0] && c <= bounds[1];
}

function isAlpha(src: string): boolean {
    const banglaCharCodes = [
        2453, 2454, 2455, 2456, 2457, 2458, 2459, 2460, 2461, 2462, 2463, 2464,
        2465, 2466, 2467, 2468, 2469, 2470, 2471, 2472, 2474, 2475, 2476, 2477,
        2478, 2509, 2479, 2480, 2482, 2486, 2487, 2488, 2489, 2524, 2525, 2527,
        2510, 2434, 2435, 2433, 2494, 2495, 2496, 2497, 2498, 2499, 2503, 2504,
        2507, 2508, 2437, 2438, 2439, 2440, 2441, 2442, 2443, 2447, 2448, 2451,
        2452, 2453, 2457, 2457, 2460, 2462, 2462, 2462, 2468, 2487, 2489, 2467,
        2509, 2509, 2404, 2547, 2544, 2545, 2444, 2492, 2493, 2500, 2519, 2528,
        2529, 2530, 2531, 2546, 2548, 2549, 2550, 2551, 2552, 2553, 2554,
    ];

    return banglaCharCodes.includes(src.charCodeAt(0));
}

function isSkippable(src: string) {
    return src == " " || src == "\n" || src == "\t";
}

export function tokenize(sourceCode: string): Token[] {
    const tokens = new Array<Token>();
    const src = sourceCode.split("");

    while (src.length > 0) {
        if (src[0] == "(") {
            tokens.push(tokenBuilder(src.shift(), TokenType.OpenParen));
        } else if (src[0] == ")") {
            tokens.push(tokenBuilder(src.shift(), TokenType.CloseParen));
        } else if (
            src[0] == "+" ||
            src[0] == "-" ||
            src[0] == "*" ||
            src[0] == "/" ||
            src[0] == "%"
        ) {
            tokens.push(tokenBuilder(src.shift(), TokenType.BinaryOperator));
        } else if (src[0] == "=") {
            tokens.push(tokenBuilder(src.shift(), TokenType.Equals));
        } else if (src[0] == ";") {
            tokens.push(tokenBuilder(src.shift(), TokenType.Semicolon));
        } else {
            if (isInt(src[0])) {
                let num = "";
                while (src.length > 0 && isInt(src[0])) {
                    num += src.shift();
                }
                tokens.push(tokenBuilder(num, TokenType.Number));
            } else if (isAlpha(src[0])) {
                let ident = "";
                while (src.length > 0 && isAlpha(src[0])) {
                    ident += src.shift();
                }

                // check for reserved keywards
                const isReserved = KEYWORDS[ident];

                if (typeof isReserved == "number") {
                    tokens.push(tokenBuilder(ident, isReserved));
                } else {
                    tokens.push(tokenBuilder(ident, TokenType.Identifier));
                }
            } else if (isSkippable(src[0])) {
                src.shift(); //Skip the current char
            } else {
                console.log("Unrecognized charecter found at ", src[0]);
                Deno.exit(0);
            }
        }
    }

    tokens.push({ value: "EndOfFile", type: TokenType.EOF });
    return tokens;
}
