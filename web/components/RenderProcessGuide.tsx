/** @jsx h */
/** @jsxFrag Fragment */

import { Fragment, h } from "preact";
import { tw } from "../utils/twind.ts";
import { CodeBlock } from "./CodeBlock.tsx";

export default function RenderProcessGuide({
  html,
  css,
  parsedHtmlStr,
  parsedCssStr,
  styleTreeStr,
  layoutRootStr,
  canvasDataStr,
}: {
  html: string;
  css: string;
  parsedHtmlStr: string;
  parsedCssStr: string;
  styleTreeStr: string;
  layoutRootStr: string;
  canvasDataStr: string;
}) {
  return (
    <>
      <div class={tw`p-4 my-4 mx-auto max-w-screen-md`}>
        <div class={tw`grid grid grid-cols-2 gap-4`}>
          <CodeBlock code={html} language="html" label="HTML" />
          <CodeBlock code={css} language="css" label="CSS" />
        </div>
        <div class={tw`grid grid grid-cols-4 gap-4`}>
          <div
            class={tw`text-[15px] col-start-2 col-end-4 border-x-4 border-gray-400 h-20 flex items-center justify-center text-2xl text-gray-400`}
          >
            Parse
          </div>
        </div>
        <div class={tw`grid grid grid-cols-2 gap-4`}>
          <CodeBlock code={parsedHtmlStr} language="javascript" label="DOM" />
          <CodeBlock
            code={parsedCssStr}
            language="javascript"
            label="Stylesheet"
          />
        </div>
        <div class={tw`grid grid grid-cols-4`}>
          <div
            class={tw`text-[15px] col-start-2 col-end-4 border-x-4 border-b-4 border-gray-400  h-20 flex items-center justify-center text-2xl text-gray-400`}
          >
            Style calculation
          </div>
          <div
            class={tw`col-start-1 col-end-3 border-r-4 border-gray-400 h-20 flex items-center justify-center text-2xl`}
          >
          </div>
        </div>
        <div class={tw`grid grid grid-cols-8 md:grid-cols-4 gap-4`}>
          <div class={tw`col-start-2 col-end-8 sm:col-start-2 sm:col-end-4`}>
            <CodeBlock
              code={styleTreeStr}
              language="javascript"
              label="Style node"
            />
          </div>
        </div>
        <div class={tw`grid grid grid-cols-4`}>
          <div
            class={tw`text-[15px] col-start-1 col-end-3 border-r-4 border-gray-400 h-20 flex items-center justify-right text-2xl pr-4 text-gray-400`}
          >
            Layout
          </div>
        </div>
        <div class={tw`grid grid grid-cols-8 md:grid-cols-4 gap-4`}>
          <div class={tw`col-start-2 col-end-8 sm:col-start-2 sm:col-end-4`}>
            <CodeBlock
              code={layoutRootStr}
              language="javascript"
              label="Layout box"
            />
          </div>
        </div>
        <div class={tw`grid grid grid-cols-4`}>
          <div
            class={tw`text-[15px] col-start-1 col-end-3 border-r-4 border-gray-400 h-20 flex items-center justify-right text-2xl pr-4 text-gray-400`}
          >
            Rasterization
          </div>
        </div>
        <div class={tw`grid grid grid-cols-8 md:grid-cols-4 gap-4`}>
          <div class={tw`col-start-2 col-end-8 sm:col-start-2 sm:col-end-4`}>
            <CodeBlock
              code={canvasDataStr}
              language="javascript"
              label="Painting data"
            />
          </div>
        </div>
      </div>
    </>
  );
}
