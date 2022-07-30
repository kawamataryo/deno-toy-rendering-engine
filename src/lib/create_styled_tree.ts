import "../types/types.d.ts";

export const matches = (nodeType: ToyNodeType, selector: Selector): boolean => {
  if (typeof nodeType === "string") {
    return false;
  }
  if (selector.type === "tag" && nodeType.tagName === selector.name) {
    return true;
  }
  if (
    selector.type === "id" && nodeType.attributes?.id === selector.name
  ) {
    return true;
  }
  if (
    selector.type === "class" &&
    nodeType.attributes?.class?.split(" ").some((c) => c === selector.name)
  ) {
    return true;
  }
  return false;
};

const createSpecificValues = (
  nodeType: ToyNodeType,
  stylesheet: Stylesheet,
): PropertyMap => {
  return stylesheet.rules.reduce<PropertyMap>((result, rule) => {
    if (rule.selectors.some((selector) => matches(nodeType, selector))) {
      rule.declarations.forEach((declaration) => {
        result[declaration.name] = declaration.value;
      });
    }
    return result;
  }, {});
};

export const createStyledTree = (
  node: ToyNode,
  stylesheet: Stylesheet,
): StyledNode => {
  return {
    node: node.nodeType,
    specificValues: createSpecificValues(node.nodeType, stylesheet),
    children: node.children.map((n) => createStyledTree(n, stylesheet)),
  };
};
