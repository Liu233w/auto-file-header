cache:
	deno cache --unstable deps.ts

test:
	deno test --unstable

header:
	deno run --unstable --allow-read --allow-write .fileheader.ts

udd:
	deno run --allow-read --allow-write --allow-net https://deno.land/x/udd@0.3.0/main.ts deps.ts