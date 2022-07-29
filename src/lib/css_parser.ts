import { assert } from "std/testing/asserts";
import "../types/types.d.ts";

class CssParser {
  pos: number;
  source: string;

  constructor(source: string) {
    this.pos = 0;
    this.source = source;
  }

  consumeChar() {
    const c = this.source.substring(this.pos, this.pos + 1);
    this.pos++;
    return c;
  }

  nextChar() {
    return this.source.substring(this.pos, this.pos + 1);
  }

  consumeWhile(predicate: (char: string) => boolean) {
    let result = "";
    while (predicate(this.nextChar())) {
      result += this.consumeChar();
    }
    return result;
  }

  consumeWhitespace() {
    this.consumeWhile((char) => /\s/.test(char));
  }

  consumeComma() {
    if (this.nextChar() === ",") {
      this.consumeChar();
    }
  }

  isEof() {
    return this.pos >= this.source.length;
  }

  parseSelector(): Selector {
    const nextChar = this.nextChar();
    let sectorHeadSymbol = "";
    if (nextChar === "." || nextChar === "#") {
      sectorHeadSymbol = this.consumeChar();
    }
    const selectorName = this.consumeWhile((char) => /[\w_-]/.test(char));

    switch (sectorHeadSymbol) {
      case ".":
        return {
          type: "class",
          name: selectorName,
        };
      case "#":
        return {
          type: "id",
          name: selectorName,
        };
      default:
        return {
          type: "tag",
          name: selectorName,
        };
    }
  }

  parseSelectors() {
    const selectors: Selector[] = [];
    while (true) {
      this.consumeWhitespace();
      if (this.nextChar() === "{") {
        break;
      }
      selectors.push(this.parseSelector());
      this.consumeComma();
    }
    return selectors;
  }

  parseLength(): Length {
    const num = this.consumeWhile((char) => /\d/.test(char));
    const unit = this.consumeWhile((char) => /[a-zA-Z]/.test(char));
    return [Number(num), unit as Unit];
  }

  parseColor(): Color {
    const parseHexPair = () => {
      const a = this.consumeChar();
      const b = this.consumeChar();
      return parseInt(`${a}${b}`, 16);
    };

    assert(this.consumeChar() === "#");
    return {
      r: parseHexPair(),
      g: parseHexPair(),
      b: parseHexPair(),
      a: 255,
    };
  }

  parseValue() {
    this.consumeWhitespace();
    const nextC = this.nextChar();
    switch (true) {
      case /\d/.test(nextC):
        return this.parseLength();
      case /#/.test(nextC):
        return this.parseColor();
      default:
        return this.consumeWhile((char) => /[a-zA-Z]/.test(char));
    }
  }

  parseDeclaration() {
    const name = this.consumeWhile((char) => /[a-zA-Z-]/.test(char));
    this.consumeWhitespace();
    assert(this.nextChar() === ":");
    this.consumeChar();
    const value = this.parseValue();
    return {
      name,
      value,
    };
  }

  parseDeclarations() {
    const declarations = [];
    while (true) {
      this.consumeWhitespace();
      if (this.nextChar() === "}") {
        break;
      }
      declarations.push(this.parseDeclaration());
      this.consumeWhitespace();
      assert(this.nextChar() === ";");
      this.consumeChar(); // consume ";"
    }
    return declarations;
  }

  parse(): Stylesheet {
    const rules: Rule[] = [];
    while (true) {
      this.consumeWhitespace();
      if (this.isEof()) {
        break;
      }
      const selectors = this.parseSelectors();
      this.consumeChar(); // consume '{'
      const declarations = this.parseDeclarations();
      this.consumeChar(); // consume '}'
      rules.push({
        selectors,
        declarations,
      });
    }
    return {
      rules,
    };
  }
}

export const parse = (source: string): Stylesheet => {
  return new CssParser(source).parse();
};
