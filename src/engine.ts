import { ConfigRoot, TemplateFunction } from "./config.ts";
import { getExt } from "./utils.ts";

import {
  walk,
  relative,
  globToRegExp,
  lodashGet,
  detectEOL,
  readFileStr,
  joinPath,
  writeFileStr,
} from "../deps.ts";
import Variables from "./variables.ts";
import Functions from "./functions.ts";

import { log } from "../deps.ts";

export class Engine {
  private includeGlobRegex: RegExp[];
  private excludeGlobRegex: RegExp[];
  private basicFilterFunction: (path: string) => boolean;
  private functions: Functions = new Functions();

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

    log.debug("Engine init:");
    log.debug("  basePath: ${basePath}");
    log.debug("  config:", config);
    log.debug("  includeGlobRegex:", this.includeGlobRegex);
    log.debug("  excludeGlobRegex:", this.excludeGlobRegex);
    log.debug("  basicFilterFunction:", this.basicFilterFunction);
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
      const selected = this.isFileSelected(relativePath);

      log.debug(
        `walk files. path: ${entry.path}, relativePath: ${relativePath}, selected: ${selected}`,
      );

      if (selected) {
        yield relativePath;
      }
    }
  }

  public getConfig(path: string, type: string): unknown {
    const langResult = lodashGet(this.config.languages[type], path, undefined);
    if (langResult) {
      return langResult;
    } else {
      return lodashGet(this.config.default, path, undefined);
    }
  }

  public findFileHeader(
    content: string,
    type: string,
  ): { begin: number; length: number } | null {
    const eol = detectEOL(content);

    const beginPattern = this.getConfig("format.commentBegin", type) as string +
      this.getConfig("headerIndicator", type) as string + eol;
    const beginIndex = content.indexOf(beginPattern);

    if (beginIndex === -1) {
      return null;
    }

    const endPattern = this.getConfig("format.commentEnd", type) as string +
      eol;
    const endIndex = content.indexOf(
      endPattern,
      beginIndex + beginPattern.length,
    );

    if (endIndex === -1) {
      throw new Error(
        `Cannot find header end for type ${type}. Header begin index: ${beginIndex}, beginPattern: "${beginPattern}", endPattern: ${endPattern}`,
      );
    }

    return {
      begin: beginIndex,
      length: endIndex - beginIndex + endPattern.length,
    };
  }

  public generateFileHeader(path: string, type: string): string {
    const template = this.getConfig("template", type) as TemplateFunction;
    return template(
      {
        variables: this.getConfig("variables", type) as Variables,
        functions: this.functions,
        filePath: path,
      },
    );
  }

  public async work(): Promise<void> {
    // TODO: optimise
    for await (const path of this.globFiles()) {
      const absolutePath = joinPath(this.basePath, path);
      // TODO: handle encoding
      const content = await readFileStr(absolutePath);
      const type = getExt(path);

      const headerPosition = this.findFileHeader(content, type);
      if (headerPosition === null) {
        continue;
      }

      const { begin, length } = headerPosition;

      const oldFileHeader = content.substr(begin, length);
      const newFileHeader = this.generateFileHeader(path, type);

      if (oldFileHeader === newFileHeader) {
        continue;
      }

      const newContent = content.substring(0, begin) +
        newFileHeader + content.substring(begin + length);

      writeFileStr(absolutePath, newContent);
    }
  }
}
