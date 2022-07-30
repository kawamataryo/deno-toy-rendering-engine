# Deno Toy Browser Engine

A simple HTML rendering engine made by Deno created based on "[Let's build a browser engine!](https://limpet.net/mbrubeck/2014/08/08/toy-layout-engine-1.html)"

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
- 2022/07/30: create Styled Tree([reference](https://limpet.net/mbrubeck/2014/08/23/toy-layout-engine-4-style.html))
