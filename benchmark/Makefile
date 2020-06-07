.PHONY: prepare clean run

run: export DENO_DIR = $(CURDIR)/.deno
run: prepare
	cd git && \
	\
	echo cache time && \
	time deno cache --unstable .fileheader.ts && \
	\
	echo first run time && \
	time deno run --unstable --allow-read --allow-write .fileheader.ts && \
	\
	echo second run time && \
	time deno run --unstable --allow-read --allow-write .fileheader.ts

prepare: git git/.fileheader.ts

git:
	git clone https://github.com/git/git.git git

git/.fileheader.ts:
	cp git.fileheader.ts git/.fileheader.ts

clean:
	rm -rf git .deno