FROM hayd/alpine-deno:latest

WORKDIR /-lib
COPY deps.ts .
RUN deno cache --unstable deps.ts

WORKDIR /src

ENTRYPOINT [ "deno", "run", "--unstable", "--allow-read", "--allow-write" ]
CMD [ ".fileheader.ts" ]