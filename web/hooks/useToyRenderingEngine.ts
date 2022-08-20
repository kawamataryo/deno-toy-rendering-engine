import { useRef, useState } from "preact/hooks";
import { DEFAULT_DIMENSIONS } from "../../src/constants.ts";
import { parse as parseCss } from "../../src/lib/css_parser.ts";
import { parse as parseHtml } from "../../src/lib/html_parser.ts";
import { buildStyledTree } from "../../src/lib/styled_node.ts";
import { layoutTree } from "../../src/lib/layout_box.ts";
import { paint } from "../../src/lib/painting.ts";

const DEFAULT_HTML = `
<div class="wrapper">
  <div class="inner-1">
  </div>
  <div class="inner-2"></div>
</div>
`.trim();

const DEFAULT_CSS = `
.wrapper, inner-1 {
  background-color: #13334c;
  border-color: #fd5f00;
}
.inner-2 {
  background-color: #005792;
  border-color: #f6f6e9;
}
* {
  border-width: 10px;
  padding: 30px;
}
`.trim();

export const useToyRenderingEngine = () => {
  const CANVAS_WIDTH = 730;
  const CANVAS_HEIGHT = 400;

  const serializer = (obj: unknown) => {
    return JSON.stringify(obj, null, 2);
  };

  const clearCanvas = (ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  };

  const [html, setHtml] = useState(DEFAULT_HTML);
  const [css, setCss] = useState(DEFAULT_CSS);
  const [parsedHtmlStr, setParsedHtmlStr] = useState("");
  const [parsedCssStr, setParsedCssStr] = useState("");
  const [styleTreeStr, setStyleTreeStr] = useState("");
  const [layoutRootStr, setLayoutRootStr] = useState("");
  const [canvasDataStr, setCanvasDataStr] = useState("");

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const fillCanvas = () => {
    const initialContainingBlock = {
      ...DEFAULT_DIMENSIONS,
      content: { x: 0, y: 0, width: CANVAS_WIDTH, height: CANVAS_HEIGHT },
    };

    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;

    try {
      const rootNode = parseHtml(html);
      setParsedHtmlStr(serializer(rootNode));
      const stylesheet = parseCss(css);
      setParsedCssStr(serializer(stylesheet));
      const styledNode = buildStyledTree(rootNode, stylesheet);
      setStyleTreeStr(serializer(styledNode));
      const layoutRoot = layoutTree(
        styledNode,
        JSON.parse(JSON.stringify(initialContainingBlock)),
      );
      setLayoutRootStr(serializer(layoutRoot));
      const canvasData = paint(layoutRoot, {
        ...initialContainingBlock.content,
      });
      setCanvasDataStr(
        serializer({
          pixels: canvasData.pixels.slice(0, 20),
          width: canvasData.width,
          height: canvasData.height,
        }),
      );

      [...Array(canvasData.height).keys()].forEach((y) => {
        [...Array(canvasData.width).keys()].forEach((x) => {
          const color = canvasData.pixels[x + y * canvasData.width];

          ctx.fillStyle =
            `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;
          ctx.fillRect(x, y, 1, 1);
        });
      });
    } catch (e) {
      console.error(e);
      clearCanvas(ctx);
      ctx.font = "20pt Arial";
      ctx.fillStyle = "#d9534f";
      ctx.fillText("Parse Error.", 20, 50);
      ctx.font = "12pt Arial";
      ctx.fillText("See console log.", 20, 80);
    }
  };

  return {
    html,
    setHtml,
    css,
    setCss,
    canvasRef,
    fillCanvas,
    parsedHtmlStr,
    parsedCssStr,
    styleTreeStr,
    layoutRootStr,
    canvasDataStr,
    CANVAS_HEIGHT,
    CANVAS_WIDTH,
  };
};
