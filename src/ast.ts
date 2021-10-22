import type { Token } from "./token";

export type AST = ASTNode[];
export type ASTNode = AttributeNode | DictionaryNode | ArrayNode | LiteralNode | BlockNode | EOFNode | RecoveryNode;

export enum NodeType {
  ARRAY_NODE = 'ArrayNode',
  ATTRIBUTE_NODE = 'AttributeNode',
  BLOCK_NODE = 'BlockNode',
  DICTIONARY_NODE = 'DictionaryNode',
  EOF_NODE = 'EOFNode',
  LITERAL_NODE = 'LiteralNode',
  RECOVERY_NODE = 'RecoveryNode'
}

export enum LiteralType {
  DECIMAL = 'decimal',
  FALSE = 'false',
  HEREDOC = 'heredoc',
  INDENTED_HEREDOC = 'indentedHeredoc',
  INTEGER = 'integer',
  STRING = 'string',
  TRUE = 'true'
}

export interface BaseNode {
  type: NodeType;
  children?: AST;
  parent?: ASTNode;
  problems?: string[];
}

export interface AttributeNode extends BaseNode {
  children: AST;
  type: NodeType.ATTRIBUTE_NODE;
  assignmentOp: Token;
  name: Token;
  value: ASTNode;
}

export interface DictionaryNode extends BaseNode {
  children: AST;
  type: NodeType.DICTIONARY_NODE;
  blockStart: Token;
  entries: AttributeNode[];
  blockEnd: Token;
}

export interface ArrayNode extends BaseNode {
  children: AST;
  type: NodeType.ARRAY_NODE;
  arrayStart: Token;
  values: (LiteralNode|DictionaryNode)[];
  arrayEnd: Token;
}

export interface LiteralNode extends BaseNode {
  type: NodeType.LITERAL_NODE;
  value: Token;
  literalType: LiteralType;
}

export interface BlockNode extends BaseNode {
  children: AST;
  type: NodeType.BLOCK_NODE;
  name: Token;
  lables?: LiteralNode[];
  blockStart: Token;
  block: AST;
  blockEnd: Token;
}

export interface EOFNode extends BaseNode {
  value: Token;
  type: NodeType.EOF_NODE;
}

export interface RecoveryNode extends BaseNode {
  type: NodeType.RECOVERY_NODE;
  unexpectedToken: Token;
}
