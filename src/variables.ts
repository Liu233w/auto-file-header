/* @auto-file-header
 * Copyright (c) 2020 Shumin Liu and Contributors.
 * Licensed under MIT. See LICENSE file in the project root for full license information.
 */

export default class Variables implements Record<string, any> {

  // TODO: auto detect author by computer info
  author: string = "Author"

  projectStartYear: number = new Date().getFullYear()

  // TODO: auto detect license
  licenseName: string = "MIT"
}
