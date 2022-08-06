import { assertEquals } from "std/testing/asserts";
import { parse as parseHtml } from "../html_parser.ts";
import { parse as parseCss } from "../css_parser.ts";
import { buildStyledTree } from "../styled_node.ts";
import { buildLayoutTree } from "../layout_box.ts";
import { BOX_TYPE } from "../../constants.ts";

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
