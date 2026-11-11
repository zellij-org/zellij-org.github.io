# Nested Sessions

Since version `0.45.0`, running Zellij inside a Zellij pane (for example after `ssh`-ing into a remote machine and starting Zellij there) is a first-class workflow.

The inner session (the **guest**) announces itself to the outer session (the **host**) through an in-band protocol: messages sent within the pane's own output, so they also pass through `ssh`. Every Zellij client sends this announcement when it starts, and sends it again if it has not heard back from a host, so a guest is found even when environment variables such as `ZELLIJ` are not passed along (as is usual over `ssh`). The announcement is a `DCS` escape sequence, which terminals other than Zellij ignore.

**Note:** attaching to a session from inside itself is still not possible, and remains blocked.

## What happens when focusing a nested session

The behavior of the host session when its user focuses a pane containing a guest session is controlled by the [`nested_session_handling`](./options.md#nested_session_handling) configuration option:

| Value | Behavior |
|---|---|
| `ask` (default) | A prompt is displayed when focusing the pane, offering either to zoom into the nested session or to take control of it |
| `fullscreen` | The pane containing the nested session is always zoomed into on focus |
| `descend` | Input is always routed to the nested session on focus |
| `never` | Nothing happens automatically |

```javascript
nested_session_handling "descend"
```

## Descending and ascending

When "descending" into a guest session, keyboard and mouse input are routed to the guest rather than being handled by the host. To make this obvious, the host's own chrome (its tab-bar, status-bar and pane frames) is dimmed while descended.

To go back up to the host session ("ascend"), either click on the dimmed host chrome or use the host's keybinding for it.

The relevant actions, all bindable in the [`keybinds`](./keybindings.md) block:

| Action | Default binding | Behavior |
|---|---|---|
| [`FocusGuestSession`](./keybindings-possible-actions.md#focusguestsession) | `[` in `session` mode | Descend into the guest session in the focused pane |
| [`FocusHostSession`](./keybindings-possible-actions.md#focushostsession) | `]` in `session` mode | Return focus to the host session |
| [`ToggleHostFullscreen`](./keybindings-possible-actions.md#togglehostfullscreen) | `f` in `session` mode | Toggle the fullscreen state of this session's pane inside the host session |

Note that `FocusHostSession` and `ToggleHostFullscreen` are issued from within the guest session, and act on the host containing it. They have no effect in a session that is not nested.

These actions are also available through the CLI and the [plugin API](./plugin-api-commands.md) (`focus_host_session`).

## Guest input mode and keybindings

A guest tells its host which input mode it is in, so that plugins in the host can show hints for the session the user is actually typing into. The guest reports its mode (and its base mode, eg. `locked` for the "Unlock-First" preset) when it connects to the host, every time the mode changes, and when its configuration is reloaded.

Plugins in the host receive this through the [`NestedSessionModeUpdate`](./plugin-api-events.md#nestedsessionmodeupdate) event, which includes the pane the guest runs in and the names of the nested sessions (the guest first, then any sessions nested further inside it). They can ask for the guest's full keybindings with the [`get_nested_session_keybinds`](./plugin-api-commands.md#get_nested_session_keybinds) command, and are told when a guest exits or stops responding through the [`NestedSessionEnded`](./plugin-api-events.md#nestedsessionended) event. All of these require the `ReadApplicationState` permission.

The built-in bars do not use these events yet.

## Other behaviors that are aware of nesting

- Desktop notifications emitted by panes in a guest session are forwarded up through the host to the terminal (see [desktop notifications](./compatibility.md#desktop-notifications)).
- Terminal focus in/out events received by the host are forwarded to the guest, and from there to panes that requested them.
- The working directory reported by the focused pane (`OSC 7`) is passed up to the terminal Zellij runs in, so a guest's working directory reaches the host and from there the outer terminal (see [working directory](./compatibility.md#working-directory-osc-7)).
- A guest reports the status of its session to its host with `OSC 7501`, so what a guest needs shows up in the host's [inbox](./inbox.md) like any other program in a pane.
