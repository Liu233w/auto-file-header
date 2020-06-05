import { ConfigRoot } from "./config.ts";
import { getExt } from "./utils.ts";

import { walk, relative, globToRegExp } from "../deps.ts";

export class Engine {
  private includeGlobRegex: RegExp[];
  private excludeGlobRegex: RegExp[];
  private basicFilterFunction: (path: string) => boolean;

  constructor(
    private readonly basePath: string,
    private readonly config: ConfigRoot,
  ) {
    this.includeGlobRegex = this.config.includeGlob.map((glob) =>
      globToRegExp(glob)
    );
    this.excludeGlobRegex = this.config.excludeGlob.map((glob) =>
      globToRegExp(glob)
    );

    this.basicFilterFunction = (_) => true;
    if (this.config.include.length > 0) {
      this.basicFilterFunction = (path) =>
        this.config.include.includes(getExt(path));
    } else if (this.config.exclude.length > 0) {
      this.basicFilterFunction = (path) =>
        !this.config.exclude.includes(getExt(path));
    }
  }

  public validateConfig(): string[] {
    const result = [];

    if (this.config.include.length > 0 && this.config.exclude.length > 0) {
      result.push(
        "Only one of the following attributes can be used: [include, exclude]",
      );
    }

    return result;
  }

  public isFileSelected(relativePath: string): boolean {
    const select = this.basicFilterFunction(relativePath) &&
      (this.includeGlobRegex.length === 0 ||
        this.includeGlobRegex.some((reg) => reg.test(relativePath))) &&
      (this.excludeGlobRegex.length === 0 ||
        this.excludeGlobRegex.every((reg) => !reg.test(relativePath)));

    return this.config.customFilter(relativePath, select);
  }

  public async *globFiles(): AsyncIterableIterator<string> {
    for await (const entry of walk(this.basePath)) {
      if (!entry.isFile) {
        continue;
      }

      // ./a/b/c => a/b/c
      const relativePath = relative(this.basePath, entry.path).substr(2);

      if (this.isFileSelected(relativePath)) {
        yield relativePath;
      }
    }
  }
}
