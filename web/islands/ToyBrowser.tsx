/** @jsx h */
/** @jsxFrag Fragment */

import { Fragment, h } from "preact";
import { tw } from "@twind";
import { useEffect, useState } from "preact/hooks";
import BrowserMockup from "../components/BrowserMockup.tsx";
import {
  btnStyleBlack,
  btnStyleWhite,
  textareaStyle,
} from "../styles/style.ts";
import { useToyRenderingEngine } from "../hooks/useToyRenderingEngine.ts";

import Prism from "prismjs";
import "https://cdnjs.cloudflare.com/ajax/libs/prism/9000.0.1/components/prism-css.min.js";
import { CodeBlock } from "../components/CodeBlock.tsx";
import RenderProcessGuide from "../components/RenderProcessGuide.tsx";
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
  } = useToyRenderingEngine();
  const [shouldShowDetail, setShouldShowDetail] = useState(false);

  useEffect(() => {
    fillCanvas();
    Prism.highlightAll();
  }, []);

  return (
    <>
      <div class={tw`p-4 mx-auto max-w-screen-md`}>
        <div class={tw`grid grid grid-cols-2 gap-4`}>
          <label class={tw`text-center`}>
            HTML
            <textarea
              class={tw`${textareaStyle}`}
              value={html}
              onChange={(e: any) => setHtml(e.target.value)}
            />
          </label>
          <label class={tw`text-center`}>
            CSS
            <textarea
              class={tw`${textareaStyle}`}
              value={css}
              onChange={(e: any) => setCss(e.target.value)}
            />
          </label>
        </div>
        <div class={tw`mt-4 text-center flex gap-4 justify-center`}>
          <button class={tw`${btnStyleBlack}`} onClick={() => fillCanvas()}>
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
        <div class={tw`mt-8`}>
          <BrowserMockup>
            <canvas id="canvas" ref={canvasRef} width="700" height="400">
            </canvas>
          </BrowserMockup>
        </div>
      </div>
    </>
  );
}
