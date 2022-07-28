import { describe, it, expect } from "vitest";
import { parse } from "../cssParser";

describe("parse", () => {
  it.each<{ source: string, expected: Stylesheet }>([
    {
      source: `
        h1 {
          color: red;
        }
      `,
      expected: {
        rules: [
          {
            selectors: [
              {
                type: "tag",
                name: "h1"
              },
            ],
            declarations: [
              {
                name: 'color',
                value: "red"
              }
            ]
          },
        ]
      }
    },
    {
      source: `
        td {
          display: block;
        }
        h1, .foo, #aaa {
          color: red;
          font-size: 1em;
        }
      `,
      expected: {
        rules: [
          {
            selectors: [
              {
                type: "tag",
                name: "td"
              },
            ],
            declarations: [
              {
                name: 'display',
                value: "block"
              },
            ]
          },
          {
            selectors: [
              {
                type: "tag",
                name: "h1"
              },
              {
                type: "class",
                name: "foo"
              },
              {
                type: "id",
                name: "aaa"
              }
            ],
            declarations: [
              {
                name: 'color',
                value: "red"
              },
              {
                name: 'font-size',
                value: [1, "em"]
              }
            ]
          },
        ]
      }
    }
  ])("should parse text", ({ source, expected }) => {
    const node = parse(source);
    expect(node).toMatchObject(expected);
  });
});
