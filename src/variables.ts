export default class Variables implements Record<string, any> {

  // TODO: auto detect author by computer info
  author: string = "Author"

  projectStartYear: number = new Date().getFullYear()

  // TODO: auto detect license
  licenseName: string = "MIT"
}
