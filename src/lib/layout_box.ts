import { BOX_TYPE, DEFAULT_DIMENSIONS, DISPLAY_TYPE } from "../constants.ts";
import { StyledNode } from "./styled_node.ts";
import {
  BoxType,
  Dimensions,
  EdgeSizes,
  Length,
  Rect,
  Value,
} from "../types/types.ts";

export const calculateAutoSpaceToWidth = (
  args: {
    width: Value;
    marginLeft: Value;
    marginRight: Value;
    totalWidth: number;
    containingBlockWidth: number;
  },
): { width: Value; marginLeft: Value; marginRight: Value } => {
  if (args.width != "auto" && args.totalWidth > args.containingBlockWidth) {
    if (args.marginLeft === "auto") {
      args.marginLeft = [0.0, "px"];
    }
    if (args.marginRight === "auto") {
      args.marginRight = [0.0, "px"];
    }
  }

  const underflow = args.containingBlockWidth - args.totalWidth;

  const isAutoWidth = args.width === "auto";
  const isAutoMarginLeft = args.marginLeft === "auto";
  const isAutoMarginRight = args.marginRight === "auto";

  if (!isAutoWidth && !isAutoMarginLeft && !isAutoMarginRight) {
    args.marginRight = [toPx(args.marginRight) + underflow, "px"];
  } else if (!isAutoWidth && !isAutoMarginLeft && isAutoMarginRight) {
    args.marginRight = [underflow, "px"];
  } else if (!isAutoWidth && isAutoMarginLeft && !isAutoMarginRight) {
    args.marginLeft = [underflow, "px"];
  } else if (isAutoWidth) {
    if (isAutoMarginLeft) {
      args.marginLeft = [0.0, "px"];
    }
    if (isAutoMarginRight) {
      args.marginRight = [0.0, "px"];
    }
    if (underflow >= 0.0) {
      args.width = [underflow, "px"];
    } else {
      args.width = [0.0, "px"];
      args.marginRight = [toPx(args.marginRight) + underflow, "px"];
    }
  } else if (!isAutoWidth && isAutoMarginLeft && isAutoMarginRight) {
    args.marginLeft = [underflow / 2, "px"];
    args.marginRight = [underflow / 2, "px"];
  }
  return {
    width: args.width,
    marginLeft: args.marginLeft,
    marginRight: args.marginRight,
  };
};

export const toPx = (length: Value): number => {
  return Array.isArray(length) && length[1] === "px" ? length[0] : 0;
};

export class LayoutBox {
  boxType: BoxType;
  node: StyledNode | null;
  dimensions: Dimensions;
  children: LayoutBox[] = [];

  constructor(boxType: BoxType, styledNode: StyledNode | null) {
    this.boxType = boxType;
    this.node = styledNode;
    this.dimensions = JSON.parse(JSON.stringify(DEFAULT_DIMENSIONS));
  }

  getInlineContainer(): LayoutBox {
    switch (this.boxType) {
      case BOX_TYPE.INLINE:
        return this;
      case BOX_TYPE.ANONYMOUS:
        return this;
      case BOX_TYPE.BLOCK: {
        if (
          this.children.length > 0 &&
          this.children[this.children.length - 1].boxType === BOX_TYPE.ANONYMOUS
        ) {
          return this.children[this.children.length - 1];
        }
        const anonymousChild = new LayoutBox(BOX_TYPE.ANONYMOUS, null);
        this.children.push(anonymousChild);
        return anonymousChild;
      }
      default:
        throw new Error("layout box has to unknown box type");
    }
  }

  layout(containingBlock: Dimensions) {
    switch (this.boxType) {
      case BOX_TYPE.BLOCK: {
        this.layoutBlock(containingBlock);
        break;
      }
      case BOX_TYPE.INLINE: {
        // TODO:
        break;
      }
      case BOX_TYPE.ANONYMOUS: {
        // TODO:
        break;
      }
      default:
        throw new Error("layout box has to unknown box type");
    }
  }

  layoutBlock(containingBlock: Dimensions) {
    this.calculateBlockWidth(containingBlock);
    this.calculateBlockPosition(containingBlock);
    this.layoutBlockChildren();
    this.calculateBlockHeight();
  }

  calculateBlockWidth(containingBlock: Dimensions) {
    if (!this.node) return;
    let width = this.node.value("width") ?? "auto";

    const zero: Length = [0.0, "px"];

    let marginLeft = this.node.lookup("margin-left", "margin", zero);
    let marginRight = this.node.lookup("margin-right", "margin", zero);
    const borderLeft = this.node.lookup(
      "border-left-width",
      "border-width",
      zero,
    );
    const borderRight = this.node.lookup(
      "border-right-width",
      "border-width",
      zero,
    );
    const paddingLeft = this.node.lookup("padding-left", "padding", zero);
    const paddingRight = this.node.lookup("padding-right", "padding", zero);

    const totalWidth = [
      width,
      marginLeft,
      marginRight,
      borderLeft,
      borderRight,
      paddingLeft,
      paddingRight,
    ].reduce((total, value) => {
      return total + toPx(value);
    }, 0);

    const autoSpace = calculateAutoSpaceToWidth(
      {
        width,
        marginLeft,
        marginRight,
        totalWidth,
        containingBlockWidth: containingBlock.content.width,
      },
    );
    marginLeft = autoSpace.marginLeft;
    marginRight = autoSpace.marginRight;
    width = autoSpace.width;

    this.dimensions.content.width = toPx(width);
    this.dimensions.margin.left = toPx(marginLeft);
    this.dimensions.margin.right = toPx(marginRight);
    this.dimensions.border.left = toPx(borderLeft);
    this.dimensions.border.right = toPx(borderRight);
    this.dimensions.padding.left = toPx(paddingLeft);
    this.dimensions.padding.right = toPx(paddingRight);
  }

  calculateBlockPosition(containingBlock: Dimensions) {
    if (!this.node) return;

    const zero: Length = [0.0, "px"];

    this.dimensions.margin.top = toPx(
      this.node.lookup("margin-top", "margin", zero),
    );
    this.dimensions.margin.bottom = toPx(
      this.node.lookup("margin-bottom", "margin", zero),
    );
    this.dimensions.border.top = toPx(
      this.node.lookup("border-top-width", "border-width", zero),
    );
    this.dimensions.border.bottom = toPx(
      this.node.lookup("border-bottom-width", "border-width", zero),
    );
    this.dimensions.padding.top = toPx(
      this.node.lookup("padding-top", "padding", zero),
    );
    this.dimensions.padding.bottom = toPx(
      this.node.lookup("padding-bottom", "padding", zero),
    );

    this.dimensions.content.x = containingBlock.content.x +
      this.dimensions.margin.left + this.dimensions.border.left +
      this.dimensions.padding.left;
    this.dimensions.content.y = containingBlock.content.height +
      containingBlock.content.y +
      this.dimensions.margin.top + this.dimensions.border.top +
      this.dimensions.padding.top;
  }

  layoutBlockChildren() {
    this.children.forEach((child) => {
      child.layout(JSON.parse(JSON.stringify(this.dimensions)));
      this.dimensions.content.height += child.marginBox().height;
    });
  }

  paddingBox(): Rect {
    return this.expandedBy(this.dimensions.content, this.dimensions.padding);
  }

  borderBox(): Rect {
    return this.expandedBy(this.paddingBox(), this.dimensions.border);
  }

  marginBox(): Rect {
    return this.expandedBy(this.borderBox(), this.dimensions.margin);
  }

  expandedBy(rect: Rect, edge: EdgeSizes): Rect {
    return {
      x: rect.x - edge.left,
      y: rect.y - edge.top,
      width: rect.width + edge.left + edge.right,
      height: rect.height + edge.top + edge.bottom,
    };
  }

  calculateBlockHeight() {
    if (!this.node) return;
    if (this.node.value("height") !== null) {
      this.dimensions.content.height = toPx(
        this.node.value("height") as Length,
      );
    }
  }
}

export const layoutTree = (
  styledNode: StyledNode,
  containingBlock: Dimensions,
): LayoutBox => {
  containingBlock.content.height = 0;
  const rootBox = buildLayoutTree(styledNode);
  rootBox.layout(containingBlock);
  return rootBox;
};

export const buildLayoutTree = (node: StyledNode): LayoutBox => {
  let rootBox: LayoutBox;
  switch (node.display()) {
    case DISPLAY_TYPE.BLOCK:
      rootBox = new LayoutBox(BOX_TYPE.BLOCK, node);
      break;
    case DISPLAY_TYPE.INLINE:
      rootBox = new LayoutBox(BOX_TYPE.INLINE, node);
      break;
    default:
      throw new Error("Root node has to be either inline or block");
  }

  node.children.forEach((n) => {
    switch (n.display()) {
      case DISPLAY_TYPE.BLOCK:
        rootBox.children.push(buildLayoutTree(n));
        break;
      case DISPLAY_TYPE.INLINE:
        rootBox.getInlineContainer().children.push(buildLayoutTree(n));
        break;
      case DISPLAY_TYPE.NONE:
        break;
      default:
        throw new Error("node has to unknown display type");
    }
  });

  return rootBox;
};
