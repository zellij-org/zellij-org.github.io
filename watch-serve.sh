#!/usr/bin/env bash

# Return 0 if command $1 exists, 1 otherwise.
function _exists {
    command -v "$1" >/dev/null
}

if $(_exists mdbook) && $(_exists hugo); then
    { mdbook watch docs/ -d ../static/documentation & mdbook watch docs-old/ -d ../static/old-documentation & hugo server; }
    exit 0
fi

# Some pre-requisites are missing, try to use containers
CRT=""
CONTAINER_NAME="zellij-docs:latest"

if $(_exists nix); then
    echo "Trying 'nix develop' to execute script"

    nix develop --command "$0"

    if [[ $? -ne 0 ]] && $(_exists nix-shell); then
        echo "Using 'nix-shell' to execute script instead"

        nix-shell --command "$0"
    fi

elif $(_exists podman); then
    CRT="$(which podman)"
    echo "Using '$CRT' as container runtime"

    $CRT build --tag "$CONTAINER_NAME" -f Containerfile
    $CRT run --rm -it --userns keep-id --user "$(id -u):$(id -g)" -v "$PWD:$PWD:z" -w "$PWD" -p 1313:1313 $CONTAINER_NAME

elif $(_exists docker); then
    CRT="$(which docker)"
    echo "Using '$CRT' as container runtime"

    $CRT build --tag "$CONTAINER_NAME" - <Containerfile
    $CRT run --rm -it --user "$(id -u):$(id -g)" -v "$PWD:$PWD" -w "$PWD" -p 1313:1313 $CONTAINER_NAME

else
    echo "You must have installed either of:"
    echo ""
    echo "  - nix"
    echo "  - docker"
    echo "  - podman"
    echo "  - mdbook AND hugo"
    echo ""
    echo "To compile and preview the docs locally."
    exit 1
fi

exit 0
