/** @jsx h */
/** @jsxFrag Fragment */

import { Fragment, h } from "preact";
import { tw } from "@twind";
import { Head } from "$fresh/runtime.ts";
import ToyRenderingEngine from "../islands/ToyRenderingEngine.tsx";
import GitHubLink from "../components/GitHubLink.tsx";

export default function Home() {
  return (
    <>
      <Head>
        <title>Deno Toy Rendering Engine</title>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/prism/9000.0.1/themes/prism-tomorrow.min.css"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="/style.css"
          rel="stylesheet"
        />
        <meta property="og:title" content="deno toy rendering engine" />
        <meta property="og:site_name" content="deno toy rendering engine" />
        <meta
          property="og:url"
          content="https://deno-toy-rendering-engine.deno.dev/"
        />
        <meta property="og:description" content="" />
        <meta property="og:type" content="website" />
        <meta
          property="og:image"
          content="https://deno-toy-rendering-engine.deno.dev/og.png"
        />
      </Head>
      <div
        class={tw`pb-20 pt-10 relative bg-cover`}
      >
        <h1
          class={tw`text-3xl font-black text-center mb-10 text-white font-press-start-2p`}
        >
          Deno Toy Rendering Engine
        </h1>
        <div class={tw`font-press-start-2p`}>
          <ToyRenderingEngine />
        </div>
        <a
          href="https://github.com/kawamataryo/deno-toy-rendering-engine"
          target="_blank"
          class={tw`right-0 top-0 fixed`}
        >
          <GitHubLink />
        </a>
      </div>
    </>
  );
}
