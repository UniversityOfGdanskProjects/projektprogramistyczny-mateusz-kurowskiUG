FROM oven/bun:latest

WORKDIR /backend
COPY ./backend/package.json ./
COPY ./backend/bun.lockb ./
COPY ./backend/.env ./

RUN bun install

COPY ./backend/src ./src

CMD [ "bun","start" ]