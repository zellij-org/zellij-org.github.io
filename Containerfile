FROM docker.io/peaceiris/mdbook:v0.4.15

RUN apk update && apk add hugo

# We must give it a bind address, otherwise it will listen to connections from
# 127.0.0.1. Since we connect to the server from "outside" the container, this
# doesn't work.
ENTRYPOINT mdbook watch docs/ -d ../static/documentation & hugo server --bind 0.0.0.0;
