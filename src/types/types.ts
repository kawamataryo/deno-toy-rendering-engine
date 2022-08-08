import {
  BOX_TYPE,
  DISPLAY_COMMAND_TYPE,
  DISPLAY_TYPE,
  SELECTOR_TYPE,
  TAG_DISPLAY_TYPE_MAP,
} from "../constants.ts";

export type ToyText = string;

export type ToyElement = {
  tagName: TAG_NAME;
  attributes: Record<string, string>;
};

export type ToyNodeType = ToyText | ToyElement;

export type ToyNode = {
  children: ToyNode[];
  nodeType: ToyNodeType;
};

export type Stylesheet = {
  rules: Rule[];
};

export type StylesheetPerSelectorType = {
  selectorType: string;
  stylesheet: Stylesheet;
};

export type Rule = {
  selectors: Selector[];
  declarations: Declaration[];
};

export type SelectorType = typeof SELECTOR_TYPE[keyof typeof SELECTOR_TYPE];

export type Selector = {
  type: "tag" | "id" | "class";
  name: string;
};

export type Declaration = {
  name: string;
  value: Value;
};

export type Value = Keyword | Color | Length;

export type Keyword = string;

export type Length = [number, Unit];

export type Unit = "px" | "em" | "rem" | "vh" | "vw" | "vmin" | "vmax";

export type Color = {
  r: number;
  g: number;
  b: number;
  a: number;
};

export type PropertyMap = Record<string, Value>;

export type Dimensions = {
  content: Rect;
  padding: EdgeSizes;
  border: EdgeSizes;
  margin: EdgeSizes;
};

export type Rect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type EdgeSizes = {
  left: number;
  right: number;
  top: number;
  bottom: number;
};

export interface StyledNodeInterface {
  node: ToyNodeType;
  specificValues: PropertyMap;
  children: StyledNodeInterface[];
}

export type Box = {
  type: BoxType;
  node: StyledNodeInterface;
};

export type BoxType = typeof BOX_TYPE[keyof typeof BOX_TYPE];

export type DisplayType = typeof DISPLAY_TYPE[keyof typeof DISPLAY_TYPE];

export type TAG_NAME = keyof typeof TAG_DISPLAY_TYPE_MAP;

export type DisplayCommand = {
  type: typeof DISPLAY_COMMAND_TYPE[keyof typeof DISPLAY_COMMAND_TYPE];
  color: Color;
  rect: Rect;
};

export type DisplayList = DisplayCommand[];
