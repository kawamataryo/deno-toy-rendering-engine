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
  rules: Rule
}

type Rule = {
  selectors: Selector[]
  declarations: Declaration[]
}

type Selector = {
  tagName?: string,
  id?: string,
  class?: string
}

type Declaration = {
  name: string;
  value: Value;
}

type Value = Keyword | Color | Length | Percentage;

type Keyword = string;

type Length = [number, 'px' | 'em' | 'rem' | 'vh' | 'vw' | 'vmin' | 'vmax'];

type ColorValue = {
  r: number;
  g: number;
  b: number;
  a: number;
}
