import { 
  ArrayNode,
  AST,
  ASTNode,
  AttributeNode,
  BlockNode,
  DictionaryNode,
  EOFNode,
  LiteralNode,
  LiteralType, 
  NodeType,
  RecoveryNode
} from "./ast";
import type { Lexer } from "./lexer";
import { Token, TokenType } from "./token";

export class Parser {
  private tokens: Token[];
  private ast: AST;
  private currentToken: Token;
  private pc: number; // program counter

  constructor(lexer: Lexer) {
    this.ast = [];
    let token = lexer.nextToken();
    this.tokens = [];
    this.tokens.push(token);
    while (token.tokenType !== TokenType.EOF) {
      token = lexer.nextToken();
      this.tokens.push(token);
    }
    this.pc = 0;
    this.currentToken = this.tokens[this.pc];
    this.createAST();
  }

  private nextToken(): void {
    this.pc += 1;
    if (this.pc >= this.tokens.length) {
      this.currentToken = this.tokens[this.tokens.length - 1];
    }
    this.currentToken = this.tokens[this.pc];
  }

  private peekToken(i = 1): Token {
    if (this.pc + i >= this.tokens.length) {
      return this.tokens[this.tokens.length - 1];
    }
    return this.tokens[this.pc + i];
  }

  private nextNode(): ASTNode {
    while (this.currentToken.tokenType === TokenType.NEW_LINE) {
      this.nextToken();
    }
    switch(this.currentToken.tokenType) {
      case TokenType.SYMBOL: {
        return this.handleSymbol();
      }
      case TokenType.EOF: {
        return {
          type: NodeType.EOF_NODE,
          value: this.currentToken
        } as EOFNode;
      }
      default: {
        const token = this.currentToken;
        this.nextToken();
        return this.handleRecoveryNode(
          'Unexpected Token. Expected Assignment Name or Block Name.',
          token
        );
      }
    }
  }

  private handleSymbol(): AttributeNode | BlockNode {
    switch(this.peekToken().tokenType) {
      case TokenType.ASSIGNMENT_OP: {
        return this.handleAttribute();
      }
      case TokenType.STRING: {
        return this.handleBlockNode();
      }
      case TokenType.OPEN_BRACKET: {
        return this.handleBlockNode();
      }
      default: {
        // TODO change to handle unexpted token
        return this.handleAttribute();
      }
    }
  }

  private handleAttribute(): AttributeNode {
    const name = this.currentToken;
    this.nextToken();
    const assignmentOp = this.currentToken;
    this.nextToken();
    let value: ASTNode;
    switch (this.currentToken.tokenType) {
      case TokenType.STRING: {
        value = this.handleLiteralNode(LiteralType.STRING);
        break;
      }
      case TokenType.INTEGER: {
        value = this.handleLiteralNode(LiteralType.INTEGER);
        break;
      }
      case TokenType.DECIMAL: {
        value = this.handleLiteralNode(LiteralType.DECIMAL)
        break;
      }
      case TokenType.OPEN_BRACKET: {
        value = this.handleDictionaryNode();
        break;
      }
      case TokenType.OPEN_ARRAY: {
        value = this.handleArrayNode();
        break;
      }
      case TokenType.HEREDOC: {
        value = this.handleLiteralNode(LiteralType.HEREDOC);
        break;
      }
      case TokenType.INDENTED_HEREDOC: {
        value = this.handleLiteralNode(LiteralType.INDENTED_HEREDOC);
        break;
      }
      default: {
        if (this.currentToken.value === 'true') {
          value = this.handleLiteralNode(LiteralType.TRUE);
        }
        else if (this.currentToken.value === 'false') {
          value = this.handleLiteralNode(LiteralType.FALSE);
        }
        else {
          value = this.handleRecoveryNode(
            'Unexpected token. Expected literal, dictionary or array after assignment operator.',
            this.currentToken
          );
        }
        break;
      }
    }
    const attributetNode: AttributeNode = {
      assignmentOp,
      name,
      type: NodeType.ATTRIBUTE_NODE,
      value: value,
      children: [value],
    };
    value.parent = attributetNode;
    this.nextToken();
    return attributetNode;
  }

  private handleLiteralNode(literalType: LiteralType, newLineRequired = true): LiteralNode {
    const problems: string[] = [];
    if (newLineRequired === true) {
      if (![TokenType.NEW_LINE, TokenType.EOF].includes(this.peekToken().tokenType)) {
        problems.push('Unexpected token. Expected next token to be newline.')
      }
    }
    if (this.currentToken.tokenError) {
      problems.push(this.currentToken.tokenError);
    }
    return {
      literalType,
      type: NodeType.LITERAL_NODE,
      value: this.currentToken,
      problems: problems,
    }
  }

  private handleDictionaryNode(): DictionaryNode {
    const blockStart = this.currentToken;
    this.nextToken();
    // TODO handle missing newline
    const entries: DictionaryNode["entries"] = [];
    while (this.peekToken().tokenType !== TokenType.CLOSE_BRACKET) {
      // TODO handle when token is not attibute
      if (this.currentToken.tokenType === TokenType.SYMBOL) {
        entries.push(this.handleAttribute());
      } else {
        this.nextToken();
      } 
    }
    this.nextToken();
    const blockEnd = this.currentToken;
    // TODO handle missing newline
    const dictionaryNode: DictionaryNode = {
      children: entries,
      blockStart,
      blockEnd,
      entries,
      type: NodeType.DICTIONARY_NODE
    };
    for (const attribute of entries) {
      attribute.parent = dictionaryNode;
    }
    return dictionaryNode;
  }

  public handleArrayNode(): ArrayNode {
    const arrayStart = this.currentToken;
    this.nextToken();
    // TODO handle unexpted token & newline
    const values: ArrayNode["values"] = [];
    while (this.currentToken.tokenType !== TokenType.CLOSE_ARRAY) {
      // TODO handle when token is not litteral or seperator
      switch (this.currentToken.tokenType) {
        case TokenType.STRING: {
          values.push(this.handleLiteralNode(LiteralType.STRING, false));
          break;
        }
        case TokenType.INTEGER: {
          values.push(this.handleLiteralNode(LiteralType.INTEGER, false));
          break;
        }
        case TokenType.DECIMAL: {
          values.push(this.handleLiteralNode(LiteralType.DECIMAL, false));
          break;
        }
        // case TokenType.OPEN_BRACKET: {
        //   values.push(this.handleDictionaryNode());
        //   break;
        // }
      }
      this.nextToken();
      // TODO handle missing seperator
      if (this.currentToken.tokenType === TokenType.ARRAY_ITEM_SEPERATOR) {
        this.nextToken();
      }

      // handle new lines correctly
      while (this.currentToken.tokenType === TokenType.NEW_LINE) {
        this.nextToken();
      }
      
    }
    // TODO handle when not closing token
    const arrayEnd = this.currentToken;
    this.nextToken();
    const arrayNode: ArrayNode = {
      children: values,
      type: NodeType.ARRAY_NODE,
      arrayStart,
      arrayEnd,
      values
    }
    for (const val of values) {
      val.parent = arrayNode;
    }
    return arrayNode;
  }

  private handleBlockNode(): BlockNode {
    const name = this.currentToken;
    this.nextToken();
    const labels: BlockNode["labels"] = [];
    while (this.currentToken.tokenType === TokenType.STRING) {
      labels.push(this.handleLiteralNode(LiteralType.STRING, false));
      this.nextToken();
    }
    if (this.currentToken.tokenType !== TokenType.OPEN_BRACKET) {
      // TODO handle missing open bracket
    }
    const blockStart = this.currentToken;
    this.nextToken();
    // TODO handle new line
    this.nextToken();
    const block: BlockNode["block"] = [];
    while (![TokenType.CLOSE_BRACKET, TokenType.EOF].includes(this.peekToken().tokenType)) {
      block.push(this.nextNode());
    }
    this.nextToken();
    const blockEnd = this.currentToken;
    this.nextToken();
    const blockNode: BlockNode = {
      block,
      blockStart,
      blockEnd,
      children: block,
      type: NodeType.BLOCK_NODE,
      name,
    }
    if (labels.length > 0) {
      for (const label of labels) {
        label.parent = blockNode;
      }
      blockNode.labels = labels;
    }
    for (const astNode of block) {
      astNode.parent = blockNode;
    }
    return blockNode;
  }

  private handleRecoveryNode(errorMsg: string, unexpectedToken: Token): RecoveryNode {
    return {
      problems: [errorMsg],
      type: NodeType.RECOVERY_NODE,
      unexpectedToken
    };
  }

  private createAST(): void {
    while (this.currentToken !== undefined && this.currentToken.tokenType !== TokenType.EOF) {
      this.ast.push(this.nextNode());
    }
  }

  public getAST() {
    return this.ast;
  }
}
