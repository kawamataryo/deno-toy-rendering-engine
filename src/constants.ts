export const SELECTOR_TYPE = {
  TAG: "tag",
  CLASS: "class",
  ID: "id",
  UNIVERSAL: "*",
} as const;

export const BOX_TYPE = {
  INLINE: "INLINE",
  BLOCK: "BLOCK",
  ANONYMOUS: "ANONYMOUS",
} as const;

export const DISPLAY_TYPE = {
  INLINE: "inline",
  BLOCK: "block",
  NONE: "none",
};

export const TAG_DISPLAY_TYPE_MAP = {
  "html": DISPLAY_TYPE.BLOCK,
  "div": DISPLAY_TYPE.BLOCK,
  "span": DISPLAY_TYPE.INLINE,
  "p": DISPLAY_TYPE.BLOCK,
  "h1": DISPLAY_TYPE.BLOCK,
  "h2": DISPLAY_TYPE.BLOCK,
  "h3": DISPLAY_TYPE.BLOCK,
  "h4": DISPLAY_TYPE.BLOCK,
  "h5": DISPLAY_TYPE.BLOCK,
  "h6": DISPLAY_TYPE.BLOCK,
  "ul": DISPLAY_TYPE.BLOCK,
  "ol": DISPLAY_TYPE.BLOCK,
  "li": DISPLAY_TYPE.INLINE,
  "table": DISPLAY_TYPE.BLOCK,
  "tr": DISPLAY_TYPE.BLOCK,
  "td": DISPLAY_TYPE.INLINE,
  "th": DISPLAY_TYPE.INLINE,
  "thead": DISPLAY_TYPE.BLOCK,
  "tbody": DISPLAY_TYPE.BLOCK,
  "tfoot": DISPLAY_TYPE.BLOCK,
  "img": DISPLAY_TYPE.INLINE,
  "video": DISPLAY_TYPE.INLINE,
  "audio": DISPLAY_TYPE.INLINE,
  "iframe": DISPLAY_TYPE.INLINE,
  "canvas": DISPLAY_TYPE.INLINE,
  "svg": DISPLAY_TYPE.INLINE,
  "object": DISPLAY_TYPE.INLINE,
  "embed": DISPLAY_TYPE.INLINE,
  "input": DISPLAY_TYPE.INLINE,
  "button": DISPLAY_TYPE.INLINE,
  "select": DISPLAY_TYPE.INLINE,
  "textarea": DISPLAY_TYPE.INLINE,
  "label": DISPLAY_TYPE.INLINE,
  "option": DISPLAY_TYPE.INLINE,
  "optgroup": DISPLAY_TYPE.INLINE,
  "legend": DISPLAY_TYPE.INLINE,
  "fieldset": DISPLAY_TYPE.BLOCK,
  "form": DISPLAY_TYPE.BLOCK,
  "article": DISPLAY_TYPE.BLOCK,
  "section": DISPLAY_TYPE.BLOCK,
  "header": DISPLAY_TYPE.BLOCK,
  "footer": DISPLAY_TYPE.BLOCK,
  "address": DISPLAY_TYPE.BLOCK,
  "main": DISPLAY_TYPE.BLOCK,
  "nav": DISPLAY_TYPE.BLOCK,
  "details": DISPLAY_TYPE.BLOCK,
};

export const DEFAULT_DIMENSIONS = {
  content: {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  },
  padding: {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  border: {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  margin: {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
};

export const DISPLAY_COMMAND_TYPE = {
  SOLID_COLOR: "solid_color",
};
