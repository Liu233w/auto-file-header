/* @auto-file-header
 * Copyright (c) 2020 Shumin Liu and Contributors.
 * This file is a part of Auto File Header
 * Automatically update your file headers with an extendible config file!
 * Licensed under MIT. See LICENSE file in the project root for full license information.
 */

import { VersionControl } from "./version-control.ts";

import { walk, globToRegExp, relative, readFileStr } from "../../deps.ts";
import { splitByLines } from "../utils.ts";

export class Git implements VersionControl {
  private workingDir: string = "";

  setWorkingDir(path: string): void {
    this.workingDir = path;
  }

  async ignoreGlobs(): Promise<string[]> {
    if (this.workingDir === "") {
      throw new Error("Please set workingDir before using VersionControl");
    }

    const result = [];

    for await (
      const entry of walk(
        this.workingDir,
        { match: [globToRegExp("**/.gitignore")] },
      )
    ) {
      if (!entry.isFile) {
        continue;
      }

      const relativePath = relative(this.workingDir, entry.path);
      const content = await readFileStr(entry.path);

      for (const line of splitByLines(content)) {
        const glob = Git.resolveGlob(relativePath, line);
        if (glob !== null) {
          result.push(glob);
        }
      }
    }

    // `foo` in gitignore can either be a file or directory
    return [
      ...result,
      ...result.map((p) => p + (p.endsWith("/") ? "**" : "/**")),
    ];
  }

  /**
   * Resolve a glob from a line of gitignore.
   *
   * @param path The relative path of the gitignore file
   * @param item A line in the gitignore file
   * @returns null if the line is a comment or blank, else return the glob
   */
  static resolveGlob(path: string, item: string): string | null {
    let line = item.trim();
    if (line === "" || line.startsWith("#")) {
      return null;
    }

    // `base/path/.gitignore` => `base/path/`
    path = path.substr(0, path.length - ".gitignore".length);

    // for lines like `!foo`, extract them first
    let reverse = false;
    if (line.startsWith("!")) {
      reverse = true;
      line = line.substr(1);
    }

    if (line.startsWith("/")) {
      // `foo` => `foo`
      line = line.substr(1);
    } else {
      // `foo` => `**/foo`
      line = "**/" + line;
    }

    return (reverse ? "!" : "") + path + line;
  }

  async *modifiedFiles(): AsyncIterableIterator<string> {
    throw new Error("Not Implemented");
  }
}
