import { Lexer } from "../src/lexer";
import { TokenType } from "../src/token";

test("string length of zero", () => {
    const lexer = new Lexer(``);
    expect(lexer).toBeDefined();

    const token = lexer.nextToken();
    expect(token.col).toEqual(1);
    expect(token.ln).toEqual(1);
    expect(token.tokenError).toBeUndefined();
    expect(token.tokenType).toEqual(TokenType.EOF);
    expect(token.value).toEqual(`EOF`);
});

test("whitespace string", () => {
    const lexer = new Lexer(` `);
    expect(lexer).toBeDefined();

    const token = lexer.nextToken();
    expect(token.col).toEqual(2);
    expect(token.ln).toEqual(1);
    expect(token.tokenError).toBeUndefined();
    expect(token.tokenType).toEqual(TokenType.EOF);
    expect(token.value).toEqual(`EOF`);
});

test("emoji", () => {
    const lexer = new Lexer(`🐙`);
    expect(lexer).toBeDefined();

    let token = lexer.nextToken();
    expect(token.col).toEqual(1);
    expect(token.ln).toEqual(1);
    expect(token.tokenError).toBeUndefined();
    expect(token.tokenType).toEqual(TokenType.SYMBOL);
    expect(token.value).toEqual(`🐙`);

    token = lexer.nextToken();
    expect(token.col).toEqual(3);
    expect(token.ln).toEqual(1);
    expect(token.tokenError).toBeUndefined();
    expect(token.tokenType).toEqual(TokenType.EOF);
    expect(token.value).toEqual(`EOF`);
});

test("emoji in quotes", () => {
    const lexer = new Lexer(`"🐙"`);
    expect(lexer).toBeDefined();

    let token = lexer.nextToken();
    expect(token.col).toEqual(1);
    expect(token.ln).toEqual(1);
    expect(token.tokenError).toBeUndefined();
    expect(token.tokenType).toEqual(TokenType.STRING);
    expect(token.value).toEqual(`"🐙"`);

    token = lexer.nextToken();
    expect(token.col).toEqual(5);
    expect(token.ln).toEqual(1);
    expect(token.tokenError).toBeUndefined();
    expect(token.tokenType).toEqual(TokenType.EOF);
    expect(token.value).toEqual(`EOF`);
});