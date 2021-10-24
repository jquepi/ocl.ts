import fs from 'fs/promises';
import { Lexer } from '../src/lexer';
import { Parser } from '../src/parser';
import { TokenType } from '../src/token';

test("read and write", async () => {
  const code = await fs.readFile('./__tests__/test.ocl', 'utf-8');
  const lexer = new Lexer(code);
  const parser = new Parser(lexer);
  await fs.writeFile('./__tests__/ast.json', JSON.stringify(parser.getAST(), (key, value) => {
      if (key === 'parent' || key === 'children') {
        return;
      }
      if (key === 'tokenType') {
        return TokenType[value];
      }
      return value;
    }, 2));
});
