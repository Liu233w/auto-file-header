import { assertEquals } from "../deps.ts";

import buildConfig from "./config.ts";
import Functions from "./functions.ts";

const { test } = Deno;

test("default.template should generate template correctly", () => {
  const config = buildConfig();

  const result = config.default.template({
    variables: config.default.variables,
    functions: new Functions(),
  });

  assertEquals(
    result,
    "\nCopyright (c) 2020 Author.\nLicensed under the MIT. See LICENSE file in the project root for full license information.\n",
  );
});
