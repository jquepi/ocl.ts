import { Lexer } from "../src/lexer";
import { TokenType } from "../src/token";

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