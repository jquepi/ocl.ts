import { Token } from "./token";

export type AST = ASTNode[];
export type ASTNode = AttributeNode | DictionaryNode | ArrayNode | LiteralNode | BlockNode | EOFNode | RecoveryNode;

export enum NodeType {
  ATTRIBUTE_NODE = 'AttributeNode',
  DICTIONARY_NODE = 'DictionaryNode',
  LITERAL_NODE = 'LiteralNode',
  ARRAY_NODE = 'ArrayNode',
  BLOCK_NODE = 'BlockNode',
  EOF_NODE = 'EOFNode',
  RECOVERY_NODE = 'RecoveryNode'
}

export enum LiteralType {
  STRING = 'string',
  INTEGER = 'integer',
  DECIMAL = 'decimal',
  HEREDOC = 'heredoc',
  INDENTED_HEREDOC = 'indentedHeredoc'
}

export interface BaseNode {
  type: NodeType;
  children?: AST;
  parent?: ASTNode;
  problems?: string[];
}

export interface AttributeNode extends BaseNode {
  children: AST;
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
