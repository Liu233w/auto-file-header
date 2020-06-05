import { basename } from "../deps.ts";

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
    '.',
    '..',
    ''
  ]
  if (emptyExt.includes(name)) {
    return ''
  }

  const dotIndex = name.lastIndexOf(".");
  if (dotIndex == -1) {
    // file name like `Makefile`
    return name;
  } else {
    return name.substr(dotIndex);
  }
}
