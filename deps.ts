export {
  assertEquals,
  assertThrows,
} from "https://deno.land/std@v0.66.0/testing/asserts.ts";

export {
  walk,
  detect as detectEOL,
  EOL,
} from "https://deno.land/std@v0.66.0/fs/mod.ts";

export {
  relative,
  globToRegExp,
  normalizeGlob,
  basename,
  join as joinPath,
} from "https://deno.land/std@v0.66.0/path/mod.ts";

export { parse as parseArgs } from "https://deno.land/std@v0.66.0/flags/mod.ts";

export * as log from "https://deno.land/std@v0.66.0/log/mod.ts";

export * from "./deps2.ts";
