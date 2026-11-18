FROM docker.io/library/alpine:3.24

# Same versions as CI (.github/workflows/gh-pages.yml), from the official release builds.
ARG HUGO_VERSION=0.170.0
ARG MDBOOK_VERSION=0.5.4
RUN apk add --no-cache curl \
    && case "$(uname -m)" in \
         x86_64)  hugo=amd64; mdbook=x86_64 ;; \
         aarch64) hugo=arm64; mdbook=aarch64 ;; \
         *) echo "Unsupported architecture: $(uname -m)" >&2; exit 1 ;; \
       esac \
    && curl -fsSL "https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}/hugo_${HUGO_VERSION}_linux-${hugo}.tar.gz" \
       | tar -xz -C /usr/local/bin hugo \
    && curl -fsSL "https://github.com/rust-lang/mdBook/releases/download/v${MDBOOK_VERSION}/mdbook-v${MDBOOK_VERSION}-${mdbook}-unknown-linux-musl.tar.gz" \
       | tar -xz -C /usr/local/bin mdbook

# We must give it a bind address, otherwise it will listen to connections from
# 127.0.0.1. Since we connect to the server from "outside" the container, this
# doesn't work.
ENTRYPOINT mdbook watch docs/ -d ../static/documentation & hugo server --bind 0.0.0.0;
