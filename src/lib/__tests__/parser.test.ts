import { describe, it, expect } from "vitest";
import { parse } from "../parser";

describe("parse", () => {
  it.each<{ source: string; expected: ToyNode }>([
    {
      source: `<div>Hello, world!</div>`,
      expected: {
        node: {
          tagName: "div",
          attributes: {},
        },
        children: [
          {
            node: "Hello, world!",
            children: [],
          },
        ],
      },
    },
    {
      source: `<div>Hello, world!</div><p>ryo</p>`,
      expected: {
        node: {
          tagName: "html",
          attributes: {},
        },
        children: [
          {
            node: {
              tagName: "div",
              attributes: {},
            },
            children: [
              {
                node: "Hello, world!",
                children: [],
              },
            ],
          },
          {
            node: {
              tagName: "p",
              attributes: {},
            },
            children: [
              {
                node: "ryo",
                children: [],
              },
            ],
          },
        ],
      },
    },
    {
      source: `
      <div id="1">
        <p>Hello, world!</p>
      </div>
      `,
      expected: {
        node: {
          tagName: "div",
          attributes: {
            id: "1",
          },
        },
        children: [
          {
            node: {
              tagName: "p",
              attributes: {},
            },
            children: [
              {
                node: "Hello, world!",
                children: [],
              },
            ],
          },
        ],
      },
    },
  ])("should parse text", ({ source, expected }) => {
    const node = parse(source);
    expect(node).toMatchObject(expected);
  });
});
