export enum TokenType {
  STRING,
  INTEGER,
  DECIMAL,
  SYMBOL,
  OPEN_BRACKET,
  CLOSE_BRACKET,
  OPEN_ARRAY,
  CLOSE_ARRAY,
  ASSIGNMENT_OP,
  NEW_LINE,
  EOF,
  HEREDOC,
  INDENTED_HEREDOC,
}

export class Token {
  public readonly value: string;
  public readonly ln: number;
  public readonly col: number;
  public readonly tokenType: TokenType;
  public readonly tokenError?: string;

  constructor(
      value: string,
      ln: number,
      col: number,
      tokenType: TokenType,
      tokenError?: string,
    ) {
    this.value = value;
    this.ln = ln;
    this.col = col;
    this.tokenType = tokenType;
    this.tokenError = tokenError;
  }
}