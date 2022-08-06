import { assert } from "std/testing/asserts";
import { TAG_NAME, ToyNode } from "../types/types.ts";

const createTextNode = (text: string): ToyNode => {
  return {
    children: [],
    nodeType: text,
  };
};

const createElement = (
  name: TAG_NAME,
  attributes: Record<string, string>,
  children: ToyNode[],
): ToyNode => {
  return {
    children,
    nodeType: {
      tagName: name,
      attributes,
    },
  };
};

class HtmlParser {
  private pos: number;
  private input: string;

  constructor(input: string) {
    this.pos = 0;
    this.input = input;
  }

  parseNodes(): ToyNode[] {
    const nodes: ToyNode[] = [];
    while (true) {
      this.consumeWhiteSpace();
      if (this.eof() || this.startWith("</")) {
        break;
      }
      nodes.push(this.parseNode());
    }

    return nodes;
  }

  private nextChar(): string {
    return this.input.substring(this.pos, this.pos + 1);
  }

  private startWith(s: string): boolean {
    return this.input.substring(this.pos).startsWith(s);
  }

  private eof(): boolean {
    return this.pos >= this.input.length;
  }

  private consumeChar(): string {
    const c = this.input.substring(this.pos, this.pos + 1);
    this.pos++;
    return c;
  }

  private consumeWhile(test: (n: string) => boolean): string {
    let result = "";
    while (!this.eof() && test(this.nextChar())) {
      result += this.consumeChar();
    }
    return result;
  }

  private consumeWhiteSpace(): void {
    this.consumeWhile((c) => /\s/.test(c));
  }

  private parseTagName(): TAG_NAME {
    return this.consumeWhile((c) => /\w/.test(c)) as TAG_NAME;
  }

  private parseNode(): ToyNode {
    return this.nextChar() === "<" ? this.parseElement() : this.parseText();
  }

  private parseText(): ToyNode {
    return createTextNode(this.consumeWhile((c) => c != "<"));
  }

  private parseElement(): ToyNode {
    assert(this.consumeChar() === "<");
    const tagName = this.parseTagName();
    const attrs = this.parseAttributes();
    assert(this.consumeChar() === ">");

    const children = this.parseNodes();

    assert(this.consumeChar() === "<");
    assert(this.consumeChar() === "/");
    assert(this.parseTagName() === tagName);
    assert(this.consumeChar() === ">");

    return createElement(tagName, attrs, children);
  }

  private parseAttr(): Record<string, string> {
    const name = this.parseTagName();
    assert(this.consumeChar() === "=");
    const value = this.parseAttrValue();
    return { name, value };
  }

  private parseAttrValue(): string {
    const openQuote = this.consumeChar();
    assert(openQuote === '"' || openQuote === "'");
    const value = this.consumeWhile((c) => c !== openQuote);
    assert(this.consumeChar() === openQuote);
    return value;
  }

  private parseAttributes(): Record<string, string> {
    const attributes: Record<string, string> = {};
    while (true) {
      this.consumeWhiteSpace();
      if (this.nextChar() === ">") {
        break;
      }
      const { name, value } = this.parseAttr();
      attributes[name] = value;
    }
    return attributes;
  }
}

export const parse = (source: string): ToyNode => {
  const nodes = new HtmlParser(source).parseNodes();
  if (nodes.length === 1) {
    return nodes[0];
  } else {
    return createElement("html", {}, nodes);
  }
};
