import { BOX_TYPE, DISPLAY_TYPE } from "../constants.ts";
import { StyledNode } from "./styled_node.ts";
import { BoxType } from "../types/types.ts";

class LayoutBox {
  boxType: BoxType;
  node: StyledNode | null;
  dimensions = 0.0;
  children: LayoutBox[] = [];

  constructor(boxType: BoxType, styledNode: StyledNode | null) {
    this.boxType = boxType;
    this.node = styledNode;
  }

  getInlineContainer(): LayoutBox {
    if(this.boxType === BOX_TYPE.INLINE || this.boxType === BOX_TYPE.ANONYMOUS) {
      return this;
    }
    if(this.boxType === BOX_TYPE.BLOCK) {
      if(this.children.length > 0 && this.children[this.children.length - 1].boxType === BOX_TYPE.ANONYMOUS) {
        const anonymousChild = new LayoutBox(BOX_TYPE.ANONYMOUS, null);
        this.children.push(new LayoutBox(BOX_TYPE.ANONYMOUS, null));
        return anonymousChild;
      }
      return this.children[this.children.length - 1]
    }
  }
}

const buildLayoutTree = (node: StyledNode): LayoutBox => {
  let rootBox: LayoutBox
  switch (node.display()) {
    case DISPLAY_TYPE.INLINE:
      rootBox = new LayoutBox(BOX_TYPE.BLOCK, node);
      break;
    case DISPLAY_TYPE.BLOCK:
      rootBox = new LayoutBox(BOX_TYPE.INLINE, node);
      break;
    default:
      throw new Error("Root node has to be either inline or block");
  }

  node.children.forEach(n => {
    switch (n.display()) {
      case DISPLAY_TYPE.INLINE:
        rootBox.children.push(buildLayoutTree(n));
        break;
      case DISPLAY_TYPE.BLOCK:
        rootBox.children.push(buildLayoutTree(n));
        break;
      case DISPLAY_TYPE.NONE:
        break;
      default:
        throw new Error("node has to unknown display type");
    }
  })

  return rootBox
}