export {
  assertEquals,
  assertThrows,
} from "https://deno.land/std/testing/asserts.ts";

export {
  walk,
  detect as detectEOL,
  readFileStr,
  writeFileStr,
} from "https://deno.land/std/fs/mod.ts";

export {
  relative,
  globToRegExp,
  joinGlobs,
  basename,
  join as joinPath,
} from "https://deno.land/std/path/mod.ts";

export { parse as parseArgs } from "https://deno.land/std/flags/mod.ts";

export * as log from "https://deno.land/std/log/mod.ts"

export { default as lodashGet } from "https://deno.land/x/lodash/get.js";
