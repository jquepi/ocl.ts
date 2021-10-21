import fs from 'fs/promises';
import { Lexer } from './lexer';
import { Parser } from './parser';
import { TokenType } from './token';

(async () => {
  const code = await fs.readFile('./test.ocl', 'utf-8');
  const lexer = new Lexer(code);
  const parser = new Parser(lexer);
  await fs.writeFile('./ast.json', JSON.stringify(parser.getAST(), (key, value) => {
      if (key === 'parent' || key === 'children') {
        return;
      }
      if (key === 'tokenType') {
        return TokenType[value];
      }
      return value;
    }, 2));
})();
