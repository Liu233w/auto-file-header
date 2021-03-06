import {
  work,
  within,
  vc,
} from "https://raw.githubusercontent.com/Liu233w/auto-file-header/master/mod.ts";

work((cfg) => {
  cfg.versionControl = vc.git();

  cfg.include = [
    ".c",
    ".h",
  ];

  cfg.default.format.trailingBlankLine = 1;
});
