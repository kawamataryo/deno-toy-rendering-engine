import { parse } from "../html_parser.ts";
import { assertObjectMatch } from "std/testing/asserts";

Deno.test("simple text node", () => {
  const result = parse("Hello, world!");
  assertObjectMatch(result, {
    node: "Hello, world!",
    children: [],
  });
});

Deno.test("simple element node", () => {
  const result = parse("<div>Hello, world!</div>");
  assertObjectMatch(result, {
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
  });
});

Deno.test("nested element node", () => {
  const result = parse(`
    <div id="1">
      <p>Hello, world!</p>
    </div>
  `);
  assertObjectMatch(result, {
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
  });
});

Deno.test("multiple element node", () => {
  const result = parse(`
    <div>Hello, world!</div>
    <p>ryo</p>
  `);
  assertObjectMatch(result, {
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
  });
});
