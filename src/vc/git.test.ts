/* @auto-file-header
 * Copyright (c) 2020 Shumin Liu and Contributors.
 * This file is a part of Auto File Header (test file)
 * Automatically update your file headers with an extendible config file!
 * Licensed under MIT. See LICENSE file in the project root for full license information.
 */

import { assertEquals } from "../../deps.ts";
import { Git } from "./git.ts";

const { test } = Deno;

test("resolveGlob", () => {
  // whitespace and comments
  assertEquals(Git.resolveGlob(".gitignore", ""), null);
  assertEquals(Git.resolveGlob(".gitignore", "   "), null);
  assertEquals(Git.resolveGlob(".gitignore", "#foo"), null);
  assertEquals(Git.resolveGlob(".gitignore", "    #foo"), null);
  assertEquals(Git.resolveGlob(".gitignore", "    #  "), null);

  // root directory
  assertEquals(Git.resolveGlob(".gitignore", "*.js"), "**/*.js");
  assertEquals(Git.resolveGlob(".gitignore", "foo"), "**/foo");
  assertEquals(Git.resolveGlob(".gitignore", "/foo"), "foo");

  // nested directory
  assertEquals(Git.resolveGlob("bar/.gitignore", "*.js"), "bar/**/*.js");
  assertEquals(Git.resolveGlob("bar/.gitignore", "foo"), "bar/**/foo");
  assertEquals(Git.resolveGlob("bar/.gitignore", "/foo"), "bar/foo");

  // reverse
  assertEquals(Git.resolveGlob(".gitignore", "!*.js"), "!**/*.js");
  assertEquals(Git.resolveGlob(".gitignore", "!foo"), "!**/foo");
  assertEquals(Git.resolveGlob(".gitignore", "!/foo"), "!foo");

  assertEquals(Git.resolveGlob("bar/.gitignore", "!*.js"), "!bar/**/*.js");
  assertEquals(Git.resolveGlob("bar/.gitignore", "!foo"), "!bar/**/foo");
  assertEquals(Git.resolveGlob("bar/.gitignore", "!/foo"), "!bar/foo");
});
