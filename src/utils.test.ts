import { assertEquals } from "../deps.ts";

import { getExt } from "./utils.ts";

const { test } = Deno;

const list = [
  ["/a/b/c.txt", ".txt"],
  ["c:\\a\\b\\c.txt", ".txt"],
  ["a.txt", ".txt"],
  ["a", "a"],
  ["a/b/c", "c"],
  ["a.", "."],
  [".", ""],
  ["..", ""],
  ["/", ""],
  ["/..", ""],
  ["a/..", ""],
];

list.forEach(([input, output]) => {
  test(`getExt: input with "${input}"`, () => {
    assertEquals(getExt(input), output);
  });
});