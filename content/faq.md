---
title: "Frequently Asked Questions"
description: "Common questions about Zellij: what it is, how it works, keyboard shortcuts, layouts, plugins, and more."
---

## What is Zellij?

Zellij is a terminal and multiplexer aimed at developers, ops-oriented people, and anyone who loves the terminal. It lets you manage multiple terminal sessions, panes, and tabs from a single interface, inside the terminal you already use or in its own window.

Zellij is designed around the philosophy that you shouldn't have to sacrifice simplicity for power. It works well out of the box, and comes with features like floating and stacked panes, layouts, an inbox that tracks coding agents and long-running commands, live session previews, session resurrection and plugins.

## Is there a quick way to try Zellij without installing?

Yes. On Linux or macOS, run:

```bash
bash <(curl -L https://zellij.dev/launch)
```

On Windows, in PowerShell:

```powershell
irm https://zellij.dev/launch.ps1 | iex
```

The script starts the latest release and offers to install it, or runs it from a temporary folder. See the [installation documentation](/documentation/installation.html) for details.

## What operating systems does Zellij support?

Zellij supports:
- **Linux**: All major distributions
- **macOS**: Intel and Apple Silicon
- **Windows**: Natively, with an installer, or inside WSL (Windows Subsystem for Linux)

Pre-built binaries are available for most platforms. See the [installation documentation](/documentation/installation.html) for details.

## Do I need to learn new keyboard shortcuts?

Zellij comes out-of-the-box with mnemonic shortcuts, designed to be easy to remember. The status bar also displays the available shortcuts on-screen, so you don't need to remember anything. After using Zellij for only a few days, users usually get used to them and don't want to change anything.

That being said, all shortcuts are configurable and can be tailored to your needs. See [keybindings configuration](/documentation/keybindings.html) for more info. If they collide with the shortcuts of programs you run inside Zellij, see [the next question](#how-do-i-handle-keyboard-shortcut-conflicts).

## How do I handle keyboard shortcut conflicts?

If Zellij shortcuts conflict with applications running inside (like vim), use the "Unlock-First (non-colliding)" preset:

1. Press `Ctrl o` to enter Session mode
2. Press `c` to open the Settings screen
3. Open the "Keyboard" category and choose "Key bindings and preset…"
4. Select the Unlock-First preset, then press `Ctrl a` to save it

The same can be done from the command line with `zellij setup --keybinding-preset unlock-first`.

This preset requires unlocking the interface before accessing Zellij modes, preventing conflicts. See our detailed [colliding keybindings tutorial](/tutorials/colliding-keybindings).

## Do I need the Zellij terminal, or can I keep my own?

Either works. Zellij runs inside any terminal emulator, and also comes with a complete, modern terminal of its own: run `zellij terminal` to open it. It adds image support, a tray icon that shows when something needs you, desktop notifications and a launcher in the app menu. Your sessions are the same in both, so you can start a session in one and open it in the other. See [Zellij as your terminal](/tutorials/zellij-terminal/).

## Can I use Zellij with my existing terminal setup?

Yes! Zellij doesn't require changing your existing setup:

- Use your favorite terminal emulator (Alacritty, iTerm2, Konsole, etc.)
- Keep your existing shell (bash, zsh, fish)
- Use your configured `$EDITOR` (vim, neovim, emacs, helix)
- Maintain your dotfiles and shell customizations

Run `zellij` in your terminal to start and that's it, or run `zellij terminal` to open Zellij in its own window. You can even configure your terminal to launch Zellij automatically. See our [session management tutorial](/tutorials/session-management) for integration examples.

## Do my sessions survive closing the window or a reboot?

Yes. Closing the window, or losing your SSH connection, leaves the session running in the background: reopen it from the session manager (`Ctrl o` + `w`), the Zellij terminal's tray icon, or `zellij attach`.

Sessions that exited, for example after a reboot, are kept too. Reopen one and it comes back with its layout and commands, each waiting to run again. See [session resurrection](/documentation/session-resurrection.html).

## How does Zellij help with coding agents?

Run each agent in its own pane, tab or session, and follow them all from the inbox (`Ctrl o` + `i`). It lists every agent and long-running command across all your sessions by status: needs you, working, done or failed. Answer an agent right from the inbox's live preview, or jump straight to it.

Claude Code, Codex CLI, OpenCode and other agents report their status with no setup. See [Zellij for coding agents](/agents/).

## Can I run Zellij on a server over SSH, inside my local Zellij?

Yes. SSH to the server from a Zellij pane and run Zellij there: the remote session works inside the local one, and Zellij lets you move your keys between the two. From the remote Zellij's session manager you can browse its sessions with live previews and attach to one. See [nested sessions](/documentation/nested-sessions.html).

## Can I use Zellij in the browser?

Yes! Zellij includes a built-in web server:

- Access Zellij sessions from any modern browser, even on a phone
- No terminal emulator required
- Share sessions with teammates via URL
- Built-in authentication for security
- Seamlessly switch between terminal and browser

The same server lets you attach to a remote session from another terminal or from the Zellij terminal, with `zellij attach https://…`, without SSH.

See our [web client tutorial](/tutorials/web-client) for setup instructions.

The web server **must be explicitly started** and configured with an HTTPS certificate and token authentication. For those who don't want it at all, Zellij also provides a pre-compiled version without the web server capability.

To share a session with a link without running a server yourself, see [zellij.online](/zellij-online/), run by the Zellij maintainers.

## What are layouts and why should I use them?

Layouts are configuration files (written in [KDL](https://kdl.dev)) that describe how your panes and tabs are arranged:

- Define which panes to open and where
- Specify commands to run in each pane
- Open files in your editor automatically
- Configure tabs for different aspects of your project
- Include plugins like tab bars and status bars

**Use cases:**
- Start a development environment with editor, test runner, and logs
- Create project-specific layouts for different repositories
- Share setups with team members
- Automate repetitive setup tasks

Layouts can dramatically reduce the time spent setting up each time you start working. Learn how to create them in our [layouts tutorial](/tutorials/layouts).

## How do plugins work?

Zellij's plugin system uses WebAssembly (WASM), allowing plugins written in any language that compiles to WASM:

**Built-in plugins:**
- Tab bar and status bar (the Zellij UI)
- Strider (filepicker)
- Session manager and inbox
- Multiple-pane selection interface
- Settings screen

**Custom plugins:**
- Write plugins in Rust, or in Go with a [community SDK](/documentation/plugin-other-languages.html)
- Access Zellij state and events
- Render custom UIs
- Respond to user input
- Distribute via GitHub or other hosting as single `.wasm` files

Rust has first-class support with official SDK and scaffolding tools. Check out our [plugin development tutorial](/tutorials/developing-a-rust-plugin) to get started.

## Can I customize the appearance?

Yes, Zellij supports theming and configuration:

- Choose from built-in color themes
- Create or change themes in the theme editor, which previews your colors and flags any that are hard to read
- Configure UI components (tab bar, status bar)
- Adjust frame colors and borders
- Control UI visibility and layout

Configuration is stored in `~/.config/zellij/config.kdl` using the KDL format, and most of it can be changed from the [settings screen](/documentation/settings-screen.html) (`Ctrl o` + `c`). See the [theme documentation](/documentation/themes.html) for details.

## How does Zellij compare to tmux or screen?

Zellij offers similar capabilities to tmux and screen, but with modern design choices:

**Key differences:**
- **UI**: Zellij provides an intuitive UI with status bar and visual feedback
- **Floating and stacked panes**: First-class support for multiple floating windows and vertically stacked panes
- **Layouts**: More powerful automation with command panes and templates, built-in
- **Inbox**: Follows coding agents and long-running commands across all your sessions
- **Built-in terminal**: Zellij can run as its own terminal, with a tray icon and desktop notifications
- **Plugins**: Extensible via WebAssembly, does not rely on locally installed scripts
- **Web client**: Built-in browser access
- **True Multiplayer**: Allows multiple users to connect to the same session, each getting their own colored cursor
- **Beginner-friendly**: Works great out of the box

Zellij aims to provide power without sacrificing simplicity. See [features](/features) for a non-exhaustive list of unique features.

## Is Zellij actively maintained?

Yes! Zellij is actively developed full-time by [Aram Drevekenin](https://poor.dev) with support from the community and sponsors:

- Regular releases with new features
- Responsive bug fixes and support
- Active community on GitHub and social media
- Comprehensive documentation and tutorials

Zellij will always remain free and open-source. If you find it valuable, consider [supporting the Zellij developer](https://github.com/sponsors/imsnif) to help maintain this full-time effort.

## How do I get help or report issues?

- **Documentation**: Start with the [official documentation](/documentation)
- **Tutorials**: Watch [screencasts and tutorials](/screencasts)
- **GitHub Issues**: Report bugs or request features at [github.com/zellij-org/zellij/issues](https://github.com/zellij-org/zellij/issues)
- **Discussions**: Ask questions in [GitHub Discussions](https://github.com/zellij-org/zellij/discussions)
- **Chat**: Join the community on [Discord](https://discord.gg/CrUAFH3) or [Matrix](https://matrix.to/#/#zellij_general:matrix.org)
- **Social Media**: Follow [@zellij](https://hachyderm.io/@zellij) on Mastodon or [Bluesky](https://bsky.app/profile/zellij-dev.bsky.social)

The Zellij community is friendly and responsive to questions and feedback.

## Can I contribute to Zellij?

Absolutely! Contributions are welcome in many forms:

- **Code contributions**: Submit pull requests on GitHub
- **Documentation**: Improve guides and tutorials
- **Bug reports**: Help identify and fix issues
- **Feature requests**: Share ideas for improvements
- **Community support**: Answer questions in discussions
- **Financial support**: [supporting the Zellij developer](https://github.com/sponsors/imsnif)

Check the [contributing guidelines](https://github.com/zellij-org/zellij/blob/main/CONTRIBUTING.md) to get started.
