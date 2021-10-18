import fs from 'fs/promises';
import { Lexer } from './lexer';
import { TokenType } from './token';

(async () => {
  const code = await fs.readFile('./test.ocl', 'utf-8');
  const lexer = new Lexer(code);
  let token = lexer.nextToken();
  while (token.tokenType !== TokenType.EOF) {
    console.log(
`Value: ${token.value}
Type: ${TokenType[token.tokenType]}
Ln: ${token.ln}
Col: ${token.col}
Error: ${token.tokenError}
`
    );
    token = lexer.nextToken();
  }
})();
