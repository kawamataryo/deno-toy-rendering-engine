/** @jsx h */
/** @jsxFrag Fragment */

import { Fragment, h } from "preact";
import { tw } from "@twind";
import { Head } from "$fresh/runtime.ts";
import ToyBrowser from "../islands/ToyBrowser.tsx";

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
          href="https://fonts.googleapis.com/css2?family=Caveat&family=Silkscreen&display=swap"
          rel="stylesheet"
        />
      </Head>
      <h1 class={tw`text-3xl font-black text-center mt-6 mb-10 font-silkscreen`}>
        Deno Toy Rendering Engine
      </h1>
      <div class={tw`font-silkscreen`}>
        <ToyBrowser />
      </div>
    </>
  );
}
