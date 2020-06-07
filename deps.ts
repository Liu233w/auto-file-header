export {
  assertEquals,
  assertThrows,
} from "https://deno.land/std@0.55.0/testing/asserts.ts";

export {
  walk,
  detect as detectEOL,
  readFileStr,
  writeFileStr,
  EOL,
} from "https://deno.land/std@0.55.0/fs/mod.ts";

export {
  relative,
  globToRegExp,
  normalizeGlob,
  basename,
  join as joinPath,
} from "https://deno.land/std@0.55.0/path/mod.ts";

export { parse as parseArgs } from "https://deno.land/std@0.55.0/flags/mod.ts";

export * as log from "https://deno.land/std@0.55.0/log/mod.ts";

export { default as lodashGet } from "https://deno.land/x/lodash@4.17.15-es/get.js";
