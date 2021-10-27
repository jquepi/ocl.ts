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
  children?: AST;
  parent?: ASTNode;
  problems?: string[];
  type: NodeType;
}

export interface ArrayNode extends BaseNode {
  arrayEnd: Token;
  arrayStart: Token;
  children: AST;
  type: NodeType.ARRAY_NODE;
  values: (LiteralNode|DictionaryNode|RecoveryNode)[];
}

export interface AttributeNode extends BaseNode {
  assignmentOp: Token;
  children: AST;
  name: Token;
  type: NodeType.ATTRIBUTE_NODE;
  value: ASTNode;
}

export interface BlockNode extends BaseNode {
  block: AST;
  blockEnd: Token;
  blockStart: Token;
  children: AST;
  labels?: LiteralNode[];
  name: Token;
  type: NodeType.BLOCK_NODE;
}

export interface DictionaryNode extends BaseNode {
  blockEnd: Token;
  blockStart: Token;
  children: AST;
  entries: AttributeNode[];
  type: NodeType.DICTIONARY_NODE;
}

export interface EOFNode extends BaseNode {
  type: NodeType.EOF_NODE;
  value: Token;
}

export interface LiteralNode extends BaseNode {
  literalType: LiteralType;
  type: NodeType.LITERAL_NODE;
  value: Token;
}

export interface RecoveryNode extends BaseNode {
  type: NodeType.RECOVERY_NODE;
  unexpectedToken: Token;
}
