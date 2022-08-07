import { assertEquals } from "std/testing/asserts";
import { parse as parseHtml } from "../html_parser.ts";
import { parse as parseCss } from "../css_parser.ts";
import { buildStyledTree } from "../styled_node.ts";
import { buildLayoutTree, calculateAutoSpaceToWidth } from "../layout_box.ts";
import { BOX_TYPE, DEFAULT_DIMENSIONS } from "../../constants.ts";
import { Dimensions, Value } from "../../types/types.ts";

Deno.test("buildLayoutTree", async (t) => {
  await t.step("build only block node", () => {
    const styledNode = buildStyledTree(
      parseHtml("<h1></h1>"),
      parseCss(""),
    );
    const result = buildLayoutTree(styledNode);
    assertEquals(result.boxType, BOX_TYPE.BLOCK);
    assertEquals(result.children, []);
    assertEquals(result.node, styledNode);
  });

  await t.step("build nested block node", () => {
    const styledNode = buildStyledTree(
      parseHtml(`
        <h1>
          <p>hello world</p>
        </h1>
      `),
      parseCss(""),
    );

    const result = buildLayoutTree(styledNode);

    assertEquals(result.boxType, BOX_TYPE.BLOCK);
    assertEquals(result.children[0].boxType, BOX_TYPE.BLOCK);
    assertEquals(result.children[0].boxType, BOX_TYPE.BLOCK);
    assertEquals(result.node, styledNode);
  });

  await t.step("build nested inline node", () => {
    const styledNode = buildStyledTree(
      parseHtml(`
        <h1>
          hello world
          <span>hello world</span>
          hello world
        </h1>
      `),
      parseCss(""),
    );

    const result = buildLayoutTree(styledNode);

    assertEquals(result.boxType, BOX_TYPE.BLOCK);
    assertEquals(result.children[0].boxType, BOX_TYPE.ANONYMOUS);
    assertEquals(result.children[0].children[0].boxType, BOX_TYPE.INLINE);
    assertEquals(result.children[0].children[0].children, []);
    assertEquals(result.children[0].children[1].boxType, BOX_TYPE.INLINE);
    assertEquals(
      result.children[0].children[1].children[0].boxType,
      BOX_TYPE.INLINE,
    );
    assertEquals(
      result.children[0].children[1].children[0].node?.node,
      "hello world",
    );
    assertEquals(result.children[0].children[2].boxType, BOX_TYPE.INLINE);
    assertEquals(result.children[0].children[2].boxType, BOX_TYPE.INLINE);
  });
});

Deno.test("calculateAutoSpaceToWidth", async (t) => {
  const testcase: {
    title: string;
    args: Parameters<typeof calculateAutoSpaceToWidth>[0];
    expected: { width: Value; marginLeft: Value; marginRight: Value };
  }[] = [
    {
      title: "all 0px",
      args: {
        width: [0, "px"],
        marginLeft: [0, "px"],
        marginRight: [0, "px"],
        totalWidth: 0,
        containingBlockWidth: 0,
      },
      expected: {
        width: [0, "px"],
        marginLeft: [0, "px"],
        marginRight: [0, "px"],
      },
    },
    {
      title: "auto width",
      args: {
        width: "auto",
        marginLeft: [100, "px"],
        marginRight: [100, "px"],
        totalWidth: 250,
        containingBlockWidth: 300,
      },
      expected: {
        width: [50, "px"],
        marginLeft: [100, "px"],
        marginRight: [100, "px"],
      },
    },
    {
      title: "auto width and auto marginLeft",
      args: {
        width: "auto",
        marginLeft: "auto",
        marginRight: [100, "px"],
        totalWidth: 120,
        containingBlockWidth: 300,
      },
      expected: {
        width: [180, "px"],
        marginLeft: [0.0, "px"],
        marginRight: [100, "px"],
      },
    },
    {
      title: "auto width and auto marginRight",
      args: {
        width: "auto",
        marginLeft: [100, "px"],
        marginRight: "auto",
        totalWidth: 120,
        containingBlockWidth: 300,
      },
      expected: {
        width: [180, "px"],
        marginLeft: [100, "px"],
        marginRight: [0.0, "px"],
      },
    },
    {
      title: "auto width and auto marginRight and negative underflow",
      args: {
        width: "auto",
        marginLeft: [100, "px"],
        marginRight: "auto",
        totalWidth: 120,
        containingBlockWidth: 100,
      },
      expected: {
        width: [0.0, "px"],
        marginLeft: [100, "px"],
        marginRight: [-20, "px"],
      },
    },
    {
      title: "auto marginLeft and auto marginRight",
      args: {
        width: [200, "px"],
        marginLeft: "auto",
        marginRight: "auto",
        totalWidth: 220,
        containingBlockWidth: 300,
      },
      expected: {
        width: [200, "px"],
        marginLeft: [40, "px"],
        marginRight: [40, "px"],
      },
    },
    {
      title: "auto marginRight",
      args: {
        width: [200, "px"],
        marginLeft: [50, "px"],
        marginRight: "auto",
        totalWidth: 270,
        containingBlockWidth: 300,
      },
      expected: {
        width: [200, "px"],
        marginLeft: [50, "px"],
        marginRight: [30, "px"],
      },
    },
    {
      title: "auto marginLeft",
      args: {
        width: [200, "px"],
        marginLeft: "auto",
        marginRight: [50, "px"],
        totalWidth: 270,
        containingBlockWidth: 300,
      },
      expected: {
        width: [200, "px"],
        marginLeft: [30, "px"],
        marginRight: [50, "px"],
      },
    },
  ];

  for (const { title, args, expected } of testcase) {
    await t.step(title, () => {
      const result = calculateAutoSpaceToWidth(args);
      assertEquals(result, expected);
    });
  }
});

Deno.test("calculateAutoSpaceToWidth", () => {
  const html = parseHtml(`
        <div class="outer">
          <div  class="inner">
          </div>
        </div>
  `);
  const css = parseCss(`
    .outer {
      width: 300px;
      border-left-width: 10px;
      border-right-width: 20px;
    }
    .inner {
      width: 200px;
      border-width: 5px;
      margin-left: auto;
      margin-right: auto;
    }`);
  const styledNode = buildStyledTree(html, css);
  const layoutBox = buildLayoutTree(styledNode);

  const containingBlock: Dimensions = {
    ...JSON.parse(JSON.stringify(DEFAULT_DIMENSIONS)),
    content: {
      x: 0,
      y: 0,
      width: 500,
      height: 0,
    },
  };

  layoutBox.layout(containingBlock);

  assertEquals(layoutBox.dimensions.content.width, 300);
  assertEquals(layoutBox.dimensions.border.left, 10);
  assertEquals(layoutBox.dimensions.border.right, 20);
  assertEquals(layoutBox.dimensions.margin.right, 170);
  assertEquals(layoutBox.dimensions.margin.left, 0);
  assertEquals(layoutBox.children[0].dimensions.content.width, 200);
  assertEquals(layoutBox.children[0].dimensions.border.right, 5);
  assertEquals(layoutBox.children[0].dimensions.border.left, 5);
  assertEquals(layoutBox.children[0].dimensions.margin.left, 45);
  assertEquals(layoutBox.children[0].dimensions.margin.right, 45);
});
