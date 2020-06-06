/* @auto-file-header
 * Copyright (c) 2020 Shumin Liu and Contributors.
 * This file is a part of Auto File Header
 * Automatically update your file headers with an extendible config file!
 * Licensed under MIT. See LICENSE file in the project root for full license information.
 */

export default class Variables implements Record<string, any> {
  // TODO: auto detect author by computer info
  author: string = "{author}";

  projectStartYear: number = new Date().getFullYear();

  // TODO: auto detect license
  licenseName: string = "{license}";

  copyrightHolder: string = "{company}";
}
