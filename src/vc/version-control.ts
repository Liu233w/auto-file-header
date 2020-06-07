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
   * Get a list of globs that represent ignored files by the version control
   */
  ignoreGlobs(): Promise<string[]>;

  /**
   * Get modified files (relative path)
   */
  modifiedFiles(): AsyncIterableIterator<string>;

  // TODO: other interfaces?
}
