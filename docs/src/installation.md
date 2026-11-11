# Installation

The easiest way to install Zellij is to run the launch script, which downloads the latest release and starts it:

| Shell | Command |
|:------|:--------|
| bash / zsh | `bash <(curl -L https://zellij.dev/launch)` |
| fish | `bash (curl -L https://zellij.dev/launch \| psub)` |
| PowerShell | `irm https://zellij.dev/launch.ps1 \| iex` |

The scripts can be read before running them: [launch](https://zellij.dev/launch) (Linux / macOS) and [launch.ps1](https://zellij.dev/launch.ps1) (Windows).

The first time Zellij runs, the [setup screen](./desktop-setup.md#the-setup-screen) offers to install it: copy it to a permanent folder, add it to the app menu, the Dock or the Start menu, and (on Linux) make it the default terminal. Without these steps, the downloaded copy stays in a temporary folder, so the script can also be used to try Zellij without installing it.

The same can be done by hand: [download the executable](https://github.com/zellij-org/zellij/releases/latest) for your system and run it (see [Binary Download](#binary-download) for the details of each platform).

Zellij can also be installed [through your OS's package manager](#third-party-repositories), [with `cargo binstall`](#cargo---binstall), or [compiled and installed with Cargo](#rust---cargo).

Once installed, Zellij can be run inside any terminal with `zellij`, or in its own window with [`zellij terminal`](./zellij-terminal.md).

<a id="try-zellij-without-installing"></a>

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

This also installs a small `zellij-terminal` launcher next to `zellij`, which opens the [Zellij terminal](./zellij-terminal.md). The Zellij terminal is part of the default `terminal` Cargo feature. To build without it, leave the `terminal` feature out, eg.:
```
cargo install --locked zellij --no-default-features --features plugins_from_target,vendored_curl,web_server_capability
```
-------------------------------

## Cargo - binstall

For smaller machines like laptops, you might want to just install the binary instead of compiling everything.

The easiest way if cargo is present, is to install with the [binstall cargo extension](https://crates.io/crates/cargo-binstall): 
```
cargo binstall zellij
```


-------------------------------

## Binary Download

Pre-built binaries are available each release for Linux, macOS, and Windows on the [release page](https://github.com/zellij-org/zellij/releases).

### Linux / macOS

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

The Linux and macOS archives hold only the `zellij` binary. Each release also has a `zellij-desktop-files.tar.gz`, holding the desktop entry, icons and software-centre listing, meant for [packagers](https://github.com/zellij-org/zellij/blob/main/docs/PACKAGING_DESKTOP.md). To add Zellij to the app menu yourself, use [Desktop Setup](./desktop-setup.md) instead.

### Windows

Two downloads are available for Windows on the [release page](https://github.com/zellij-org/zellij/releases):

- **The installer** (`zellij-x86_64-pc-windows-msvc-installer.msi`) installs Zellij and can add it to the `PATH`. It can also add a Start menu shortcut (a checkbox on its first screen, on by default) and an "Open Zellij here" item to Explorer's folder menu. Silent installs can leave the shortcut out with `REMOVE=StartMenuShortcut`.
- **The zip** (`zellij-x86_64-pc-windows-msvc.zip`) holds `zellij.exe` and `zellij-terminal.exe`. Extract it, then run `zellij.exe` from a terminal (e.g., PowerShell or Windows Terminal), or double-click `zellij-terminal.exe` to open Zellij in its own [window](./zellij-terminal.md). Keep both files in the same folder.

The setup screen can copy Zellij from the zip to a permanent folder and put it on the `PATH`, see [Desktop Setup](./desktop-setup.md#windows).

-------------------------------

## Compiling Zellij From Source

Instructions on how to compile Zellij from source can be found [here](https://github.com/zellij-org/zellij/blob/main/CONTRIBUTING.md).

## Third party repositories

Zellij is packaged in some third part repositories.
Please keep in mind that they are not directly affiliated with zellij maintainers:

[![Packaging status](https://repology.org/badge/vertical-allrepos/zellij.svg)](https://repology.org/project/zellij/versions)

More information about third party installation can be found [here](https://github.com/zellij-org/zellij/blob/main/docs/THIRD_PARTY_INSTALL.md).
