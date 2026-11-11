# Shell Integration (OSC 133 and OSC 633)

Since version `0.45.0`, Zellij understands the OSC 133 "semantic prompt" escape sequences. When the shell running in a pane emits them, Zellij knows where each prompt starts, where the command that was typed begins and ends, where its output begins and ends, and what exit status it had. It also understands the `OSC 633` sequences used by the VS Code shell integration, and the sequences shells use to report their working directory.

There is nothing to configure on the Zellij side: the marks are parsed whenever the shell emits them.

## Getting the shell to emit OSC 133

The sequences Zellij looks for are:

| Sequence | Meaning |
|---|---|
| `OSC 133 ; A` or `OSC 133 ; N` | Start of the prompt |
| `OSC 133 ; P` | Start of the prompt (with properties) |
| `OSC 133 ; L` | Start of a fresh line |
| `OSC 133 ; B` | End of the prompt / start of the typed command |
| `OSC 133 ; I` | Start of the typed command |
| `OSC 133 ; C` | Start of the command output |
| `OSC 133 ; D ; <exit-status>` | End of the command, with its exit status |

Zellij also reads these options:

- `k=i`, `k=c`, `k=s` or `k=r` on a prompt mark tells the main prompt (`i`) apart from continuation (`c`), secondary (`s`) and right (`r`) prompts. Only a main prompt counts as the shell returning to its prompt.
- `cmdline=<text>` (quoted the way `printf %q` does) or `cmdline_url=<percent-encoded text>` on `OSC 133 ; C` gives the text of the command that is starting.
- `err=<value>` on `OSC 133 ; D`: a non-empty value marks the command as failed, whatever its exit status.

`fish` emits these by default. `bash` and `zsh` need a shell integration snippet - the ones distributed for other terminals (eg. kitty, WezTerm) emit the same standard sequences and work with Zellij as well.

## OSC 633 (VS Code shell integration)

The sequences emitted by the VS Code shell integration scripts are understood as well, and work the same way as their `OSC 133` counterparts:

| Sequence | Meaning |
|---|---|
| `OSC 633 ; A` | Start of the prompt |
| `OSC 633 ; B` | End of the prompt / start of the typed command |
| `OSC 633 ; C` | Start of the command output |
| `OSC 633 ; D ; <exit-status>` | End of the command, with its exit status |
| `OSC 633 ; E ; <command>` | The text of the command |
| `OSC 633 ; P ; Cwd=<path>` | The current working directory |

## Working directory reports

Zellij follows the working directory reported by the shell through any of these sequences:

| Sequence | Used by |
|---|---|
| `OSC 7 ; file://<host>/<path>` | Most terminals and shells |
| `OSC 633 ; P ; Cwd=<path>` | VS Code shell integration |
| `OSC 1337 ; CurrentDir=<path>` (with `OSC 1337 ; RemoteHost=<user>@<host>`) | iTerm2 shell integration |
| `OSC 9 ; 9 ; <path>` | ConEmu and Windows Terminal |

A directory on the local machine becomes the pane's working directory: new panes opened from it start there, and it is kept when the session is [resurrected](./session-resurrection.md). Directories on another host (eg. reported over `ssh`) or on a network path do not change the pane's working directory. The `OSC 7` of the focused pane is also passed on to the terminal Zellij runs in (see [compatibility](./compatibility.md#working-directory-osc-7)).

## What it enables

### Selecting a command and its output

Triple-clicking inside output that was marked with OSC 133 selects the whole command along with its output, rather than the logical line under the cursor. This can be turned off with the [`osc133_command_selection`](./options.md#osc133_command_selection) option (it is on by default), in which case triple-click selects the logical line as before.

The same can be done from the keyboard with the [`SelectCommandAtScrollPosition`](./keybindings-possible-actions.md#selectcommandatscrollposition) action (bound to `m` in `scroll` and `search` modes), which selects the command and output at the current scroll position.

### Navigating the scrollback by prompt

Instead of scrolling line by line, the scrollback can be jumped through prompt by prompt:

| Action | Default binding |
|---|---|
| [`ScrollToPreviousPrompt`](./keybindings-possible-actions.md#scrolltopreviousprompt) | `[` in `scroll` and `search` modes |
| [`ScrollToNextPrompt`](./keybindings-possible-actions.md#scrolltonextprompt) | `]` in `scroll` and `search` modes |

The mouse wheel can do the same while holding `Alt`: `Alt` + scroll up jumps to the previous prompt and `Alt` + scroll down to the next one (the `ScrollToPrompt` [mouse binding](./mouse-bindings.md)).

### Copying the output of the last command

The [`CopyLastCommandOutput`](./keybindings-possible-actions.md#copylastcommandoutput) action (bound to `c` in `scroll` mode) copies the output of the last command run in the focused pane to the clipboard, using the OSC 133 marks to find its boundaries. The copied region is briefly flashed in the pane.

Since the marks include the exit status of each command, Zellij is also able to indicate which commands failed (eg. in the titles of collapsed panes in a stack).

### Finished and failed commands in the inbox

The marks also tell Zellij when a command starts and ends, so it can report it in the [inbox](./inbox.md), on the pane's frame and in the tab bar: a command that fails, or one that succeeds after running longer than `done_threshold_secs` (10 seconds by default), is listed together with the text of the command. A command that runs longer than that is shown as working until it ends (full-screen programs such as `vim` or `htop`, and commands that are typed into, are left out). This is configured in the [`attention`](./inbox.md#configuration) block (`track_commands`, `done_threshold_secs`).

## Word selection

Not strictly part of OSC 133, but related to selecting text: the characters that terminate a word when double-clicking can be configured with the [`word_separators`](./options.md#word_separators) option. Whitespace always separates words. The default is:

```javascript
word_separators "[]{}<>()"
```
