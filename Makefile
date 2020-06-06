cache:
	deno cache --unstable deps.ts

test:
	deno test --unstable

header:
	deno run --unstable --allow-read --allow-write .fileheader.ts