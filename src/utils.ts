/* @auto-file-header
 * Copyright (c) 2020 Shumin Liu and Contributors.
 * This file is a part of Auto File Header
 * Automatically update your file headers with an extendible config file!
 * Licensed under MIT. See LICENSE file in the project root for full license information.
 */

import { basename, detectEOL } from "../deps.ts";

export type RecursivePartial<T> = {
  [P in keyof T]?: RecursivePartial<T[P]>;
};

/**
 * Get extension of a file. Expect the input is the path of a FILE.
 *
 * examples:
 * foo => foo
 * foo.bar => .bar
 * @param path path of the file
 */
export function getExt(path: string) {
  const name = basename(path);

  const emptyExt = [
    ".",
    "..",
    "",
  ];
  if (emptyExt.includes(name)) {
    return "";
  }

  const dotIndex = name.lastIndexOf(".");
  if (dotIndex == -1) {
    // file name like `Makefile`
    return name;
  } else {
    return name.substr(dotIndex);
  }
}

export function within<T, R>(obj: T, func: ((it: T) => R)): R {
  return func(obj);
}

export function splitByLines(str: string): string[] {
  const eol = detectEOL(str);

  if (eol === null) {
    return [str];
  } else {
    return str.split(eol);
  }
}
