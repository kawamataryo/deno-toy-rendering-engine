import { SelectorType } from "../constants.ts";
import "../types/types.d.ts";

export const sortStylesheetByDetail = (stylesheet: Stylesheet): Stylesheet => {
  // split stylesheet per selectorType
  const stylesheetHash = stylesheet.rules.reduce<
    { [selectorType: string]: Stylesheet }
  >((result, rule) => {
    rule.selectors.forEach((selector) => {
      if (!result[selector.type]) {
        result[selector.type] = {
          rules: [],
        };
      }
      result[selector.type].rules.push({
        selectors: [selector],
        declarations: rule.declarations,
      });
    });
    return result;
  }, {});

  return {
    // sort by selectors details
    rules: [
      ...stylesheetHash[SelectorType.TAG] ? stylesheetHash[SelectorType.TAG].rules : [],
      ...stylesheetHash[SelectorType.CLASS] ? stylesheetHash[SelectorType.CLASS].rules : [],
      ...stylesheetHash[SelectorType.ID] ? stylesheetHash[SelectorType.ID].rules : [],
    ],
  };
};

export class StyledNode implements StyledNodeInterface {
  node: ToyNodeType;
  specificValues: PropertyMap;
  children: StyledNode[];

  constructor(node: ToyNode, stylesheet: Stylesheet) {
    this.node = node.nodeType;
    this.specificValues = this.createSpecificValues(node.nodeType, stylesheet);
    this.children = node.children.map((n) => new StyledNode(n, stylesheet));
  }

  value(name: string) {
    return this.specificValues[name] ? this.specificValues[name] : null;
  }

  display(): DisplayType {
    return this.value('display') ? this.value('display') as DisplayType : "inline"
  }

  private matches(nodeType: ToyNodeType, selector: Selector): boolean {
    if (typeof nodeType === "string") {
      return false;
    }
    if (selector.type === SelectorType.TAG && nodeType.tagName === selector.name) {
      return true;
    }
    if (
      selector.type === SelectorType.ID && nodeType.attributes?.id === selector.name
    ) {
      return true;
    }
    if (
      selector.type === SelectorType.CLASS &&
      nodeType.attributes?.class?.split(" ").some((c) => c === selector.name)
    ) {
      return true;
    }
    return false;
  }

  private createSpecificValues(
    nodeType: ToyNodeType,
    stylesheet: Stylesheet,
  ): PropertyMap {
    return stylesheet.rules.reduce<PropertyMap>((result, rule) => {
      if (rule.selectors.some((selector) => this.matches(nodeType, selector))) {
        rule.declarations.forEach((declaration) => {
          result[declaration.name] = declaration.value;
        });
      }
      return result;
    }, {});
  }
}

export const buildStyledTree = (
  node: ToyNode,
  stylesheet: Stylesheet,
): StyledNode => {
  const sortedStylesheet = sortStylesheetByDetail(stylesheet);

  return new StyledNode(node, sortedStylesheet);
};
