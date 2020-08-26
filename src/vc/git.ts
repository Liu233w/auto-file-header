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

  isIgnored(path: string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }

  async *modifiedFiles(): AsyncIterableIterator<string> {
    throw new Error("Not Implemented");
  }
}
