import { Lexer } from "../src/lexer";
import { TokenType } from "../src/token";

test("invalid integer attribute with newline before assignment operator", () => {
    const lexer = new Lexer(`int_attribute
    = 1`);
    expect(lexer).not.toBeUndefined();

    let token = lexer.nextToken();
    expect(token.col).toEqual(1);
    expect(token.ln).toEqual(1);
    expect(token.tokenError).toBeUndefined();
    expect(token.tokenType).toEqual(TokenType.SYMBOL);
    expect(token.value).toEqual(`int_attribute`);

    token = lexer.nextToken();
    expect(token.col).toEqual(14);
    expect(token.ln).toEqual(1);
    expect(token.tokenError).toBeDefined();
    expect(token.tokenType).toEqual(TokenType.NEW_LINE);
    expect(token.value).toEqual(`\n`);

    token = lexer.nextToken();
    expect(token.col).toEqual(5);
    expect(token.ln).toEqual(2);
    expect(token.tokenError).toBeUndefined();
    expect(token.tokenType).toEqual(TokenType.ASSIGNMENT_OP);
    expect(token.value).toEqual(`=`);

    token = lexer.nextToken();
    expect(token.col).toEqual(7);
    expect(token.ln).toEqual(2);
    expect(token.tokenError).toBeUndefined();
    expect(token.tokenType).toEqual(TokenType.INTEGER);
    expect(token.value).toEqual(`1`);

    token = lexer.nextToken();
    expect(token.col).toEqual(8);
    expect(token.ln).toEqual(2);
    expect(token.tokenError).toBeUndefined();
    expect(token.tokenType).toEqual(TokenType.EOF);
    expect(token.value).toEqual(`EOF`);
});

test("invalid integer attribute with newline before value", () => {
    const lexer = new Lexer(`int_attribute =
 1`);
    expect(lexer).not.toBeUndefined();

    let token = lexer.nextToken();
    expect(token.col).toEqual(1);
    expect(token.ln).toEqual(1);
    expect(token.tokenError).toBeUndefined();
    expect(token.tokenType).toEqual(TokenType.SYMBOL);
    expect(token.value).toEqual(`int_attribute`);

    token = lexer.nextToken();
    expect(token.col).toEqual(15);
    expect(token.ln).toEqual(1);
    expect(token.tokenError).toBeUndefined();
    expect(token.tokenType).toEqual(TokenType.ASSIGNMENT_OP);
    expect(token.value).toEqual(`=`);

    token = lexer.nextToken();
    expect(token.col).toEqual(16);
    expect(token.ln).toEqual(1);
    expect(token.tokenError).toBeDefined();
    expect(token.tokenType).toEqual(TokenType.NEW_LINE);
    expect(token.value).toEqual(`\n`);

    token = lexer.nextToken();
    expect(token.col).toEqual(2);
    expect(token.ln).toEqual(2);
    expect(token.tokenError).toBeUndefined();
    expect(token.tokenType).toEqual(TokenType.INTEGER);
    expect(token.value).toEqual(`1`);

    token = lexer.nextToken();
    expect(token.col).toEqual(3);
    expect(token.ln).toEqual(2);
    expect(token.tokenError).toBeUndefined();
    expect(token.tokenType).toEqual(TokenType.EOF);
    expect(token.value).toEqual(`EOF`);
});

test("integer attribute", () => {
    const lexer = new Lexer(`int_attribute = 1`);
    expect(lexer).not.toBeUndefined();

    let token = lexer.nextToken();
    expect(token.col).toEqual(1);
    expect(token.ln).toEqual(1);
    expect(token.tokenError).toBeUndefined();
    expect(token.tokenType).toEqual(TokenType.SYMBOL);
    expect(token.value).toEqual(`int_attribute`);

    token = lexer.nextToken();
    expect(token.col).toEqual(15);
    expect(token.ln).toEqual(1);
    expect(token.tokenError).toBeUndefined();
    expect(token.tokenType).toEqual(TokenType.ASSIGNMENT_OP);
    expect(token.value).toEqual(`=`);

    token = lexer.nextToken();
    expect(token.col).toEqual(17);
    expect(token.ln).toEqual(1);
    expect(token.tokenError).toBeUndefined();
    expect(token.tokenType).toEqual(TokenType.INTEGER);
    expect(token.value).toEqual(`1`);

    token = lexer.nextToken();
    expect(token.col).toEqual(18);
    expect(token.ln).toEqual(1);
    expect(token.tokenError).toBeUndefined();
    expect(token.tokenType).toEqual(TokenType.EOF);
    expect(token.value).toEqual(`EOF`);
});