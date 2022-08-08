import { Color, DisplayCommand, DisplayList, Rect } from "../types/types.ts";
import { LayoutBox } from "./layout_box.ts";
import { BOX_TYPE, DISPLAY_COMMAND_TYPE } from "../constants.ts";

export const buildDisplayList = (layoutRoot: LayoutBox) => {
  const list: DisplayList = [];
  renderLayoutBox(list, layoutRoot);
  return list;
};

export const renderLayoutBox = (list: DisplayList, layoutBox: LayoutBox) => {
  renderBackground(list, layoutBox);
  renderBorders(list, layoutBox);
  // TODO render text

  layoutBox.children.forEach((child) => {
    renderLayoutBox(list, child);
  });
};

const renderBackground = (list: DisplayList, layoutBox: LayoutBox) => {
  // Only the specification of background-color is supported.
  const color = getColor(layoutBox, "background-color");

  // if background transparent, no need to render
  if (!color) return;

  list.push({
    type: DISPLAY_COMMAND_TYPE.SOLID_COLOR,
    color,
    rect: layoutBox.borderBox(),
  });
};

const getColor = (layoutBox: LayoutBox, name: string): Color | null => {
  if (!layoutBox.node) return null;
  switch (layoutBox.boxType) {
    case BOX_TYPE.INLINE:
    case BOX_TYPE.BLOCK: {
      const color = layoutBox.node.specificValues[name];
      if (
        color && typeof color !== "string" && "r" in color && "g" in color &&
        "b" in color && "a" in color
      ) {
        return color;
      } else {
        return null;
      }
    }
    case BOX_TYPE.ANONYMOUS: {
      return null;
    }
    default:
      throw new Error("layout box has to unknown box type");
  }
};

const renderBorders = (list: DisplayList, layoutBox: LayoutBox) => {
  const color = getColor(layoutBox, "border-color");

  // If border transparent, no need to render
  if (!color) return;

  const dimensions = layoutBox.dimensions;
  const borderBox = layoutBox.borderBox();

  // Left border
  list.push(
    {
      type: DISPLAY_COMMAND_TYPE.SOLID_COLOR,
      color,
      rect: {
        x: borderBox.x,
        y: borderBox.y,
        width: dimensions.border.left,
        height: borderBox.height,
      },
    },
  );

  // Right border
  list.push(
    {
      type: DISPLAY_COMMAND_TYPE.SOLID_COLOR,
      color,
      rect: {
        x: borderBox.x + borderBox.width - dimensions.border.right,
        y: borderBox.y,
        width: dimensions.border.right,
        height: borderBox.height,
      },
    },
  );

  // Top border
  list.push({
    type: DISPLAY_COMMAND_TYPE.SOLID_COLOR,
    color,
    rect: {
      x: borderBox.x,
      y: borderBox.y,
      width: borderBox.width,
      height: dimensions.border.top,
    },
  });

  // Bottom border
  list.push({
    type: DISPLAY_COMMAND_TYPE.SOLID_COLOR,
    color,
    rect: {
      x: borderBox.x,
      y: borderBox.y + borderBox.height - dimensions.border.bottom,
      width: borderBox.width,
      height: dimensions.border.bottom,
    },
  });
};

export class Canvas {
  pixels: Color[];
  width: number;
  height: number;

  constructor(width: number, height: number) {
    const white = { r: 255, g: 255, b: 255, a: 255 };
    this.pixels = [...Array(width * height)].map(() => ({ ...white }));
    this.width = width;
    this.height = height;
  }

  paintItem(item: DisplayCommand) {
    const clamp = (num: number, min: number, max: number) =>
      Math.min(Math.max(num, min), max);
    const range = (size: number, startAt = 0) =>
      [...Array(size).keys()].map((i) => i + startAt);

    switch (item.type) {
      case DISPLAY_COMMAND_TYPE.SOLID_COLOR: {
        const { rect, color } = item;
        const x0 = clamp(rect.x, 0, this.width);
        const y0 = clamp(rect.y, 0, this.height);
        const x1 = clamp(rect.x + rect.width, 0, this.width);
        const y1 = clamp(rect.x + rect.height, 0, this.height);

        for (const y of range(y0 + y1, y0)) {
          for (const x of range(x0 + x1, x0)) {
            this.pixels[x + y * this.width] = color;
          }
        }
        break;
      }
      default:
        throw new Error("unsupported display command type");
    }
  }
}

export const paint = (layoutRoot: LayoutBox, bounds: Rect) => {
  const displayList = buildDisplayList(layoutRoot);
  const canvas = new Canvas(bounds.width, bounds.height);
  displayList.forEach((item) => canvas.paintItem(item));

  return canvas;
};
