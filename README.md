# Deno Toy Rendering Engine

A simple HTML rendering engine made by Deno. Created based on
"[Let's build a browser engine!](https://limpet.net/mbrubeck/2014/08/08/toy-layout-engine-1.html)"

Demo site is here. It is created by [fresh](https://fresh.deno.dev/).

https://user-images.githubusercontent.com/11070996/185726623-a8be3e21-6275-4b76-b23c-b9ad5dd797df.mp4

## Development

[Install Deno](https://deno.land/manual/getting_started/installation)
beforehand.

Test

```bash
deno task test
```

Type check

```bash
deno task check
```

Format

```bash
deno fmt
```

Lint

```bash
deno lint
```

## Building Log

- 2022/07/27: create HTML parser.
  ([reference](https://limpet.net/mbrubeck/2014/08/11/toy-layout-engine-2.html))
- 2022/07/29: create CSS parser.
  ([reference](https://limpet.net/mbrubeck/2014/08/13/toy-layout-engine-3-css.html))
- 2022/07/29: migrate to Deno
- 2022/07/30: refactor to Deno way
- 2022/07/30: create Styled
  Tree([reference](https://limpet.net/mbrubeck/2014/08/23/toy-layout-engine-4-style.html))
- 2022/08/07: create Layout
  Box([reference](https://limpet.net/mbrubeck/2014/09/17/toy-layout-engine-6-block.html))
- 2022/08/12: completed 🚀🚀
- 2022/08/20: create Demo site with fresh
