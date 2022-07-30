import "../../types/types.d.ts";
import { assertEquals } from "std/testing/asserts";
import { parse as parseHtml } from "../html_parser.ts";
import { parse as parseCss } from "../css_parser.ts";
import { createStyledTree, matches } from "../create_styled_tree.ts";

Deno.test("matches", async (t) => {
  const testCase: {
    case: { title: string; nodeType: ToyNodeType; selector: Selector };
    expected: boolean;
  }[] = [
    {
      case: {
        title: "tagname1",
        nodeType: { tagName: "h1", attributes: {} },
        selector: { type: "tag", name: "h1" },
      },
      expected: true,
    },
    {
      case: {
        title: "tagname2",
        nodeType: { tagName: "h1", attributes: {} },
        selector: { type: "tag", name: "p" },
      },
      expected: false,
    },
    {
      case: {
        title: "class1",
        nodeType: { tagName: "h1", attributes: { class: "title" } },
        selector: { type: "class", name: "title" },
      },
      expected: true,
    },
    {
      case: {
        title: "class2",
        nodeType: { tagName: "h1", attributes: { class: "title detail" } },
        selector: { type: "class", name: "detail" },
      },
      expected: true,
    },
    {
      case: {
        title: "class3",
        nodeType: { tagName: "h1", attributes: { class: "title detail" } },
        selector: { type: "class", name: "foo" },
      },
      expected: false,
    },
    {
      case: {
        title: "id1",
        nodeType: { tagName: "h1", attributes: { id: "title", class: "foo" } },
        selector: { type: "id", name: "title" },
      },
      expected: true,
    },
    {
      case: {
        title: "id2",
        nodeType: { tagName: "h1", attributes: { id: "title" } },
        selector: { type: "id", name: "foo" },
      },
      expected: false,
    },
  ];

  for (const c of testCase) {
    await t.step(c.case.title, () => {
      assertEquals(matches(c.case.nodeType, c.case.selector), c.expected);
    });
  }
});

Deno.test("createStyledTree", async (t) => {
  const testCase: {
    case: { title: string; html: string; css: string };
    expected: StyledNode;
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
      const node = parseHtml(c.case.html);
      const stylesheet = parseCss(c.case.css);
      assertEquals(
        createStyledTree(node, stylesheet),
        c.expected,
      );
    });
  }
});
