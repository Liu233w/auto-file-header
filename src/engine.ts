/* @auto-file-header
 * Copyright (c) 2020 Shumin Liu and Contributors.
 * This file is a part of Auto File Header
 * Automatically update your file headers with an extendible config file!
 * Licensed under MIT. See LICENSE file in the project root for full license information.
 */

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
  normalizeGlob,
  EOL,
} from "../deps.ts";
import Variables from "./variables.ts";
import Functions from "./functions.ts";

import { log } from "../deps.ts";

export interface EngineOptions {
  dryRun: boolean;
  defaultEOL: EOL;
}

export class Engine {
  // cached variables
  private includeGlobRegex: RegExp[];
  private excludeGlobRegex: RegExp[];
  private basicFilterFunction: (path: string) => boolean;

  /**
   * pre-defined functions
   */
  private functions: Functions = new Functions();

  private readonly options: EngineOptions;

  constructor(
    private readonly basePath: string,
    private readonly config: ConfigRoot,
    options: Partial<EngineOptions> = {},
  ) {
    this.includeGlobRegex = this.config.includeGlob.map((glob) =>
      globToRegExp(normalizeGlob(glob))
    );
    this.excludeGlobRegex = this.config.excludeGlob.map((glob) =>
      globToRegExp(normalizeGlob(glob))
    );

    this.basicFilterFunction = (_) => true;
    if (this.config.include.length > 0) {
      this.basicFilterFunction = (path) =>
        this.config.include.includes(getExt(path));
    } else if (this.config.exclude.length > 0) {
      this.basicFilterFunction = (path) =>
        !this.config.exclude.includes(getExt(path));
    }

    this.options = {
      defaultEOL: Deno.build.os === "windows" ? EOL.CRLF : EOL.LF,
      dryRun: false,
      ...options,
    };

    log.debug("Engine init:");
    log.debug("  basePath:", basePath);
    log.debug("  config:", config);
    log.debug("  options:", options);
    log.debug("  includeGlobRegex:", this.includeGlobRegex);
    log.debug("  excludeGlobRegex:", this.excludeGlobRegex);
    log.debug("  basicFilterFunction:", this.basicFilterFunction);
  }

  /**
   * To check whether config is valid.
   */
  public validateConfig(): string[] {
    const result = [];

    if (this.config.include.length > 0 && this.config.exclude.length > 0) {
      result.push(
        "Only one of the following attributes can be used: [include, exclude]",
      );
    }

    return result;
  }

  /**
   * To check if the file is selected.
   *
   * @param relativePath file path relative to working directory
   */
  public isFileSelected(relativePath: string): boolean {
    const select = this.basicFilterFunction(relativePath) &&
      (this.includeGlobRegex.length === 0 ||
        this.includeGlobRegex.some((reg) => reg.test(relativePath))) &&
      (this.excludeGlobRegex.length === 0 ||
        this.excludeGlobRegex.every((reg) => !reg.test(relativePath)));

    return this.config.customFilter(relativePath, select);
  }

  /**
   * Get all selected file paths (relative to working directory)
   */
  public async *globFiles(): AsyncIterableIterator<string> {
    for await (const entry of walk(this.basePath)) {
      if (!entry.isFile) {
        continue;
      }

      const relativePath = relative(this.basePath, entry.path);
      const selected = this.isFileSelected(relativePath);

      log.debug(
        `walk files. path: ${entry.path}, relativePath: ${relativePath}, selected: ${selected}`,
      );

      if (selected) {
        yield relativePath;
      }
    }
  }

  /**
   * Get the config of a certain file type, if not found, default config is used.
   *
   * @param path the path of a parameter, such as `format.commentPrefix`
   * @param type The extension of the file, including dot `.`, such as `.txt`
   */
  public getConfig(path: string, type: string): unknown {
    const langResult = lodashGet(this.config.languages[type], path, undefined);
    if (langResult) {
      return langResult;
    } else {
      return lodashGet(this.config.default, path, undefined);
    }
  }

  /**
   * Try to find the position and length of the header. If nothing is found,
   * return null
   *
   * @param content file content
   * @param type file type, such as `.txt`
   */
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

    // TODO: let it find the header even there are no blank line after it
    const endPattern = this.getConfig("format.commentEnd", type) as string +
      new Array(
        1 + (this.getConfig("format.trailingBlankLine", type) as number),
      ).fill(eol).join("");
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

  /**
   * Generate file header, each line is an item in array.
   *
   * @param path relative path of the file
   * @param type file extension, such as `.txt`
   */
  public generateFileHeader(path: string, type: string): string[] {
    const template = this.getConfig("template", type) as TemplateFunction;
    const tempStr = template(
      this.getConfig("variables", type) as Variables,
      this.functions,
      path,
    );
    const eol = detectEOL(tempStr);
    const lines = eol === null ? [tempStr] : tempStr.split(eol);
    const commentPrefix = this.getConfig(
      "format.commentPrefix",
      type,
    ) as string;

    return [
      // first line
      this.getConfig("format.commentBegin", type) as string +
      this.getConfig("headerIndicator", type) as string,
      // content
      ...lines.map((item) => commentPrefix + item),
      // last line
      this.getConfig("format.commentEnd", type) as string,
      // trailing blank lines
      ...new Array(this.getConfig("format.trailingBlankLine", type) as number)
        .fill(""),
    ];
  }

  /**
   * Start working on files
   */
  public async work(): Promise<void> {
    // TODO: optimise
    for await (const path of this.globFiles()) {
      const absolutePath = joinPath(this.basePath, path);
      // TODO: handle encoding
      const content = await readFileStr(absolutePath);
      const type = getExt(path);
      const eol = detectEOL(content) ?? this.options.defaultEOL;

      log.debug(`working on ${absolutePath}, type: ${type}, eol: ${eol}`);

      const newFileHeader = this.generateFileHeader(path, type).join(eol) + eol;

      const headerPosition = this.findFileHeader(content, type);

      if (headerPosition === null) {
        await this.writeFile(absolutePath, newFileHeader + content);
        log.debug("new header inserted");
        continue;
      }

      const { begin, length } = headerPosition;

      const oldFileHeader = content.substr(begin, length);

      if (oldFileHeader === newFileHeader) {
        log.debug("no need to change header");
        continue;
      }

      const newContent = content.substring(0, begin) +
        newFileHeader + content.substring(begin + length);

      await this.writeFile(absolutePath, newContent);

      log.debug("header replaced");
    }
  }

  private writeFile(path: string, content: string): Promise<void> {
    if (this.options.dryRun) {
      console.log("----------------------------------");
      console.log("File written to " + path);
      console.log("----------------------------------");
      console.log(content);
      return Promise.resolve();
    } else {
      return writeFileStr(path, content);
    }
  }
}
