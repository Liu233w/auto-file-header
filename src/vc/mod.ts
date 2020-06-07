import { Git } from "./git.ts";

export const vc = {
  git(): Git {
    return new Git();
  },
};

export { VersionControl } from "./version-control.ts";
