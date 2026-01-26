---
title: "Frequently Asked Questions"
description: "Common questions about Zellij terminal workspace: what it is, how it works, keyboard shortcuts, layouts, plugins, and more."
---

## What is Zellij?

Zellij is a terminal workspace aimed at developers, ops-oriented people, and anyone who loves the terminal. It's sometimes called a "terminal multiplexer" - a tool that allows you to manage multiple terminal sessions, panes, and tabs from a single interface without tying you to a specific terminal emulator.

Zellij is designed around the philosophy that you shouldn't have to sacrifice simplicity for power. It provides an excellent out-of-the-box experience while offering advanced features like floating panes, stacked panes, layouts, session resurrection, plugins, and session management.

## How is Zellij different from a regular terminal?

A regular terminal emulator (like Alacritty, iTerm2, or GNOME Terminal) provides a single shell session. Zellij runs *inside* your terminal and provides:

- **Multiple panes**: Split your terminal into multiple sections, each running different commands
- **Tabs**: Organize related panes into tabs for different projects or tasks
- **Sessions**: Create named sessions that persist even if you close your terminal
- **Layouts**: Automate your workspace setup with pre-configured commands and pane arrangements
- **Plugins**: Extend functionality with WebAssembly plugins

While some terminals provide a limited amount of these features on their own, Zellij is terminal agnostic - allowing you to choose a terminal based on its own strengths (font and ligature rendering, GPU acceleration, integration with your desktop environment, etc.) rather than its pane/tab management features.

Think of Zellij as adding a powerful workspace layer on top of your existing terminal.

## Do I need to learn new keyboard shortcuts?

Zellij comes out-of-the-box with mneumonic shortcuts, designed to be easy to remember. The status-bar also displays the available shortcuts on-screen, so you don't need to remember anything. After using Zellij for only a few days, users usually get used to them and don't want to change anything.

That being said, all shortcuts are configurable and can be tailored to your needs. See [keybindings configuration](/documentation/keybindings.html) for more info.

Some users, especially those who use terminal editors such as `vim` might encounter keybind collisions, for those Zellij provides a [non-colliding, unlock first](/tutorials/colliding-keybindings) keybinding preset.

## Can I use Zellij with my existing terminal setup?

Yes! Zellij works with any terminal emulator and doesn't require changing your existing setup:

- Use your favorite terminal emulator (Alacritty, iTerm2, Konsole, etc.)
- Keep your existing shell (bash, zsh, fish)
- Use your configured `$EDITOR` (vim, neovim, emacs, helix)
- Maintain your dotfiles and shell customizations

Run `zellij` in your terminal to start and that's it. You can even configure your terminal to launch Zellij automatically. See our [session management tutorial](/tutorials/session-management) for integration examples.

## What are layouts and why should I use them?

Layouts are configuration files (written in [KDL](https://kdl.dev)) that describe your workspace structure:

- Define which panes to open and where
- Specify commands to run in each pane
- Open files in your editor automatically
- Configure tabs for different aspects of your project
- Include plugins like tab bars and status bars

**Use cases:**
- Start a development environment with editor, test runner, and logs
- Create project-specific layouts for different repositories
- Share workspace configurations with team members
- Automate repetitive setup tasks

Layouts can dramatically reduce the time spent setting up your workspace each time you start working. Learn how to create them in our [layouts tutorial](/tutorials/layouts).

## Can I use Zellij in the browser?

Yes! Zellij includes a built-in web server:

- Access Zellij sessions from any modern browser
- No terminal emulator required
- Share sessions with teammates via URL
- Built-in authentication for security
- Seamlessly switch between terminal and browser

The web client makes Zellij accessible anywhere, perfect for:
- Remote access to your development environment
- Pair programming and collaboration
- Using Zellij on devices without a terminal emulator

See our [web client tutorial](/tutorials/web-client) for setup instructions.

The web server **must be explicitly started** and configured with an HTTPS certificate and token authentication. For those who don't want it at all, Zellij also provides a pre-compiled version without the web server capability.

## How do plugins work?

Zellij's plugin system uses WebAssembly (WASM), allowing plugins written in any language that compiles to WASM:

**Built-in plugins:**
- Tab bar and status bar (the Zellij UI)
- Strider (filepicker)
- Session manager
- Multiple-pane selection interface
- Configuration screen

**Custom plugins:**
- Write plugins in Rust, Go, AssemblyScript, or other WASM-compatible languages
- Access Zellij state and events
- Render custom UIs
- Respond to user input
- Distribute via GitHub or other hosting as single `.wasm` files

Rust has first-class support with official SDK and scaffolding tools. Check out our [plugin development tutorial](/tutorials/developing-a-rust-plugin) to get started.

## Is Zellij actively maintained?

Yes! Zellij is actively developed full-time by [Aram Drevekenin](https://poor.dev) with support from the community and sponsors:

- Regular releases with new features
- Responsive bug fixes and support
- Active community on GitHub and social media
- Comprehensive documentation and tutorials

Zellij will always remain free and open-source. If you find it valuable, consider [supporting the Zellij developer](https://github.com/sponsors/imsnif) to help maintain this full-time effort.

## How do I handle keyboard shortcut conflicts?

If Zellij shortcuts conflict with applications running inside (like vim), use the "Unlock-First (non-colliding)" preset:

1. Press `Ctrl o` to enter Session mode
2. Press `c` to open the Configuration screen
3. Press `Tab` to navigate to "Change Mode Behavior"
4. Select "Unlock-First (non-colliding)" and press `Enter`

This preset requires unlocking the interface before accessing Zellij modes, preventing conflicts. See our detailed [colliding keybindings tutorial](/tutorials/colliding-keybindings).

## Can I customize the appearance?

Yes, Zellij supports theming and configuration:

- Choose from built-in color themes
- Create custom themes
- Configure UI components (tab bar, status bar)
- Adjust frame colors and borders
- Control UI visibility and layout

Configuration is stored in `~/.config/zellij/config.kdl` using the KDL format. See the [theme documentation](/documentation/themes.html) for details.

## How does Zellij compare to tmux or screen?

Zellij offers similar workspace management capabilities as tmux and screen but with modern design choices:

**Key differences:**
- **UI**: Zellij provides an intuitive UI with status bar and visual feedback
- **Floating and stackd panes**: First-class support for multiple floating windows and vertically stacked panes
- **Layouts**: More powerful automation with command panes and templates, built-in
- **Plugins**: Extensible via WebAssembly, does not rely on locally installed scripts
- **Web client**: Built-in browser access
- **True Multiplayer**: Allows multiple users to connect to the same session, each getting their own colored cursor
- **Beginner-friendly**: Works great out of the box

Zellij aims to provide power without sacrificing simplicity. See [features](/features) for a non-exhaustive list of unique features.

That being said, Zellij does not consider itself a tmux or screen replacement. Read more about its mission [here](https://poor.dev/blog/why-zellij/).

## What operating systems does Zellij support?

Zellij supports:
- **Linux**: All major distributions
- **macOS**: Intel and Apple Silicon
- **Windows**: Via WSL (Windows Subsystem for Linux)

Pre-built binaries are available for most platforms. See the [installation documentation](/documentation/installation.html) for details.

## How do I get help or report issues?

- **Documentation**: Start with the [official documentation](/documentation)
- **Tutorials**: Watch [screencasts and tutorials](/screencasts)
- **GitHub Issues**: Report bugs or request features at [github.com/zellij-org/zellij/issues](https://github.com/zellij-org/zellij/issues)
- **Discussions**: Ask questions in [GitHub Discussions](https://github.com/zellij-org/zellij/discussions)
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

## Is there a quick way to try Zellij without installing?

Yes! You can try Zellij directly in your browser without any installation:

Visit [zellij.dev/documentation/installation.html#try-zellij-without-installing](/documentation/installation.html) for instructions on accessing the demo instance.

For local installation, you can also use:
```bash
bash <(curl -L zellij.dev/launch)
```

This downloads and runs Zellij temporarily without permanent installation.
