# Installation

The easiest way to install Zellij is through [a package for your OS](#third-party-repositories).

If one is not available for your OS, you can [download a prebuilt binary](#binary-download) or even [try Zellij without installing](https://zellij.dev).

Otherwise, you can [install it with Cargo](#rust-cargo).

-------------------------------

## Rust - Cargo

For instructions on how to install Cargo see [here](https://doc.rust-lang.org/cargo/getting-started/installation.html).

Once installed run:

```
cargo install --locked zellij
```

If experiencing errors, if installed through rustup, please try running:
```
rustup update
```

-------------------------------

## Binary Download

Binaries are made available each release for the Linux and MacOS operating systems.

It is possible to download the binaries for these on the [release](https://github.com/zellij-org/zellij/releases) page.

Once downloaded, untar the file:
```
tar -xvf zellij*.tar.gz
```

check for the execution bit:

```
chmod +x zellij
```

and then execute Zellij:

```
./zellij
```

Include the directory Zellij is in, in your [PATH Variable](https://www.baeldung.com/linux/path-variable) if you wish to be able to execute it anywhere.

'Or'

move Zellij to a directory already included in your [$PATH] Variable.

-------------------------------

## Compiling Zellij From Source

Instructions on how to compile Zellij from source can be found [here](https://github.com/zellij-org/zellij/blob/main/CONTRIBUTING.md).

## Third party repositories

Zellij is packaged in some third part repositories.
Please keep in mind that they are not directly affiliated with zellij maintainers:

[![Packaging status](https://repology.org/badge/vertical-allrepos/zellij.svg)](https://repology.org/project/zellij/versions)

More information about third party installation can be found [here](https://github.com/zellij-org/zellij/blob/main/docs/THIRD_PARTY_INSTALL.md).
