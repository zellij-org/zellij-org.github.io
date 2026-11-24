# Zellij Events

Since `0.46.1`, Zellij provides a top-level `events` command that prints what happens in a session as it happens: panes and tabs opening, closing, being focused, renamed or moved, input mode changes, clients attaching and detaching, and the session being renamed or ending. Each event is printed as one JSON object per line, which makes it easy to react to changes from a script or to drive an external status bar.

To stream the contents of panes rather than changes to the session, see [Zellij Subscribe](./zellij-subscribe.md).

---

- [Usage](#usage) - Command syntax
- [Options](#options) - Available flags and parameters
- [Filtering](#filtering) - Choosing which events are printed
- [Output](#output) - The format of each line
- [Events](#events) - Every event and its fields
- [Exit Codes](#exit-codes) - How the command ends
- [Listening to a Different Session](#listening-to-a-different-session) - Background or other sessions
- [Examples](#examples) - Common usage patterns with `jq`

---

## Usage

```
zellij [--session <SESSION_NAME>] events [OPTIONS]
```

When run inside a Zellij pane, the events of that pane's session are printed. Outside of Zellij, the only running session is used, or the session given with `--session` (which must come before `events`).

The command keeps running until the session ends or it is stopped (eg. with `Ctrl c`).

## Options

```
-t, --type <TYPE>...       Only print events of these types (eg. --type pane_focused tab_created)
-p, --pane-id <PANE_ID>... Only print events about these panes. Accepts terminal_N, plugin_N,
                           or bare integer N (equivalent to terminal_N)
    --tab-id <TAB_ID>...   Only print events about these tabs or the panes in them (tab ids,
                           as shown by `zellij action list-tabs`)
    --no-initial-state     Do not print the initial_state event when the command starts
```

Each option takes one or more values, and can be given more than once.

## Filtering

- `--type` keeps only the listed event types.
- `--pane-id` and `--tab-id` keep only the events about the listed panes, the listed tabs, or the panes in the listed tabs. An event matches if it is about any of them.
- When `--type` is combined with `--pane-id` or `--tab-id`, an event must match both.
- Events that are not about a pane or a tab (`mode_changed`, `client_attached`, `client_detached`, `session_renamed` and `session_ending`) are not removed by `--pane-id` or `--tab-id`.
- `pane_moved` matches the tab the pane moved from and the tab it moved to.
- With `--pane-id` or `--tab-id`, the `initial_state` event only lists the matching panes and their tabs.

## Output

Every line is a JSON object whose `event` key holds the event name:

```json
{"event":"tab_focused","client_id":1,"tab_id":1,"previous_tab_id":0}
```

- Pane ids are strings, eg. `"terminal_1"` or `"plugin_2"`.
- Tab ids are numbers that stay the same when tabs are moved, the same ids shown by `zellij action list-tabs`. The place of a tab in the tab bar is its `position`, starting at `0`.
- `client_id` is a number identifying a connected user (see `zellij action list-clients`). Events about focus and input modes are reported separately for each connected user.
- Input modes are lowercase names, eg. `normal`, `locked`, `pane`, `tab`, `resize`, `scroll`, `search`, `entersearch`, `renametab`, `renamepane`, `renamesession`, `session`, `move`, `prompt` or `tmux`.
- Fields that have no value are `null`.

## Events

### initial_state

Printed first, describing the session at the moment the command starts. It is printed whatever `--type` is given, unless `--no-initial-state` is used.

```json
{"event":"initial_state","session_name":"my-session","tabs":[...],"panes":[...],"clients":[...]}
```

| Field | Description |
|-------|-------------|
| `session_name` | Name of the session |
| `tabs` | List of [tabs](#tab), in tab bar order |
| `panes` | List of [panes](#pane), including plugin panes such as the tab bar |
| `clients` | List of [clients](#client) |

#### Tab

```json
{"tab_id":0,"position":0,"name":"Tab #1","is_fullscreen_active":false,"is_sync_panes_active":false,"are_floating_panes_visible":false}
```

| Field | Description |
|-------|-------------|
| `tab_id` | Id of the tab |
| `position` | Place of the tab in the tab bar, starting at `0` |
| `name` | Name of the tab |
| `is_fullscreen_active` | Whether a pane in the tab is fullscreen |
| `is_sync_panes_active` | Whether input is sent to all panes of the tab |
| `are_floating_panes_visible` | Whether the floating panes of the tab are shown |

#### Pane

```json
{"pane_id":"terminal_1","tab_id":0,"title":"~/project","is_plugin":false,"is_floating":false,"is_fullscreen":false,"is_suppressed":false,"is_selectable":true,"exited":false,"exit_status":null,"terminal_command":null,"plugin_url":null}
```

| Field | Description |
|-------|-------------|
| `pane_id` | Id of the pane |
| `tab_id` | Id of the tab the pane is in |
| `title` | Title of the pane |
| `is_plugin` | Whether the pane is a plugin |
| `is_floating` | Whether the pane is floating |
| `is_fullscreen` | Whether the pane is fullscreen |
| `is_suppressed` | Whether the pane is hidden behind another pane (eg. a pane replaced with `--in-place`) |
| `is_selectable` | Whether the pane can be focused (`false` for bars such as the tab bar and status bar) |
| `exited` | Whether the command of a command pane has exited |
| `exit_status` | Exit status of that command, if known |
| `terminal_command` | The command and arguments of a command pane |
| `plugin_url` | The location of a plugin pane, eg. `zellij:tab-bar` |

#### Client

```json
{"client_id":1,"is_web_client":false,"tab_id":0,"pane_id":"terminal_1","mode":"normal"}
```

| Field | Description |
|-------|-------------|
| `client_id` | Id of the client |
| `is_web_client` | Whether the client is connected through the [web client](./web-client.md) |
| `tab_id` | Id of the tab the client is on |
| `pane_id` | Id of the pane the client has focused |
| `mode` | The client's input mode |

### Pane events

| Event | When | Fields |
|-------|------|--------|
| `pane_opened` | A pane is opened | `pane` (a [pane](#pane)) |
| `pane_closed` | A pane is closed | `pane_id`, `tab_id` |
| `pane_focused` | A client focuses a pane | `client_id`, `pane_id`, `tab_id`, `previous_pane_id` |
| `pane_renamed` | The title of a pane changes, either because it was renamed or because the program in it set its title | `pane_id`, `tab_id`, `title`, `previous_title` |
| `pane_moved` | A pane is moved to another tab | `pane_id`, `tab_id`, `previous_tab_id` |
| `pane_floating_changed` | A pane becomes floating or tiled | `pane_id`, `tab_id`, `is_floating` |
| `pane_fullscreen_changed` | A pane enters or leaves fullscreen | `pane_id`, `tab_id`, `is_fullscreen` |
| `pane_exited` | The command of a [command pane](./zellij-run-and-edit.md) exits and the pane stays open | `pane_id`, `tab_id`, `exit_status` |
| `pane_cwd_changed` | The working directory of a terminal pane changes | `pane_id`, `tab_id`, `cwd` |
| `pane_command_changed` | The program running in the foreground of a terminal pane changes | `pane_id`, `tab_id`, `command`, `is_foreground` |

In `pane_command_changed`, `command` is the program and its arguments as a list of strings (eg. `["vim","notes.md"]`). When the pane goes back to its shell, `is_foreground` is `false` and `command` is the shell.

`previous_pane_id` and `exit_status` can be `null`, as can `tab_id` in `pane_closed`, `pane_cwd_changed` and `pane_command_changed`.

```json
{"event":"pane_opened","pane":{"pane_id":"terminal_2","tab_id":0,"title":"Pane #2","is_plugin":false,"is_floating":false,"is_fullscreen":false,"is_suppressed":false,"is_selectable":true,"exited":false,"exit_status":null,"terminal_command":null,"plugin_url":null}}
{"event":"pane_focused","client_id":1,"pane_id":"terminal_2","tab_id":0,"previous_pane_id":"terminal_1"}
{"event":"pane_renamed","pane_id":"terminal_2","tab_id":0,"title":"logs","previous_title":"Pane #2"}
{"event":"pane_cwd_changed","pane_id":"terminal_2","tab_id":0,"cwd":"/home/me/project"}
{"event":"pane_command_changed","pane_id":"terminal_2","tab_id":0,"command":["vim","notes.md"],"is_foreground":true}
{"event":"pane_exited","pane_id":"terminal_3","tab_id":0,"exit_status":1}
{"event":"pane_closed","pane_id":"terminal_2","tab_id":0}
```

### Tab events

| Event | When | Fields |
|-------|------|--------|
| `tab_created` | A tab is opened | `tab` (a [tab](#tab)) |
| `tab_closed` | A tab is closed | `tab_id`, `name` |
| `tab_renamed` | A tab is renamed | `tab_id`, `name`, `previous_name` |
| `tab_moved` | A tab is moved to another place in the tab bar | `tab_id`, `position`, `previous_position` |
| `tab_focused` | A client switches to a tab | `client_id`, `tab_id`, `previous_tab_id` |

`previous_tab_id` can be `null`. When a tab is closed, a `pane_closed` event is printed for each of its panes before `tab_closed`.

```json
{"event":"tab_created","tab":{"tab_id":1,"position":1,"name":"Tab #2","is_fullscreen_active":false,"is_sync_panes_active":false,"are_floating_panes_visible":false}}
{"event":"tab_focused","client_id":1,"tab_id":1,"previous_tab_id":0}
{"event":"tab_renamed","tab_id":1,"name":"build","previous_name":"Tab #2"}
{"event":"tab_moved","tab_id":1,"position":0,"previous_position":1}
{"event":"tab_closed","tab_id":1,"name":"build"}
```

### Mode, client and session events

| Event | When | Fields |
|-------|------|--------|
| `mode_changed` | A client's input mode changes | `client_id`, `mode`, `previous_mode` |
| `client_attached` | A user attaches to the session | `client_id`, `is_web_client` |
| `client_detached` | A user detaches from the session | `client_id` |
| `session_renamed` | The session is renamed | `name`, `previous_name` |
| `session_ending` | The session is ending. This is always the last line printed | none |

`previous_mode` can be `null`. When a user attaches, `client_attached` is followed by `tab_focused`, `pane_focused` and `mode_changed` events for that user.

```json
{"event":"mode_changed","client_id":1,"mode":"locked","previous_mode":"normal"}
{"event":"client_attached","client_id":3,"is_web_client":false}
{"event":"client_detached","client_id":3}
{"event":"session_renamed","name":"work","previous_name":"my-session"}
{"event":"session_ending"}
```

## Exit Codes

| Exit code | Meaning |
|-----------|---------|
| `0` | The session ended, or the output was closed (eg. the program reading it exited) |
| `1` | No session was found, eg. no session is running, the `--session` given does not exist, or several sessions are running and none was chosen |
| `2` | An error, eg. a wrong flag or event type, an invalid pane id, or a session running a version of Zellij that does not support `events` |

## Listening to a Different Session

To listen to a session other than the current one, use the global `--session` flag:

```
$ zellij --session my-background-session events
```

This is especially useful when combined with [background sessions](./cli-recipes.md#starting-and-controlling-background-sessions).

## Examples

Print every event of the current session:
```
$ zellij events
```

Print only focus changes, without the initial state:
```
$ zellij events --type pane_focused tab_focused --no-initial-state
```

Follow a single pane:
```
$ zellij events --pane-id terminal_1
```

Follow everything that happens in a tab:
```
$ zellij events --tab-id 2
```

Print the name of each tab as it is opened:
```
$ zellij events --type tab_created --no-initial-state | jq --unbuffered -r '.tab.name'
```

Wait for a command pane to finish and print its exit status:
```
$ read -r status < <(zellij events --type pane_exited --pane-id terminal_3 --no-initial-state | jq --unbuffered -r '.exit_status')
$ echo "$status"
```

Show a notice whenever a command pane fails:
```
$ zellij events --type pane_exited --no-initial-state \
    | jq --unbuffered -r 'select(.exit_status != 0) | .pane_id' \
    | while read -r pane; do zellij prompt notify "$pane failed"; done
```

Print the current input mode, for an external status bar:
```
$ zellij events --type mode_changed --no-initial-state | jq --unbuffered -r '.mode'
```

Print the folder a pane is in each time it changes:
```
$ zellij events --type pane_cwd_changed --pane-id terminal_1 --no-initial-state | jq --unbuffered -r '.cwd'
```
