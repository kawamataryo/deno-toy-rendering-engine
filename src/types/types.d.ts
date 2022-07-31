type ToyText = string;

type ToyElement = {
  tagName: string;
  attributes: Record<string, string>;
};

type ToyNodeType = ToyText | ToyElement;

type ToyNode = {
  children: ToyNode[];
  nodeType: ToyNodeType;
};

type Stylesheet = {
  rules: Rule[];
};

type StylesheetPerSelectorType = {
  selectorType: string;
  stylesheet: Stylesheet;
};

type Rule = {
  selectors: Selector[];
  declarations: Declaration[];
};

type Selector = {
  type: "tag" | "id" | "class";
  name: string;
};

type Declaration = {
  name: string;
  value: Value;
};

type Value = Keyword | Color | Length;

type Keyword = string;

type Length = [number, Unit];

type Unit = "px" | "em" | "rem" | "vh" | "vw" | "vmin" | "vmax";

type Color = {
  r: number;
  g: number;
  b: number;
  a: number;
};

type PropertyMap = Record<string, Value>;

type Dimensions = {
  content: Rect;
  padding: EdgeSizes;
  border: EdgeSizes;
  margin: EdgeSizes;
};

type Rect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type EdgeSizes = {
  left: number;
  right: number;
  top: number;
  bottom: number;
};

type LayoutBox = {
  dimensions: Dimensions;
  box: Box;
  children: LayoutBox;
};

interface StyledNodeInterface {
  node: ToyNodeType;
  specificValues: PropertyMap;
  children: StyledNodeInterface[];
}

type Box = {
  type: DisplayType;
  node: StyledNodeInterface;
};

type DisplayType = "inline" | "block" | "none";
