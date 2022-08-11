import { assertEquals } from "std/testing/asserts";
import { parse as parseHtml } from "../html_parser.ts";
import { parse as parseCss } from "../css_parser.ts";
import { buildStyledTree } from "../styled_node.ts";
import { paint } from "../painting.ts";
import { DEFAULT_DIMENSIONS } from "../../constants.ts";
import { layoutTree } from "../layout_box.ts";

Deno.test("paint", () => {
  const initialContainingBlock = {
    ...DEFAULT_DIMENSIONS,
    content: { x: 0, y: 0, width: 10, height: 10 },
  };

  const rootNode = parseHtml(`
    <div class="wrapper">
      <div class="inner">
        <div class="inner-inner">
        </div>
      </div>
    </div>
  `);
  const stylesheet = parseCss(`
    .wrapper {
      margin: 1px;
      padding: 1px;
      background-color: #ff0000;
    }
    .inner {
      padding: 1px;
      background-color: #ffa500;
      border-width: 1px;
      border-color: #000000;
    }
    .inner-inner {
      padding: 1px;
      background-color: #008000;
    }
  `);
  const styledNode = buildStyledTree(rootNode, stylesheet);
  const layoutRoot = layoutTree(
    styledNode,
    JSON.parse(JSON.stringify(initialContainingBlock)),
  );
  const canvas = paint(layoutRoot, { ...initialContainingBlock.content });

  assertEquals(canvas.width, 10);
  assertEquals(canvas.height, 10);
  assertEquals(canvas.pixels, [
    { r: 255, g: 255, b: 255, a: 255 },
    { r: 255, g: 255, b: 255, a: 255 },
    { r: 255, g: 255, b: 255, a: 255 },
    { r: 255, g: 255, b: 255, a: 255 },
    { r: 255, g: 255, b: 255, a: 255 },
    { r: 255, g: 255, b: 255, a: 255 },
    { r: 255, g: 255, b: 255, a: 255 },
    { r: 255, g: 255, b: 255, a: 255 },
    { r: 255, g: 255, b: 255, a: 255 },
    { r: 255, g: 255, b: 255, a: 255 },
    { r: 255, g: 255, b: 255, a: 255 },
    { r: 255, g: 0, b: 0, a: 255 },
    { r: 255, g: 0, b: 0, a: 255 },
    { r: 255, g: 0, b: 0, a: 255 },
    { r: 255, g: 0, b: 0, a: 255 },
    { r: 255, g: 0, b: 0, a: 255 },
    { r: 255, g: 0, b: 0, a: 255 },
    { r: 255, g: 0, b: 0, a: 255 },
    { r: 255, g: 0, b: 0, a: 255 },
    { r: 255, g: 255, b: 255, a: 255 },
    { r: 255, g: 255, b: 255, a: 255 },
    { r: 255, g: 0, b: 0, a: 255 },
    { r: 0, g: 0, b: 0, a: 255 },
    { r: 0, g: 0, b: 0, a: 255 },
    { r: 0, g: 0, b: 0, a: 255 },
    { r: 0, g: 0, b: 0, a: 255 },
    { r: 0, g: 0, b: 0, a: 255 },
    { r: 0, g: 0, b: 0, a: 255 },
    { r: 255, g: 0, b: 0, a: 255 },
    { r: 255, g: 255, b: 255, a: 255 },
    { r: 255, g: 255, b: 255, a: 255 },
    { r: 255, g: 0, b: 0, a: 255 },
    { r: 0, g: 0, b: 0, a: 255 },
    { r: 255, g: 165, b: 0, a: 255 },
    { r: 255, g: 165, b: 0, a: 255 },
    { r: 255, g: 165, b: 0, a: 255 },
    { r: 255, g: 165, b: 0, a: 255 },
    { r: 0, g: 0, b: 0, a: 255 },
    { r: 255, g: 0, b: 0, a: 255 },
    { r: 255, g: 255, b: 255, a: 255 },
    { r: 255, g: 255, b: 255, a: 255 },
    { r: 255, g: 0, b: 0, a: 255 },
    { r: 0, g: 0, b: 0, a: 255 },
    { r: 255, g: 165, b: 0, a: 255 },
    { r: 0, g: 128, b: 0, a: 255 },
    { r: 0, g: 128, b: 0, a: 255 },
    { r: 255, g: 165, b: 0, a: 255 },
    { r: 0, g: 0, b: 0, a: 255 },
    { r: 255, g: 0, b: 0, a: 255 },
    { r: 255, g: 255, b: 255, a: 255 },
    { r: 255, g: 255, b: 255, a: 255 },
    { r: 255, g: 0, b: 0, a: 255 },
    { r: 0, g: 0, b: 0, a: 255 },
    { r: 255, g: 165, b: 0, a: 255 },
    { r: 0, g: 128, b: 0, a: 255 },
    { r: 0, g: 128, b: 0, a: 255 },
    { r: 255, g: 165, b: 0, a: 255 },
    { r: 0, g: 0, b: 0, a: 255 },
    { r: 255, g: 0, b: 0, a: 255 },
    { r: 255, g: 255, b: 255, a: 255 },
    { r: 255, g: 255, b: 255, a: 255 },
    { r: 255, g: 0, b: 0, a: 255 },
    { r: 0, g: 0, b: 0, a: 255 },
    { r: 255, g: 165, b: 0, a: 255 },
    { r: 255, g: 165, b: 0, a: 255 },
    { r: 255, g: 165, b: 0, a: 255 },
    { r: 255, g: 165, b: 0, a: 255 },
    { r: 0, g: 0, b: 0, a: 255 },
    { r: 255, g: 0, b: 0, a: 255 },
    { r: 255, g: 255, b: 255, a: 255 },
    { r: 255, g: 255, b: 255, a: 255 },
    { r: 255, g: 0, b: 0, a: 255 },
    { r: 0, g: 0, b: 0, a: 255 },
    { r: 0, g: 0, b: 0, a: 255 },
    { r: 0, g: 0, b: 0, a: 255 },
    { r: 0, g: 0, b: 0, a: 255 },
    { r: 0, g: 0, b: 0, a: 255 },
    { r: 0, g: 0, b: 0, a: 255 },
    { r: 255, g: 0, b: 0, a: 255 },
    { r: 255, g: 255, b: 255, a: 255 },
    { r: 255, g: 255, b: 255, a: 255 },
    { r: 255, g: 0, b: 0, a: 255 },
    { r: 255, g: 0, b: 0, a: 255 },
    { r: 255, g: 0, b: 0, a: 255 },
    { r: 255, g: 0, b: 0, a: 255 },
    { r: 255, g: 0, b: 0, a: 255 },
    { r: 255, g: 0, b: 0, a: 255 },
    { r: 255, g: 0, b: 0, a: 255 },
    { r: 255, g: 0, b: 0, a: 255 },
    { r: 255, g: 255, b: 255, a: 255 },
    { r: 255, g: 255, b: 255, a: 255 },
    { r: 255, g: 255, b: 255, a: 255 },
    { r: 255, g: 255, b: 255, a: 255 },
    { r: 255, g: 255, b: 255, a: 255 },
    { r: 255, g: 255, b: 255, a: 255 },
    { r: 255, g: 255, b: 255, a: 255 },
    { r: 255, g: 255, b: 255, a: 255 },
    { r: 255, g: 255, b: 255, a: 255 },
    { r: 255, g: 255, b: 255, a: 255 },
    { r: 255, g: 255, b: 255, a: 255 }
  ]);
});
