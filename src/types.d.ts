type ToyText = string;

type ToyElement = {
  tagName: string;
  attributes: Record<string, string>;
};

type ToyNodeType = ToyText | ToyElement;

type ToyNode = {
  children: ToyNode[];
  node: ToyNodeType;
};

type Stylesheet = {
  rules: Rule[];
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
