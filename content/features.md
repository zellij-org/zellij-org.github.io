---
title: "Zellij Features - Terminal Superpowers at your Fingertips"
description: "Discover Zellij's powerful features: floating panes, stacked panes, layouts, session management, web client, plugins, and more."
images: ["/img/floating-panes-preview.png"]
---

Following is a non-exhaustive list of features that make using Zellij a joyful experience.

## Floating Panes

{{<figure src="/img/floating-panes-feature-demo.gif" alt="Zellij floating panes demonstration">}}

Zellij offers flexible pane management with both tiled and floating layouts:

Floating Panes are first-class citizens in Zellij. They can be toggled on and off with `Alt f` and are persistent. If you run a command in a floating pane, hide it, and then show it again, the command will still be running in the background. Floating panes can be:
- Moved around with the mouse or keyboard
- Resized
- Rearranged dynamically
- Pinned to stay always-on-top (perfect for monitoring commands while working)

Tiled panes can also be turned into floating panes and vice versa.

## Stacked Panes

{{<figure src="/img/stacked-panes-feature-demo.gif" alt="Zellij stacked panes demonstration">}}

Stacked Panes allow you to layer multiple panes on top of each other. This is perfect for:
- Keeping multiple editor buffers accessible
- Monitoring several commands without taking up horizontal space
- Organizing your workspace by task or context

Navigate between stacked panes with arrow keys and resize them dynamically. Learn more in our [stacked resize tutorial](/tutorials/stacked-resize).

## Layouts & Automation

{{<figure src="/img/tutorial-2-preview.png" alt="Zellij layout example with editor and command panes">}}

Zellij layouts are powerful automation tools that describe pre-defined sets of panes, tabs, terminals, commands, and plugins. They allow you to:

- **Automate Workflows**: Define your entire development environment in a single KDL file
- **Command Panes**: Pre-configure commands that can be re-run with a single key press
- **Edit Panes**: Automatically open files in your editor when starting a session
- **Pane Templates**: Avoid repetition by defining reusable pane configurations
- **Tab Layouts**: Structure multiple tabs with different purposes

Layouts can be version-controlled and shared with your team, making onboarding and context-switching seamless. Check out our comprehensive [layouts tutorial](/tutorials/layouts) to get started.

## Session Management

{{<figure src="/img/tutorial-3-preview.png" alt="Zellij welcome screen showing session management">}}

Tired of searching through terminal windows trying to find the right context? Zellij's session management features solve this problem:

**Session Manager** (`Ctrl o` + `w`) provides:
- Quick switching between running sessions
- Session creation with custom names
- Background session management
- Context preservation when switching

**Welcome Screen** (launch with `zellij -l welcome`) offers:
- "Start Menu" for your terminal
- Visual session selection interface
- Create or attach to sessions on startup
- Resurrect exited sessions with full context

**Session Resurrection** is a unique feature that allows you to bring back closed sessions with their full pane structure and commands, even across reboots. This is invaluable when you need to return to a previous complex task or context.

Learn how to integrate session management into your workflow in our [session management tutorial](/tutorials/session-management).

## Web Client

{{<figure src="/img/web-client-screencast-preview.png" alt="Zellij web client interface">}}

Zellij includes a built-in web server that serves sessions directly in your browser:

**Key Features:**
- **No Terminal Required**: Access your Zellij sessions from any web browser
- **Built-in authentication**: Control access to your terminal
- **Persistent Sessions**: Bookmark specific sessions via URL (e.g., `http://localhost:8082/my-project`)
- **Seamless Switching**: Switch between terminal and browser without interruption
- **Share Sessions**: Perfect for pair programming, debugging with teammates, or accessing your terminal remotely

The web client makes the terminal emulator optional, not required. Set it up locally or share sessions with your team. See our [web client tutorial](/tutorials/web-client) for setup instructions.

## Plugin System

{{<figure src="/img/develop-rust-plugin.png" alt="A Zellij pane instructing the user about the plugin development flow">}}

Zellij's plugin system allows you to extend functionality using WebAssembly:

**The Zellij interface is made up of plugins:**
- **Tab Bar & Status Bar**: Customizable UI components
- **Session Manager**: Visual session management interface
- **Welcome Screen**: Session launcher and manager
- **Multiple Pane Select**: Bulk operations on multiple panes
- **Configuration Screen**: Interactive configuration management
- **Strider (Filepicker)**: Dynamic filesystem navigation with fuzzy finding

**Develop Your Own:**
- Write plugins in any language that compiles to WebAssembly
- Rust has first-class support with dedicated SDK
- Access to Zellij state and events
- Can render custom UIs and respond to user input
- Distribute as a single .wasm file that does not require installation

Zellij provides scaffolding tools to get started quickly. Follow our [Rust plugin development tutorial](/tutorials/developing-a-rust-plugin) to build your first plugin.

## Command Panes

{{<figure src="/img/command-pane-screenshot.png" alt="A Zellij command pane">}}

Command panes are a unique Zellij feature that treats commands as first-class pane citizens rather than just terminal output:

**Benefits:**
- See the exit code of completed commands
- Re-run commands with a single `Enter` key press
- Start commands suspended and run them on-demand
- Keep frequently-used commands accessible in your layout
- Perfect for build commands, tests, and development servers

Command panes can be included in layouts with the `start_suspended` option, allowing you to define commands that wait for you to manually trigger them. This is ideal for resource-intensive operations you don't want running immediately on startup.

## Scrollback Editing

{{<figure src="/img/tutorial-1-editing-scrollback.png" alt="Editing scrollback in vim within Zellij">}}

Zellij allows you to open any pane's scrollback buffer directly in your `$EDITOR`:

- Press `Ctrl s` + `e` to edit the current pane's scrollback
- Use your favorite editor (vim, emacs, neovim, etc.)
- Save output to files for sharing or documentation
- Search, manipulate, and copy terminal output with full editor capabilities

This feature transforms terminal output from ephemeral text into something you can work with using your full editor toolkit.

## Multiple Pane Select

{{<figure src="/img/multiple-select-demo.gif" alt="Selecting three panes with the mouse and stacking them with the multiple select tool">}}

Perform bulk operations on multiple panes at once:

- Select panes with `Alt` + `left-click` (hold and drag to select multiple)
- Close multiple panes at once
- Break panes to new tabs in bulk
- Stack selected panes together
- Move focus through selected panes

The multiple pane select dialog appears automatically when panes are selected, showing available actions. This is perfect for reorganizing your workspace or cleaning up many panes quickly.

## Getting Started

Ready to try these features?

- [Try Zellij without installing](/documentation/installation.html#try-zellij-without-installing) using the web client
- [Watch screencasts and tutorials](/screencasts) to see features in action
- [Read the documentation](/documentation) for comprehensive guides
- [Check out the roadmap](/roadmap) to see what's coming next

Zellij will always be free and open-source. If you find it valuable, consider [supporting development](https://github.com/sponsors/imsnif).
