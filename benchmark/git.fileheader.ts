import {
  work,
  within,
} from "https://raw.githubusercontent.com/Liu233w/auto-file-header/master/mod.ts";

work((cfg) => {
  cfg.include = [
    ".c",
    ".h",
  ];

  cfg.default.format.trailingBlankLine = 1;
});
