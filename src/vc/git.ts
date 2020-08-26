/* @auto-file-header
 * Copyright (c) 2020 Shumin Liu and Contributors.
 * This file is a part of Auto File Header
 * Automatically update your file headers with an extendible config file!
 * Licensed under MIT. See LICENSE file in the project root for full license information.
 */

import { VersionControl } from "./version-control.ts";

export class Git implements VersionControl {
  private workingDir: string = "";

  private notIgnoredFiles?: Set<string> = undefined;

  setWorkingDir(path: string): void {
    this.workingDir = path;
  }

  async isIgnored(path: string): Promise<boolean> {
    if (!this.notIgnoredFiles) {
      // TODO: looking for other way to implement
      const process = Deno.run({
        cmd: ["git", "ls-files"],
        cwd: this.workingDir,
        stdout: "piped",
      });
      await process.status()
      process.close()

      const output = await process.output();
      // TODO: detect encoding
      const lines = new TextDecoder("utf-8")
        .decode(output)
        .split(/\r?\n/);
      this.notIgnoredFiles = new Set(lines);
    }

    return !this.notIgnoredFiles.has(path);
  }

  async *modifiedFiles(): AsyncIterableIterator<string> {
    throw new Error("Not Implemented");
  }
}
