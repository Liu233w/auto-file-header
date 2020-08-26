/* @auto-file-header
 * Copyright (c) 2020 Shumin Liu and Contributors.
 * This file is a part of Auto File Header
 * Automatically update your file headers with an extendible config file!
 * Licensed under MIT. See LICENSE file in the project root for full license information.
 */

/**
 * Interface of version control system
 */
export interface VersionControl {
  /**
   * Set working dir
   * @param path The absolute path of the working dir (base path of the source)
   */
  setWorkingDir(path: string): void;

  /**
   * Check if the file is ignore by vc
   * @param path the path to the file relative to working dir
   */
  isIgnored(path: string): Promise<boolean>;

  /**
   * Get modified files (relative path)
   */
  modifiedFiles(): AsyncIterableIterator<string>;

  // TODO: other interfaces?
}
