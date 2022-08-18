import { IS_BROWSER } from "$fresh/runtime.ts";
import { Configuration, setup } from "twind";
export * from "twind";
export const config: Configuration = {
  darkMode: "class",
  mode: "silent",
  theme: {
    fontFamily: {
      sans:
        "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI'",
      canveat: ["Caveat", "cursive"],
      silkscreen: ["Silkscreen", 'cursive']
    },
    extend: {
      spacing: {
        128: "32rem",
        144: "36rem",
      },
    },
  },
};
if (IS_BROWSER) setup(config);
