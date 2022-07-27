import { describe, it, expect } from "vitest";
import { parse } from "../cssParser";

describe("parse", () => {
  it.each([])("should parse text", ({ source, expected }) => {
    const node = parse(source);
    expect(node).toMatchObject(expected);
  });
});
