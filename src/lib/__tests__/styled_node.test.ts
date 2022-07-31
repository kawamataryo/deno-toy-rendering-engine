import "../../types/types.d.ts";
import { assertEquals } from "std/testing/asserts";
import { parse as parseHtml } from "../html_parser.ts";
import { parse as parseCss } from "../css_parser.ts";
import { createStyledNode, StyledNode } from "../styled_node.ts";

Deno.test("createStyledTree", async (t) => {
  type ExpectedStyledNode = {
    node: ToyNodeType;
    specificValues: PropertyMap;
    children: ExpectedStyledNode[];
  };

  const assertStyledNodeEquals = (
    result: StyledNode,
    expected: ExpectedStyledNode,
  ): void => {
    assertEquals(result.node, expected.node);
    assertEquals(result.specificValues, expected.specificValues);
    result.children.forEach((n, index) => {
      assertStyledNodeEquals(n, expected.children[index]);
    });
  };

  const testCase: {
    case: { title: string; html: string; css: string };
    expected: ExpectedStyledNode;
  }[] = [
    {
      case: {
        title: "only text node",
        html: "hello world!!",
        css: "",
      },
      expected: {
        node: "hello world!!",
        specificValues: {},
        children: [],
      },
    },
    {
      case: {
        title: "only element node",
        html: "<h1></h1>",
        css: "",
      },
      expected: {
        node: { tagName: "h1", attributes: {} },
        specificValues: {},
        children: [],
      },
    },
    {
      case: {
        title: "only element node with style",
        html: "<h1 id='headline'></h1>",
        css: `
          #headline {
            color: red;
          }
        `,
      },
      expected: {
        node: { tagName: "h1", attributes: { id: "headline" } },
        specificValues: {
          color: "red",
        },
        children: [],
      },
    },
    {
      case: {
        title: "Adapting a highly detailed style",
        html: "<h1 id='id' class='class'></h1>",
        css: `
          h1 {
            color: red;
          }
          #id {
            color: blue;
          }
          .class {
            color: green;
          }
        `,
      },
      expected: {
        node: { tagName: "h1", attributes: { id: "id", class: "class" } },
        specificValues: {
          color: "blue",
        },
        children: [],
      },
    },
    {
      case: {
        title: "nested element node with style",
        html: `
          <div id="header">
            <h1 class="title">My Blog</h1>
            <p class="subtitle">learning log</p>
          </div>
        `,
        css: `
          #header {
            font-size: 30px;
          }
          .title, .subtitle, #header {
            color: #ffff00;
          }
          p {
            display: inline-block;
          }
        `,
      },
      expected: {
        node: { tagName: "div", attributes: { id: "header" } },
        specificValues: {
          "font-size": [30, "px"],
          color: {
            r: 255,
            g: 255,
            b: 0,
            a: 255,
          },
        },
        children: [
          {
            node: { tagName: "h1", attributes: { class: "title" } },
            specificValues: {
              color: {
                r: 255,
                g: 255,
                b: 0,
                a: 255,
              },
            },
            children: [{ node: "My Blog", specificValues: {}, children: [] }],
          },
          {
            node: { tagName: "p", attributes: { class: "subtitle" } },
            specificValues: {
              color: {
                r: 255,
                g: 255,
                b: 0,
                a: 255,
              },
              display: "inline-block",
            },
            children: [{
              node: "learning log",
              specificValues: {},
              children: [],
            }],
          },
        ],
      },
    },
  ];

  for (const c of testCase) {
    await t.step(c.case.title, () => {
      const result = createStyledNode(
        parseHtml(c.case.html),
        parseCss(c.case.css),
      );
      assertStyledNodeEquals(result, c.expected);
    });
  }
});
