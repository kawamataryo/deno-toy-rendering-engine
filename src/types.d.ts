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
