import { parse } from "../css_parser.ts";
import { assertObjectMatch } from "std/testing/asserts";

Deno.test("simple css", () => {
  const result = parse(`
        h1 {
          color: red;
        }
  `);
  assertObjectMatch(result, {
    rules: [
      {
        selectors: [
          {
            type: "tag",
            name: "h1",
          },
        ],
        declarations: [
          {
            name: "color",
            value: "red",
          },
        ],
      },
    ],
  });
});

Deno.test("multiple css", () => {
  const result = parse(`
        td {
          display: block;
        }
        h1, .foo, #aaa {
          color: red;
          font-size: 1em;
          background: #ffee12;
        }
  `);
  assertObjectMatch(result, {
    rules: [
      {
        selectors: [
          {
            type: "tag",
            name: "td",
          },
        ],
        declarations: [
          {
            name: "display",
            value: "block",
          },
        ],
      },
      {
        selectors: [
          {
            type: "tag",
            name: "h1",
          },
          {
            type: "class",
            name: "foo",
          },
          {
            type: "id",
            name: "aaa",
          },
        ],
        declarations: [
          {
            name: "color",
            value: "red",
          },
          {
            name: "font-size",
            value: [1, "em"],
          },
        ],
      },
    ],
  });
});
