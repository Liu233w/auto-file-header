/* @auto-file-header
 * Copyright (c) 2020 Shumin Liu and Contributors.
 * Licensed under MIT. See LICENSE file in the project root for full license information.
 */

import Variables from "./variables.ts";

export default class Functions {
  year(): number {
    return new Date().getFullYear();
  }
  years(v: Variables): string {
    const begin = v.projectStartYear
    const end = this.year()

    if (begin === end) {
      return String(begin);
    } else {
      return `${begin} - ${end}`;
    }
  }
}
