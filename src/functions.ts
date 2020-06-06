/* @auto-file-header
 * Copyright (c) 2020 Shumin Liu and Contributors.
 * Licensed under MIT. See LICENSE file in the project root for full license information.
 */

export default class Functions {
  year(): number {
    return new Date().getFullYear();
  }
  rangedYear(begin: number, end: number): string {
    if (begin === end) {
      return String(begin);
    } else {
      return `${begin} - ${end}`;
    }
  }
}
