import { parse as parseCss } from "./lib/css_parser.ts";
import { parse as parseHtml } from "./lib/html_parser.ts";
import { buildStyledTree } from "./lib/styled_node.ts";
import { layoutTree } from "./lib/layout_box.ts";
import { createCanvas } from "x/canvas/mod";
import { paint } from "./lib/painting.ts";
import { DEFAULT_DIMENSIONS } from "./constants.ts";

const html = await Deno.readTextFile("./src/source/index.html");
const css = await Deno.readTextFile("./src/source/style.css");

const initialContainingBlock = {
  ...DEFAULT_DIMENSIONS,
  content: { x: 0, y: 0, width: 100, height: 100 },
};

const rootNode = parseHtml(html);
const stylesheet = parseCss(css);
const styledNode = buildStyledTree(rootNode, stylesheet);
const layoutRoot = layoutTree(
  styledNode,
  JSON.parse(JSON.stringify(initialContainingBlock)),
);
const canvas = paint(layoutRoot, { ...initialContainingBlock.content });

const base = createCanvas(canvas.width, canvas.height);
const ctx = base.getContext("2d");

[...Array(canvas.height).keys()].forEach((y) => {
  [...Array(canvas.width).keys()].forEach((x) => {
    const color = canvas.pixels[x + y * canvas.width];

    ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;
    ctx.fillRect(x, y, 1, 1);
  });
});

await Deno.writeFile("image.png", base.toBuffer());
