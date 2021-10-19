export enum TokenType {
  STRING,
  INTEGER,
  DECIMAL,
  SYMBOL,
  OPEN_BRACKET,
  CLOSE_BRACKET,
  OPEN_ARRAY,
  CLOSE_ARRAY,
  ARRAY_ITEM_SEPERATOR,
  ASSIGNMENT_OP,
  NEW_LINE,
  EOF,
  HEREDOC,
  INDENTED_HEREDOC,
}

export interface Token {
  readonly value: string;
  readonly ln: number;
  readonly col: number;
  readonly tokenType: TokenType;
  readonly tokenError?: string;
}