/* @auto-file-header
 * Copyright (c) 2020 Shumin Liu and Contributors.
 * This file is a part of Auto File Header (test file)
 * Automatically update your file headers with an extendible config file!
 * Licensed under MIT. See LICENSE file in the project root for full license information.
 */

import { assertEquals } from "../deps.ts";

import buildConfig from "./config.ts";
import Functions from "./functions.ts";

const { test } = Deno;

test("default.template should generate template correctly", () => {
  const config = buildConfig();

  const result = config.default.template(
    config.default.variables,
    new Functions(),
    "",
  );

  assertEquals(
    result,
    "Copyright (c) 2020 {company}.\nLicensed under {license}. See LICENSE file in the project root for full license information.",
  );
});
