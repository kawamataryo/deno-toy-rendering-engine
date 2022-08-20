/** @jsx h */
/** @jsxFrag Fragment */

import { Fragment, h } from "preact";
import { tw } from "@twind";
import { useEffect, useState } from "preact/hooks";
import BrowserMockup from "../components/BrowserMockup.tsx";
import { btnStyleBlue, btnStyleWhite } from "../styles/style.ts";
import { useToyRenderingEngine } from "../hooks/useToyRenderingEngine.ts";

import Prism from "prismjs";
import "https://cdnjs.cloudflare.com/ajax/libs/prism/9000.0.1/components/prism-css.min.js";
import RenderProcessGuide from "../components/RenderProcessGuide.tsx";
import { CodeBlockWithTextarea } from "../components/CodeBlockWithTextarea.tsx";
Prism.manual = true;

export default function ToyBrowser() {
  const {
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
  } = useToyRenderingEngine();
  const [shouldShowDetail, setShouldShowDetail] = useState(false);

  useEffect(() => {
    Prism.highlightAll();
  }, []);

  return (
    <>
      <div class={tw`p-4 mx-auto max-w-screen-md`}>
        <div class={tw`grid grid grid-cols-2 gap-4`}>
          <CodeBlockWithTextarea
            code={html}
            setCode={setHtml}
            language="html"
            label="HTML"
          />
          <CodeBlockWithTextarea
            code={css}
            setCode={setCss}
            language="css"
            label="CSS"
          />
        </div>
        <div class={tw`mt-4 text-center grid grid-row-2 gap-4 justify-center`}>
          <button class={tw`${btnStyleBlue}`} onClick={() => fillCanvas()}>
            🎨 Render
          </button>
          <button
            class={tw`${btnStyleWhite}`}
            onClick={() => setShouldShowDetail(!shouldShowDetail)}
          >
            👀 Details
          </button>
        </div>
      </div>
      <div
        class={tw`overflow-hidden max-h-0 bg-black ${
          shouldShowDetail && "max-h-[3000px]"
        } transition-all duration-500 ease-in-out`}
      >
        <RenderProcessGuide
          html={html}
          css={css}
          parsedHtmlStr={parsedHtmlStr}
          parsedCssStr={parsedCssStr}
          styleTreeStr={styleTreeStr}
          layoutRootStr={layoutRootStr}
          canvasDataStr={canvasDataStr}
        />
      </div>
      <div class={tw`p-4 mx-auto max-w-screen-md`}>
        <BrowserMockup>
          <canvas
            id="canvas"
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
          >
          </canvas>
        </BrowserMockup>
      </div>
    </>
  );
}
