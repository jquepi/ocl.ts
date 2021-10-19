import { Lexer } from "../src/lexer";
import { TokenType } from "../src/token";

test("block_with_children_and_labels", () => {
    const lexer = new Lexer(`block_with_children_and_labels "Label 1" "Label 2" {
        child_block {}
        child_attribute = 1
    }`);
    expect(lexer).not.toBeUndefined();

    let token = lexer.nextToken();
    expect(token.tokenError).toBeUndefined();
    expect(token.tokenType).toEqual(TokenType.SYMBOL);
    expect(token.value).toEqual(`block_with_children_and_labels`);

    token = lexer.nextToken();
    expect(token.tokenType).toEqual(TokenType.STRING);
    expect(token.value).toEqual(`"Label 1"`);

    token = lexer.nextToken();
    expect(token.tokenType).toEqual(TokenType.STRING);
    expect(token.value).toEqual(`"Label 2"`);

    token = lexer.nextToken();
    expect(token.tokenType).toEqual(TokenType.OPEN_BRACKET);
    expect(token.value).toEqual(`{`);

    token = lexer.nextToken();
    expect(token.tokenType).toEqual(TokenType.NEW_LINE);
    expect(token.value).toEqual(`\n`);

    token = lexer.nextToken();
    expect(token.tokenType).toEqual(TokenType.SYMBOL);

    token = lexer.nextToken();
    expect(token.tokenType).toEqual(TokenType.OPEN_BRACKET);

    token = lexer.nextToken();
    expect(token.tokenType).toEqual(TokenType.CLOSE_BRACKET);

    token = lexer.nextToken();
    expect(token.tokenType).toEqual(TokenType.NEW_LINE);
    expect(token.value).toEqual(`\n`);

    token = lexer.nextToken();
    expect(token.tokenType).toEqual(TokenType.SYMBOL);

    token = lexer.nextToken();
    expect(token.tokenType).toEqual(TokenType.ASSIGNMENT_OP);

    token = lexer.nextToken();
    expect(token.tokenType).toEqual(TokenType.INTEGER);

    token = lexer.nextToken();
    expect(token.tokenType).toEqual(TokenType.NEW_LINE);

    token = lexer.nextToken();
    expect(token.tokenType).toEqual(TokenType.CLOSE_BRACKET);

    token = lexer.nextToken();
    expect(token.tokenType).toEqual(TokenType.EOF);
});

test("empty block", () => {
    const lexer = new Lexer(`empty_block {
    }`);
    expect(lexer).not.toBeUndefined();

    let token = lexer.nextToken();
    expect(token.tokenType).toEqual(TokenType.SYMBOL);

    token = lexer.nextToken();
    expect(token.tokenType).toEqual(TokenType.OPEN_BRACKET);

    token = lexer.nextToken();
    expect(token.tokenType).toEqual(TokenType.NEW_LINE);

    token = lexer.nextToken();
    expect(token.tokenType).toEqual(TokenType.CLOSE_BRACKET);

    token = lexer.nextToken();
    expect(token.tokenType).toEqual(TokenType.EOF);
});

test("inline empty block", () => {
    const lexer = new Lexer(`inline_empty_block { }`);
    expect(lexer).not.toBeUndefined();

    let token = lexer.nextToken();
    expect(token.tokenType).toEqual(TokenType.SYMBOL);

    token = lexer.nextToken();
    expect(token.tokenType).toEqual(TokenType.OPEN_BRACKET);

    token = lexer.nextToken();
    expect(token.tokenType).toEqual(TokenType.CLOSE_BRACKET);

    token = lexer.nextToken();
    expect(token.tokenType).toEqual(TokenType.EOF);
});

test("invalid empty block with newline before open bracket", () => {
    const lexer = new Lexer(`my_block
    {
    }`);
    expect(lexer).not.toBeUndefined();

    let token = lexer.nextToken();
    expect(token.tokenType).toEqual(TokenType.SYMBOL);

    token = lexer.nextToken();
    expect(token.tokenType).toEqual(TokenType.NEW_LINE);

    token = lexer.nextToken();
    expect(token.tokenType).toEqual(TokenType.OPEN_BRACKET);

    token = lexer.nextToken();
    expect(token.tokenType).toEqual(TokenType.NEW_LINE);

    token = lexer.nextToken();
    expect(token.tokenType).toEqual(TokenType.CLOSE_BRACKET);

    token = lexer.nextToken();
    expect(token.tokenType).toEqual(TokenType.EOF);
});

test("invalid empty block with unquoted label", () => {
    const lexer = new Lexer(`my block {
    }`);
    expect(lexer).not.toBeUndefined();

    let token = lexer.nextToken();
    expect(token.tokenType).toEqual(TokenType.SYMBOL);

    token = lexer.nextToken();
    expect(token.tokenType).toEqual(TokenType.SYMBOL);

    token = lexer.nextToken();
    expect(token.tokenType).toEqual(TokenType.OPEN_BRACKET);

    token = lexer.nextToken();
    expect(token.tokenType).toEqual(TokenType.NEW_LINE);

    token = lexer.nextToken();
    expect(token.tokenType).toEqual(TokenType.CLOSE_BRACKET);

    token = lexer.nextToken();
    expect(token.tokenType).toEqual(TokenType.EOF);
});

