import { parse } from "../html_parser.ts";
import { assertEquals } from "std/testing/asserts";

Deno.test("simple text node", () => {
  const result = parse("Hello, world!");
  assertEquals(result, {
    nodeType: "Hello, world!",
    children: [],
  });
});

Deno.test("simple element node", () => {
  const result = parse("<div>Hello, world!</div>");
  assertEquals(result, {
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
  });
});

Deno.test("nested element node", () => {
  const result = parse(`
    <div id="1">
      <p>Hello, world!</p>
    </div>
  `);
  assertEquals(result, {
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
  });
});

Deno.test("multiple element node", () => {
  const result = parse(`
    <div>Hello, world!</div>
    <p>ryo</p>
  `);
  assertEquals(result, {
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
  });
});

Deno.test("element attribute", () => {
  const result = parse(`
    <div id="head" class="big-font black">Hello, world!</div>
  `);
  assertEquals(result, {
    nodeType: {
      tagName: "div",
      attributes: {
        id: "head",
        class: "big-font black",
      },
    },
    children: [
      {
        nodeType: "Hello, world!",
        children: [],
      },
    ],
  });
});
