import { describe, it, expect } from "vitest";
import { parse } from "../parser";

describe("parse", () => {
  it.each<{ source: string; expected: ToyNode }>([
    {
      source: `<div>Hello, world!</div>`,
      expected: {
        nodeType: {
          tagName: "div",
          attributes: {},
        },
        children: [
          {
            nodeType: "Hello, world!",
            children: [],
          },
        ],
      },
    },
    {
      source: `<div>Hello, world!</div><p>ryo</p>`,
      expected: {
        nodeType: {
          tagName: "html",
          attributes: {},
        },
        children: [
          {
            nodeType: {
              tagName: "div",
              attributes: {},
            },
            children: [
              {
                nodeType: "Hello, world!",
                children: [],
              },
            ],
          },
          {
            nodeType: {
              tagName: "p",
              attributes: {},
            },
            children: [
              {
                nodeType: "ryo",
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
        nodeType: {
          tagName: "div",
          attributes: {
            id: "1",
          },
        },
        children: [
          {
            nodeType: {
              tagName: "p",
              attributes: {},
            },
            children: [
              {
                nodeType: "Hello, world!",
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
