/* @auto-file-header
 * Copyright (c) 2020 Shumin Liu and Contributors.
 * This file is a part of Auto File Header (test file)
 * Automatically update your file headers with an extendible config file!
 * Licensed under MIT. See LICENSE file in the project root for full license information.
 */

import { assertEquals } from "../../deps.ts";
import { Git } from "./git.ts";

const { test } = Deno;

test({
  name: "isIgnored",
  async fn() {
    const git = new Git();
    git.setWorkingDir(Deno.cwd());

    assertEquals(await git.isIgnored("benchmark/benchmark.txt"), false);
    assertEquals(await git.isIgnored(".gitignore"), false);

    assertEquals(await git.isIgnored("benchmark/git/.gitignore"), true);
  },
});
