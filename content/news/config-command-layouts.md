---
author: "Aram Drevekenin"
authorlink: "https://twitter.com/im_snif"
date: 2022-10-24
linktitle: "Zellij 0.32.0: YAML => KDL, Control Zellij through the CLI, Command Panes and a new Layout System"
type:
- post
- posts
title: "Zellij 0.32.0: YAML => KDL, Control Zellij through the CLI, Command Panes and a new Layout System"
images: ["/img/floating-panes-preview.png"]
description: "We just released a significant version of Zellij with lots of highly anticipated features!"
alttext: "An image of the Zellij terminal multiplexer"
weight: 10
---

We just release [Zellij 0.32.0](https://github.com/zellij-org/zellij/releases/tag/v0.32.0) with lots of exciting features and improvements.

In this version, we emphasized features geared toward advanced users. We feel Zellij already provides a great experience to users new to terminal multiplexers, and would now like to make configuring and personalizing the tool easier. We want to grant power users the ability to better harness their terminal workspace, expressing their imagination and sharing their findings with the community.

You can go right ahead and [install it](https://github.com/zellij-org/zellij#how-do-i-install-it) or read on for more details.

### YAML => KDL
![kdl file preview](/img/kdl-file-preview.png)

This coming version moves all of the Zellij configuration from `YAML` to [`KDL`](https://kdl.dev).

Existing configuration and layout files will be automatically converted, with the originals unmodified. The conversion can [also be done manually](/documentation/migrating-yaml-config.html).

Read more about the new configuration [here](/documentation/configuration.html).

Curious how we chose KDL? [Read about it below](#addendum-why-did-we-choose-kdl)

### Command Panes
{{< video "/video/zellij-run-demo.mp4" >}}

This release introduces Command Panes. These are terminal panes that run a specific command. When the command exits, they stay open, allowing the user to:
- See the `Exit Code`
- Re-run the command with `ENTER`
- Close the pane with `Ctrl-c`

These panes can be moved, resized, de-focused, floated or embedded like any other terminal pane.

We believe this is a powerful new way to interact with the terminal.

Command panes play a role in both the [layout system](#new-layout-system) and as shown above in [Zellij Run](#zellij-run).

### Control Zellij through the CLI
A long requested feature of Zellij has been the ability to script it and generally control the tool through the command-line.

This release introduces this ability fully in [Zellij Actions](#zellij-action) as well as providing top-level conveniences in [Zellij Run](#zellij-run) and [Zellij Edit](#zellij-edit).

#### Zellij Run
```
# Out of the box
$ zellij run -- git diff

# With a convenient alias for your shell
$ zr git diff
```
Zellij run lets users run a new command from the command line in a [Command Pane](#command-panes).

For more information and options see [the Zellij Run documentation](/documentation/zellij-run.html).

For the alias, see [Zellij CLI completions](/documentation/controlling-zellij-through-cli.html#completions).

#### Zellij Edit
```
# Out of the box
$ zellij edit my-file.rs

# With a convenient alias for your shell
$ ze my-file.rs
```
Zellij edit lets users open a new pane with their default editor (eg. `vim`) pointed at the provided file.

For more information see [the Zellij Edit documentation](/documentation/zellij-edit.html).

For the alias, see [Zellij CLI completions](/documentation/controlling-zellij-through-cli.html#completions).
#### Zellij Action
```
$ zellij action switch-mode locked

$ zellij action rename-pane TESTS
```

Zellij action is the CLI entry-point for Zellij. It provides an extensive list of actions that can be performed on the current or other sessions.

Anything from locking the interface to opening a new tab with a specified layout.

For more information, see [Controlling Zellij through the CLI](/documentation/controlling-zellij-through-cli.html).


### New Layout System
While converting our old layout system to use `KDL`, we decided to both simplify it and make it more powerful.

We would like Zellij layouts to be part of a command-line user's toolbox. Allowing them to be used as quick shortcuts to dynamically open a predefined set of panes with [commands](#command-panes) and CWDs, defined and adjusted on the fly and shared in dotfile repositories.

The new layout system also includes entirely new capabilities such as `pane_templates`, `tab_templates` and `cwd` composition to allow for more dynamic layouts.

#### Example Layout

```javascript
layout {
    pane split_direction="vertical" size="60%" {
        pane edit="src/main.rs"
        pane edit="Cargo.toml"
    }
    pane split_direction="vertical" size="40%" {
        pane command="cargo" {
            args "run"
            focus true
        }
        pane command="cargo" {
            args "test"
        }
    }
}
```

Opening this layout in a [new-tab](/documentation/cli-actions.html#new-tab) in a Rust boilerplate project can look like this:
```bash
$ zellij action new-tab --layout /path/to/above/layout-file.kdl
```

![basic-rust-project-layout-example](/documentation/img/basic-rust-project-layout.png)

See [more examples](/documentation/layout-examples.html) or [read more](http://localhost:1313/documentation/layouts.html) about layouts.

Did you make a cool and/or useful Zellij layout? Please [tweet it at us](https://twitter.com/Zellij_dev) or post it in our [Reddit](https://www.reddit.com/r/zellij/).

### What else?
Throughout October, Zellij participated in [Hacktoberfest](https://hacktoberfest.com/). We emphasized contributions to improve our Error Handling story, contributing both to the stability of Zellij and to better communicating error causes and remedies to users.

We heartily thank all of our community contributors.

### What's next for Zellij?
In the coming months, we're going to overhaul Zellij's plugin system. We have unfortunately not been able to devote to it the attention it deserves ever since Zellij has been released due to maintainer availability. This will soon change. Look out for more info on it in the near future.

### Addendum: Why did we choose KDL?
#### Why not YAML?
Much has been said about [the downsides of YAML](https://www.arp242.net/yaml-config.html), for us it boiled down to:
1. *Indentation being meaningful* - configuration files, and especially [layouts](#new-layout-system) can get very large. Changing an arbitrary part in the middle of 100s or 1000s of lines becomes a challenge and often, in the context of build-systems and production use, a source of anxiety. We want our users to love using our configuration language, not fear it.
2. *Copying and Pasting parts from other sources can be disastrous* - The Zellij configuration and layout system benefits from re-use and tricks [learned from the community](https://twitter.com/Zellij_dev). These snippets, when copy/pasted, can do [unexpected things](https://www.tutorialspoint.com/yaml/yaml_indentation_and_separation.htm) in different contexts depending on their indentation amount or even type.

#### Why KDL?
When looking at configuration languages, we ended up considering either `TOML` or `KDL`. The former, while being excellent and fairly popular, doesn't make nesting very easy. Since our [`layouts`](#new-layout-system) make heavy use of nesting, this was a deal-breaker for us.

While working with `KDL`, we found its easy-to-pick-up syntax pleasant both to write and to read - even when dealing with large files. And while there are downsides, the great ecosystem around `KDL` for Rust allowed us to incorporate some really helpful and verbose errors to help guide users in creating configuration and layout files.

![kdl error demo](/img/kdl-error-demo.png)
