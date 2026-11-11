# Inbox Integrations

Zellij's [Inbox](./inbox.md) shows which panes need you, which are working, and which have finished or failed. This page covers what Zellij picks up with no setup, which programs report their status to it, and how to connect the ones that don't.

Last checked: 9 November 2026. Programs are adding support quickly, so newer versions than those listed may already work.

## What works with no setup

Zellij watches every pane for these signals:

| Signal | What the Inbox shows |
|---|---|
| [OSC 7501](./inbox.md#osc-7501) program status | Exactly what the program reports: idle, working, done, needs you (approval, a question, or a login) or failed, plus its message and progress |
| Terminal bell | Needs you |
| Desktop notifications (OSC 9, OSC 777, kitty's OSC 99) | Needs you, with the notification text |
| Shell prompt markers (OSC 133, or VS Code's OSC 633) | A command finished or failed, using its exit code |
| A command pane exiting | Failed on a non-zero exit code or a signal; otherwise done, if it ran for at least `done_threshold_secs` or the pane is watched |
| A command running longer than `done_threshold_secs` | Working, then done when it finishes |
| Busy output going quiet | Quiet; in a watched pane, needs you |
| Output arriving while you look elsewhere | New output |

Full-screen programs such as `vim`, `less` and `htop`, and commands you are typing into, are not reported as working or done.

## Coding agents

### Agents that report their status (OSC 7501)

These agents tell Zellij directly whether they are working, waiting for you or finished. Nothing needs to be turned on.

| Agent | First version | Works inside Zellij | How to turn it off |
|---|---|---|---|
| Claude Code | 2.1.295 | Yes | `CLAUDE_CODE_DISABLE_TERMINAL_TITLE=1` |
| Codex CLI | 0.163.0 | Yes. 0.164.0 adds done, failed, and what it is waiting for | None |
| Pi | 1.1.0 | Yes | `PI_PROGRAM_STATUS=0` |
| Crush | 0.98.0 | Yes | None |
| OpenCode | 2.1.0 | Yes. Reports working, waiting and idle, but not done or failed. The 1.x releases do not report | None |
| GitHub Copilot CLI | 1.0.106 | Yes | None |
| Qwen Code | 0.26.9 | Yes | None |
| goose | 1.56.0 | Yes, in its text interface | `GOOSE_CLI_PROGRAM_STATUS=false` |
| Factory Droid | CLI 0.236.0 | Yes | None |
| Atomic | 0.9.28 | Yes | `PI_PROGRAM_STATUS=0` |
| Kimi Code | 2.4.0 | Only with `PI_PROGRAM_STATUS=1`. By default it turns reporting off inside Zellij, tmux and screen | `PI_PROGRAM_STATUS=0` |
| Antigravity CLI | 1.4.0 | Reported, not yet confirmed | `AGY_CLI_OSC7501=off` |
| Amp | Build of 7 October 2026 | Reported, not yet confirmed | None |
| Kiro CLI | 2.32.0 | Reported, not yet confirmed | `KIRO_NO_PROGRAM_STATUS=1` |

To make Kimi Code report inside Zellij, add this to your shell's startup file:

```sh
export PI_PROGRAM_STATUS=1
```

### Agents that don't report their status yet

These agents can still reach the Inbox through desktop notifications or the terminal bell. Zellij shows them as needing you, but cannot tell when they are working or done.

| Agent | What to turn on |
|---|---|
| Gemini CLI | Set `general.enableNotifications` to `true` in its settings. Support for OSC 7501 is requested in [gemini-cli#29710](https://github.com/google-gemini/gemini-cli/issues/29710) |
| Cursor CLI | Turn on notifications in its settings |
| Aider | Run with `--notifications` |
| OpenCode 1.x | Upgrade to 2.1.0 or later |

Codex, Crush and Qwen Code also send notifications or a bell alongside their status. Zellij uses both.

## Other programs that report their status

| Program | First version |
|---|---|
| Hugo | 0.168.0 |
| tuist | 4.213.0 |
| Buildkite CLI | 3.64.0 |
| Buildkite Agent | 4.8.0, behind an experiment flag |
| git-stack | 0.2.0 |
| Composer | 2.11.0-RC1 (pre-release) |

Support has been requested for cargo, Gradle, MSBuild, Nix, docker compose and Neovim.

Libraries for adding it to your own programs exist for Rust, Go (including Bubble Tea 2.1.0 and `charmbracelet/x/ansi`), Python (`osc7501` on PyPI), Node (OpenTUI 0.6.3) and Swift.

## Your own scripts

Any script can report its status with one `printf`. Text in `msg` must be base64-encoded:

```sh
status() {
  printf '\e]7501;state=%s:msg=%s\e\\' "$1" "$(printf '%s' "$2" | base64 | tr -d '\n')"
}

status working "Syncing photos"
rsync -a ~/Photos backup:/photos && status done "Photos synced" || status error "rsync failed"
```

The states are `idle`, `working`, `done`, `blocked` and `error`. `state=clear` removes the status. Other optional keys:

| Key | Meaning |
|---|---|
| `kind` | What a `blocked` program needs: `permission`, `question` or `auth` |
| `progress` | A percentage from 0 to 100, for `working` and `blocked` |
| `app` | A short program name, such as `rsync` |
| `id` | Reports several tasks at once, for example `id=deploy/eu-west` |
| `title` | A short base64-encoded label |

Terminals that do not understand the sequence ignore it, so the function is safe to keep in scripts that run elsewhere.

If a script is run in a command pane, Zellij already reports it as failed when it exits with an error, and as done when it ran for at least `done_threshold_secs` (or the pane is watched), without any changes.

## Shell commands

For Zellij to see when each command at your prompt finishes and whether it failed, your shell has to send prompt markers (OSC 133 or OSC 633). Zellij does not install these for you. Many prompts and shell integration scripts already send them; check your shell's or prompt's documentation, and see [Shell Integration](./shell-integration.md).

Without prompt markers, Zellij falls back to watching which program is running in the pane. It can still tell a long command is working and when it ends, but not whether it succeeded.

## Passing status to your terminal

When Zellij runs inside a terminal that understands OSC 7501, it passes on the status of the pane that most needs you, so the terminal can show it in its own tab or notifications.

Turn this off with [`host_status false`](./inbox.md#host_status) in the `attention` block.

## Settings

All of this is configured in the [`attention` block](./inbox.md#configuration) of your config file. The commented defaults are in the [default config](https://github.com/zellij-org/zellij/blob/main/zellij-utils/assets/config/default.kdl). The settings most relevant here:

```kdl
attention {
    enabled true
    host_status true
    done_threshold_secs 10
    track_commands true
    idle_rule "all"
}
```

- [`enabled`](./inbox.md#enabled): turn the whole system off with `false`.
- [`host_status`](./inbox.md#host_status): pass status to the outer terminal.
- [`done_threshold_secs`](./inbox.md#done_threshold_secs): how long a command must run before it counts as working and is reported when done.
- [`track_commands`](./inbox.md#track_commands): list long-running commands as working.
- [`idle_rule`](./inbox.md#idle_rule): notice output going quiet in `"all"` panes, or only `"watched"` ones.

Individual panes can also be watched (report everything) from the right-click menu or pane mode, and panes, tabs and sessions can be muted (report nothing) from pane, tab and session mode (panes and tabs also from the right-click menu). See [Watching, ignoring and muting](./inbox.md#watching-ignoring-and-muting).
