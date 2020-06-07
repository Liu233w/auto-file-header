/* @auto-file-header
 * Copyright (c) 2020 Shumin Liu and Contributors.
 * This file is a part of Auto File Header (test file)
 * Automatically update your file headers with an extendible config file!
 * Licensed under MIT. See LICENSE file in the project root for full license information.
 */

import { assertEquals } from "../deps.ts";

import { getExt, splitByLines } from "./utils.ts";

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

test("splitByLines", () => {
  assertEquals(splitByLines(""), [""]);
  assertEquals(splitByLines("foo"), ["foo"]);
  assertEquals(splitByLines("\n"), ["", ""]);
  assertEquals(splitByLines("foo\nbar"), ["foo", "bar"]);
  assertEquals(splitByLines("foo\r\nbar"), ["foo", "bar"]);
});
