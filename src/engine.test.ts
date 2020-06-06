import { assertEquals, assertThrows } from "../deps.ts";

import buildConfig from "./config.ts";
import { Engine } from "./engine.ts";

const { test } = Deno;

test("Engine.isFileSelected", () => {
  let engine;
  let config;

  config = buildConfig();
  config.include = [".js", ".ts"];
  engine = new Engine("", config);
  assertEquals(engine.isFileSelected("a/b.t"), false);
  assertEquals(engine.isFileSelected("a/b"), false);
  assertEquals(engine.isFileSelected("a/b"), false);
  assertEquals(engine.isFileSelected("a/js"), false);
  assertEquals(engine.isFileSelected("js"), false);
  assertEquals(engine.isFileSelected("a.js"), true);
  assertEquals(engine.isFileSelected("foo/a.js"), true);

  config = buildConfig();
  config.include = ["foo"];
  engine = new Engine("", config);
  assertEquals(engine.isFileSelected("foo/bar"), false);
  assertEquals(engine.isFileSelected("foo/bar.foo"), false);
  assertEquals(engine.isFileSelected("foo"), true);
  assertEquals(engine.isFileSelected("bar/foo"), true);

  config = buildConfig();
  config.exclude = ["foo"];
  engine = new Engine("", config);
  assertEquals(engine.isFileSelected("foo/bar"), true);
  assertEquals(engine.isFileSelected("foo/bar.foo"), true);
  assertEquals(engine.isFileSelected("foo"), false);
  assertEquals(engine.isFileSelected("bar/foo"), false);

  config = buildConfig();
  config.includeGlob = ["*.foo", "*/*.a", "**/*.b"];
  engine = new Engine("", config);
  assertEquals(engine.isFileSelected("foo/bar"), false);
  assertEquals(engine.isFileSelected("foo/bar.foo"), false);
  assertEquals(engine.isFileSelected("foo"), false);
  assertEquals(engine.isFileSelected("bar/foo"), false);
  assertEquals(engine.isFileSelected("a.foo"), true);

  assertEquals(engine.isFileSelected("bar.a"), false);
  assertEquals(engine.isFileSelected("baz/bar.a"), true);

  assertEquals(engine.isFileSelected("bar.b"), true);
  assertEquals(engine.isFileSelected("foo/bar.b"), true);
  assertEquals(engine.isFileSelected("baz/foo/bar.b"), true);
  assertEquals(engine.isFileSelected("b"), false);

  // TODO: test excludeGlob
  // TODO: test file type work with glob
  // TODO: test filter function

  // test win32 path
  config = buildConfig();
  config.include = [".js", ".ts"];
  engine = new Engine("", config);
  assertEquals(engine.isFileSelected("a\\b.t"), false);
  assertEquals(engine.isFileSelected("a\\b"), false);
  assertEquals(engine.isFileSelected("a\\b"), false);
  assertEquals(engine.isFileSelected("a\\js"), false);
  assertEquals(engine.isFileSelected("js"), false);
  assertEquals(engine.isFileSelected("a.js"), true);
  assertEquals(engine.isFileSelected("foo\\a.js"), true);
});

test("Engine.getConfig", () => {
  const config = buildConfig();
  const engine = new Engine("", config);

  assertEquals(engine.getConfig("format.commentBegin", ".py"), "# ");
  assertEquals(engine.getConfig("format.commentBegin", "py"), "/* ");
  assertEquals(engine.getConfig("format.commentBegin", ".not-exist"), "/* ");
});

test("Engine.extractFileHeader", () => {
  const config = buildConfig();
  const engine = new Engine("", config);

  assertEquals(
    extractFileHeader(
      engine,
      "foo\n/* @auto-file-header\n * header\n */\nbar",
      "js",
    ),
    "/* @auto-file-header\n * header\n */\n",
  );
  assertEquals(
    extractFileHeader(
      engine,
      "foo\n/* baz\n * header\n */\nbar",
      "js",
    ),
    null,
  );
  assertThrows(
    () =>
      extractFileHeader(
        engine,
        "foo\n/* @auto-file-header\n * header\n*/\nbar",
        //                                     ^
        "js",
      ),
    Error,
    "Cannot find header end for type js",
  );
});

function extractFileHeader(
  engine: Engine,
  content: string,
  type: string,
): string | null {
  const header = engine.findFileHeader(content, type);
  if (header === null) {
    return null;
  }

  const { begin, length } = header;
  return content.substr(begin, length);
}
