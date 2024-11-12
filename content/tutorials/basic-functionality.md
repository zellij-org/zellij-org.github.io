---
title: "Basic Development with Zellij"
images: ["/img/tutorial-1-preview.png"]
description: "How to use Zellij as a powerful engine for terminal development"
linktitle: "How to use Zellij as a powerful engine for terminal development"
---
{{<video-left-aligned "/video/basic-development-screencast.mp4">}}

This tutorial demonstrates some basic features of Zellij through a real world use-case of using the terminal for development.

You need not be a terminal developer to benefit from this tutorial.

*The video screencast and the tutorial contain the same content.*

## What we'll cover
- [Opening New Panes](#opening-new-panes)
- [Using Floating Panes](#using-floating-panes)
- [Starting Command Panes from the CLI](#starting-command-panes-from-the-cli)
- [Editing Pane Scrollback with your own $EDITOR](#editing-the-scrollback-with-your-own-editor)
- [Do you like Zellij?](#do-you-like-zellij-)

## Getting Started
{{<figure src="/img/tutorial-1-getting-started.png" class="center" style="max-width 995px;" alt="An image of Zellij running inside a terminal with vim open to the main.rs file of the project.">}}
We'll use a basic Rust project as an example, but it can work with any sort of code. To follow along, you can clone [the repository](https://github.com/imsnif/zellij-screencast-1).

After [installing Zellij](/documentation/installation.html), let's start it up in the project's directory.

Then let's open up `vim` to the main file in the repository: `vim src/main.rs`

## Opening New Panes
{{<figure src="/img/tutorial-1-opening-new-panes.png" class="center" style="max-width 995px;" alt="An image of Zellij with three panes, one open to main.rs, one running cargo run and the third running cargo test">}}
The most basic functionality of Zellij is opening up different terminal panes in the same tab. Let's open up some and run different commands in each.

First we split the terminal down so that we can run our code: `Ctrl p` + `d` then `cargo run` in the new pane.

Next, let us open another pane to run tests: `Alt n` will open a new pane in the largest available space. `cargo test` inside this new pane will run our tests.

## Using Floating Panes
{{<figure src="/img/tutorial-1-using-floating-panes.png" class="center" style="max-width 995px;" alt="An image of Zellij with a floating pane running cargo test">}}
Floating panes can be a powerful tool for toggling context. Running tests inside them is a classic use-case.

Let's make our existing "tests" pane floating by ejecting it with: `Ctrl p` + `e`

Now that it is floating, we can toggle its visibility and focus: `Ctrl p` + `w` to hide, and `Ctrl p` + `w` again to show.

*Tip:* When toggling floating panes with `Ctrl p` + `w`, if none exist one will be opened.

*Another tip:* When floating panes are visible, you can open new ones with `Alt n`, move existing ones with the mouse or use all Zellij keyboard shortcuts on them as you would with regular "tiled" panes.

## Starting Command Panes from the CLI
{{<figure src="/img/tutorial-1-command-panes.png" class="center" style="max-width 995px;" alt="An image of Zellij with two floating panes, the front one running cargo test and showing its exit status and extra controls on screen">}}
Instead of retyping, pressing the up arrow or searching our history for a particular command - we can have it waiting for us in a command pane.

From the CLI, we use the `zrf` [alias](https://zellij.dev/documentation/controlling-zellij-through-cli.html#completions) (zellij run floating) to run the `cargo test` command as a floating command pane:
```bash
$ zrf cargo test
```
We see the exit status of the pane, can scroll / search through its output normally and can re-run it by pressing `<ENTER>`

## Editing the Scrollback with your own $EDITOR
{{<figure src="/img/tutorial-1-editing-scrollback.png" class="center" style="max-width 995px;" alt="An image of Zellij with a pane open to the vim editor editing its own scrollback">}}
Zellij allows you to open a pane's existing scrollback with your own `$EDITOR` eg. vim. Let's try it out.

To get some output, let's change the `main` function in `main.rs` to:
```rust
fn main() {
    why_would_i_want_this();
}
```
Now let's move focus to the bottom pane either by clicking it with the mouse, with `Alt j` or with `Alt <down-arrow>`.

We run the program with `cargo run` and see all the output on screen.

Now, let's press `Ctrl s` + `e` and the output is opened up in our editor (vim in the author's case). When using vim, we can issue the following command to delete all lines that don't contain the word "error": `:%g!/error/d`.

Then, let's save the resulting lines to a different file (in vim: `:w /tmp/my-other-file.md`) and we can send it to a friend or do whatever we like with it.

## Finally
Here we learned the very basics of Zellij usage. Be they classic multiplexer features such as splitting panes or slightly more advanced workspace features such as managing Command Panes and editing scrollback.

## Do you like Zellij? ❤️
Me too. So much so that I spend 100% of my time developing and maintaining it and have no other income.

Zellij will always be free and open-source. Zellij will never contain ads or collect your data.

If the tool gives you value and you are able, please consider [a recurring monthly donation](https://github.com/sponsors/imsnif) of 5-10$ to help me pay my bills. There are Zellij stickers in it for you!
