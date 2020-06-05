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
