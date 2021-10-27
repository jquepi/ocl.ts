export enum TokenType {
  ARRAY_ITEM_SEPERATOR,
  ASSIGNMENT_OP,
  CLOSE_ARRAY,
  CLOSE_BRACKET,
  DECIMAL,
  EOF,
  HEREDOC,
  INDENTED_HEREDOC,
  INTEGER,
  NEW_LINE,
  OPEN_ARRAY,
  OPEN_BRACKET,
  STRING,
  SYMBOL,
  RECOVERY,
}

export interface Token {
  readonly col: number;
  readonly ln: number;
  readonly tokenError?: string;
  readonly tokenType: TokenType;
  readonly value: string;
}