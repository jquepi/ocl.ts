import { Token, TokenType } from "./token";

export class Lexer {
  private code: string;
  private pc: number;
  private col: number;
  private ln: number;
  private currentTokenCol: number;
  private currentTokenLn: number;
  private currentChar: string;

  constructor(code: string) {
    this.code = code;
    this.pc = -1;
    this.col = 0;
    this.ln = 1;
    this.currentTokenCol = 0;
    this.currentTokenLn = 0;
    this.currentChar = '';
    this.nextChar();
  }

  private nextChar(): void {
    this.pc += 1;
    if (this.currentChar === '\n') {
      this.col = 1;
      this.ln += 1;
    }
    else {
      this.col += 1;
    }
    if (this.pc < this.code.length) {
      this.currentChar = this.code[this.pc];
      return;
    }
    this.currentChar = 'EOF';
  }

  public nextToken(): Token {
    while (this.currentChar === ' ') {
      this.nextChar();
    }

    this.currentTokenLn = this.ln;
    this.currentTokenCol = this.col;

    if (!Number.isNaN(parseInt(this.currentChar)) || this.currentChar === '-') {
      return this.tokenizeNumberLiteral();
    }

    switch (this.currentChar) {
      case '"': {
        return this.tokenizeStringLiteral();
      }
      case '<': {
        return this.tokenizeHeredoc();
      }
      case '\n': {
        return this.tokenizeCurrentChar(TokenType.NEW_LINE);
      }
      case '{': {
        return this.tokenizeCurrentChar(TokenType.OPEN_BRACKET);
      }
      case '}': {
        return this.tokenizeCurrentChar(TokenType.CLOSE_BRACKET);
      }
      case '[': {
        return this.tokenizeCurrentChar(TokenType.OPEN_ARRAY);
      }
      case ']': {
        return this.tokenizeCurrentChar(TokenType.CLOSE_ARRAY);
      }
      case '=': {
        return this.tokenizeCurrentChar(TokenType.ASSIGNMENT_OP);
      }
      case ',': {
        return this.tokenizeCurrentChar(TokenType.ARRAY_ITEM_SEPERATOR);
      }
      case 'EOF': {
        return this.tokenizeCurrentChar(TokenType.EOF);
      }
      default: {
        let value = '';
        while (!['EOF', '\n', ' ', '"', '=', '{', '}', '[', ']', '\'', ','].includes(this.currentChar)) {
          value += this.currentChar;
          this.nextChar();
        }
        return {
          value: value,
          ln: this.currentTokenLn,
          col: this.currentTokenCol,
          tokenType: TokenType.SYMBOL
        };
      }
    }
  }

  private tokenizeStringLiteral(): Token {
    let value = this.currentChar;
    this.nextChar();
    while (this.currentChar !== '"') {
      value += this.currentChar;
      if (this.currentChar === '\\') {
        this.nextChar();
        value += this.currentChar;
      }
      if (['EOF', '\n'].includes(this.currentChar)) {
        return this.tokenizeValue(
          value,
          TokenType.STRING,
          'Expected "; Got \\\\n',
        );
      }
      this.nextChar();
    }
    value += this.currentChar;
    this.nextChar();
    return this.tokenizeValue(
      value,
      TokenType.STRING
    );
  }

  private tokenizeHeredoc(): Token {
    let value = this.currentChar;
    let tokenType = TokenType.HEREDOC;
    this.nextChar();
    let char = this.currentChar;
    if (char !== '<') {
      return this.tokenizeValue(
        value,
        tokenType,
        `Expected <; Got ${this.currentChar}`
      );
    }
    value += this.currentChar;
    this.nextChar();
    char = this.currentChar;
    if (char === '-') {
      tokenType = TokenType.INDENTED_HEREDOC;
      value += this.currentChar;
      this.nextChar();
      char = this.currentChar;
    }
    if (char === ' ' || char === '\n') {
      return this.tokenizeValue(
        value,
        tokenType,
        `Expected Heredoc tag; Got whitespace`
      );
    }
    let tag = '';
    while(![' ', '\n'].includes(this.currentChar)) {
      tag += this.currentChar;
      value += this.currentChar;
      this.nextChar();
    }
    while (this.currentChar === ' ') {
      this.nextChar();
    }
    char = this.currentChar;
    if (char !== '\n') {
      return this.tokenizeValue(
        value,
        tokenType,
        `Expected \\\\n; Got ${char}`
      );
    }
    value += this.currentChar;
    this.nextChar();
    let foundEndTag = false;
    while(!foundEndTag && this.currentChar !== 'EOF') {
      let currentLn = '';
      while (!['\n', 'EOF'].includes(this.currentChar)) {
        value += this.currentChar;
        currentLn += this.currentChar;
        this.nextChar();
      }
      if (currentLn.trim() === tag) {
        foundEndTag = true;
        break;
      }
      if (this.currentChar === 'EOF') {
        break;
      }
      value += this.currentChar;
      this.nextChar();
    }
    if (!foundEndTag) {
      return this.tokenizeValue(
        value,
        tokenType,
        `expected end tag "${tag}"; Got EOF`
      );
    }

    return this.tokenizeValue(
      value,
      tokenType
    );
  }

  private tokenizeNumberLiteral(): Token {
    let value = ''
    let decimalTally = 0;
    let tokenType = TokenType.INTEGER;
    if (this.currentChar === '-') {
      value += this.currentChar;
      this.nextChar();
      if (Number.isNaN(parseInt(this.currentChar))) {
        return this.tokenizeValue(
          value,
          tokenType,
          `Expected number; Got ${this.currentChar}`
        )
      }
    }
    while (!Number.isNaN(parseInt(this.currentChar))) {
      value += this.currentChar;
      this.nextChar();
      while (this.currentChar === '.') {
        decimalTally += 1;
        tokenType = TokenType.DECIMAL;
        value += this.currentChar;
        this.nextChar();
      }
    }
    if (decimalTally > 1) {
      return this.tokenizeValue(
        value,
        tokenType,
        `Expected 1 decimal; Got ${decimalTally}`
      );
    }
    return this.tokenizeValue(
      value,
      tokenType
    );
  }

  private tokenizeCurrentChar(tokenType: TokenType, error?: string): Token {
    const value = this.currentChar;
    this.nextChar();
    return this.tokenizeValue(
      value,
      tokenType,
      error
    );
  }

  private tokenizeValue(value: string, tokenType: TokenType, error?: string): Token {
    return {
      value: value,
      ln: this.currentTokenLn,
      col: this.currentTokenCol,
      tokenType: tokenType,
      tokenError: error,
    };
  }
}
