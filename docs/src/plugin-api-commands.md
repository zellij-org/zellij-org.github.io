# Plugin API - Commands

Zellij exports functions that allow plugins to control Zellij or change its behavior. All functions listed below are available via `use zellij_tile::prelude::*;`.

For the complete type definitions referenced below, see the [Type Reference](./plugin-api-types.md). For additional details, see the [`zellij-tile`](https://docs.rs/zellij-tile/latest/zellij_tile/) API documentation.

## Table of Contents

- [Subscription Management](#subscription-management)
- [Plugin Settings & Permissions](#plugin-settings--permissions)
- [Query / Information Retrieval](#query--information-retrieval)
- [Session Management](#session-management)
- [File Opening (Editor Panes)](#file-opening-editor-panes)
- [Terminal Pane Opening](#terminal-pane-opening)
- [Command Pane Opening](#command-pane-opening)
- [New Tab Opening](#new-tab-opening)
- [Tab Navigation & Management](#tab-navigation--management)
- [Pane Focus & Visibility](#pane-focus--visibility)
- [Pane Manipulation](#pane-manipulation)
- [Pane Resize & Scroll](#pane-resize--scroll)
- [Writing to Panes & Signals](#writing-to-panes--signals)
- [Input Mode & Key Management](#input-mode--key-management)
- [Layout Management](#layout-management)
- [Background Command Execution & Web Requests](#background-command-execution--web-requests)
- [Plugin Communication](#plugin-communication)
- [CLI Pipe Management](#cli-pipe-management)
- [Plugin Lifecycle](#plugin-lifecycle)
- [Configuration & Host](#configuration--host)
- [Web Server & Sharing](#web-server--sharing)
- [Regex Highlights](#regex-highlights)
- [Action Execution](#action-execution)
- [Utility Functions](#utility-functions)

---

## Subscription Management

---

### `subscribe`

```rust
fn subscribe(event_types: &[EventType])
```

Subscribe to a list of [`Event`](./plugin-api-events.md)s represented by their [`EventType`](./plugin-api-types.md#eventtype)s. Once subscribed, the plugin's [`update`](./plugin-lifecycle.md#update) method will be called with matching events and their payloads.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `event_types` | `&[EventType]` | Slice of event types to subscribe to |

**Example:**

```rust
use zellij_tile::prelude::*;

fn load(&mut self, _configuration: BTreeMap<String, String>) {
    subscribe(&[
        EventType::TabUpdate,
        EventType::PaneUpdate,
        EventType::ModeUpdate,
    ]);
}
```

---

### `unsubscribe`

```rust
fn unsubscribe(event_types: &[EventType])
```

Unsubscribe from a list of previously subscribed [`Event`](./plugin-api-events.md)s.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `event_types` | `&[EventType]` | Slice of event types to unsubscribe from |

**Example:**

```rust
unsubscribe(&[EventType::TabUpdate]);
```

---

## Plugin Settings & Permissions

---

### `set_selectable`

```rust
fn set_selectable(selectable: bool)
```

Set whether the plugin pane is selectable by the user. Unselectable plugins might be desired when they do not accept user input (e.g., status bars).

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `selectable` | `bool` | `true` to make selectable, `false` to make unselectable |

**Example:**

```rust
// Make this plugin unselectable (e.g., for a status bar)
set_selectable(false);
```

---

### `show_cursor`

```rust
fn show_cursor(cursor_position: Option<(usize, usize)>)
```

Show the cursor at specific coordinates within the plugin pane, or hide it.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `cursor_position` | `Option<(usize, usize)>` | `Some((x, y))` to show cursor at coordinates, `None` to hide |

**Example:**

```rust
// Show cursor at column 5, row 10
show_cursor(Some((5, 10)));

// Hide the cursor
show_cursor(None);
```

---

### `request_permission`

```rust
fn request_permission(permissions: &[PermissionType])
```

Request permissions from the user. This should be called in the [`load`](./plugin-lifecycle.md#load) method of the plugin lifecycle. The user will be prompted to grant or deny the requested permissions. Results are delivered via the [`PermissionRequestResult`](./plugin-api-events.md#permissionrequestresult) event.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `permissions` | `&[PermissionType]` | Slice of permissions to request |

**Example:**

```rust
fn load(&mut self, _configuration: BTreeMap<String, String>) {
    request_permission(&[
        PermissionType::ReadApplicationState,
        PermissionType::ChangeApplicationState,
        PermissionType::OpenFiles,
    ]);
    subscribe(&[EventType::PermissionRequestResult]);
}
```

---

### `set_self_mouse_selection_support`

```rust
fn set_self_mouse_selection_support(selection_support: bool)
```

Enable or disable mouse selection support for the plugin pane.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `selection_support` | `bool` | `true` to enable, `false` to disable |

---

## Query / Information Retrieval

---

### `get_plugin_ids`

```rust
fn get_plugin_ids() -> PluginIds
```

Returns the unique Zellij pane ID for the plugin as well as the Zellij process ID.

**Returns:** [`PluginIds`](./plugin-api-types.md#pluginids) - containing `plugin_id`, `zellij_pid`, `initial_cwd`, and `client_id`

**Example:**

```rust
let ids = get_plugin_ids();
eprintln!("Plugin ID: {}, Zellij PID: {}", ids.plugin_id, ids.zellij_pid);
```

---

### `get_zellij_version`

```rust
fn get_zellij_version() -> String
```

Returns the version string of the running Zellij instance. Useful for checking plugin compatibility.

**Returns:** `String` - the Zellij version (e.g., `"0.42.0"`)

**Example:**

```rust
let version = get_zellij_version();
eprintln!("Running on Zellij {}", version);
```

---

### `generate_random_name`

```rust
fn generate_random_name() -> String
```

**Required Permission:** [`ReadApplicationState`](./plugin-api-permissions.md)

Generate a random human-readable name using Zellij's curated word lists. Returns a name in the format `AdjectiveNoun` (e.g., `"BraveRustacean"`, `"ZippyWeasel"`). This uses the same word lists as session name generation, providing approximately 4,096 unique combinations.

**Returns:** `String` - a random name

---

### `get_layout_dir`

```rust
fn get_layout_dir() -> String
```

**Required Permission:** [`ReadApplicationState`](./plugin-api-permissions.md)

Returns the absolute path to the layout directory. This is where Zellij looks for layout files. It can be:
- The directory specified via the CLI `--layout-dir` flag
- The directory specified in the config file
- The directory specified via `ZELLIJ_LAYOUT_DIR` environment variable
- The default: `~/.config/zellij/layouts`

**Returns:** `String` - absolute path to the layout directory (empty string if it cannot be determined)

---

### `get_session_environment_variables`

```rust
fn get_session_environment_variables() -> BTreeMap<String, String>
```

**Required Permission:** [`ReadSessionEnvironmentVariables`](./plugin-api-permissions.md)

Returns the environment variables that were present when the Zellij session was created.

**Returns:** `BTreeMap<String, String>` - environment variable name-value pairs

---

### `get_focused_pane_info`

```rust
fn get_focused_pane_info() -> Result<(usize, PaneId), String>
```

**Required Permission:** [`ReadApplicationState`](./plugin-api-permissions.md)

Returns the focused pane ID and its tab index for the client associated with this plugin.

**Returns:** `Result<(usize, PaneId), String>` - `Ok((tab_index, pane_id))` on success

**Example:**

```rust
match get_focused_pane_info() {
    Ok((tab_index, pane_id)) => {
        eprintln!("Focused pane {:?} in tab {}", pane_id, tab_index);
    },
    Err(e) => eprintln!("Error: {}", e),
}
```

---

### `get_pane_info`

```rust
fn get_pane_info(pane_id: PaneId) -> Option<PaneInfo>
```

**Required Permission:** [`ReadApplicationState`](./plugin-api-permissions.md)

Query detailed information about a specific pane by its [`PaneId`](./plugin-api-types.md#paneid).

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `pane_id` | [`PaneId`](./plugin-api-types.md#paneid) | The pane to query |

**Returns:** `Option<`[`PaneInfo`](./plugin-api-types.md#paneinfo)`>` - pane information, or `None` if the pane does not exist

**Example:**

```rust
if let Some(info) = get_pane_info(PaneId::Terminal(1)) {
    eprintln!("Pane title: {}, focused: {}", info.title, info.is_focused);
}
```

---

### `get_tab_info`

```rust
fn get_tab_info(tab_id: usize) -> Option<TabInfo>
```

**Required Permission:** [`ReadApplicationState`](./plugin-api-permissions.md)

Query detailed information about a specific tab by its stable ID.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `tab_id` | `usize` | The stable tab identifier |

**Returns:** `Option<`[`TabInfo`](./plugin-api-types.md#tabinfo)`>` - tab information, or `None` if the tab does not exist

---

### `get_pane_pid`

```rust
fn get_pane_pid(pane_id: PaneId) -> Result<i32, String>
```

**Required Permission:** [`ReadApplicationState`](./plugin-api-permissions.md)

Get the PID of the process running inside a terminal pane.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `pane_id` | [`PaneId`](./plugin-api-types.md#paneid) | The pane to query (must be a terminal pane) |

**Returns:** `Result<i32, String>` - the process ID on success

---

### `get_pane_running_command`

```rust
fn get_pane_running_command(pane_id: PaneId) -> Result<Vec<String>, String>
```

**Required Permission:** [`ReadApplicationState`](./plugin-api-permissions.md)

Get the current running command (argv) in a terminal pane.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `pane_id` | [`PaneId`](./plugin-api-types.md#paneid) | The pane to query |

**Returns:** `Result<Vec<String>, String>` - the command and its arguments

---

### `get_pane_cwd`

```rust
fn get_pane_cwd(pane_id: PaneId) -> Result<PathBuf, String>
```

**Required Permission:** [`ReadApplicationState`](./plugin-api-permissions.md)

Get the current working directory of a pane's process.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `pane_id` | [`PaneId`](./plugin-api-types.md#paneid) | The pane to query |

**Returns:** `Result<PathBuf, String>` - the working directory path

---

### `get_pane_scrollback`

```rust
fn get_pane_scrollback(pane_id: PaneId, get_full_scrollback: bool) -> Result<PaneContents, String>
```

**Required Permission:** [`ReadPaneContents`](./plugin-api-permissions.md)

Retrieve the scrollback buffer contents of a pane.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `pane_id` | [`PaneId`](./plugin-api-types.md#paneid) | The pane to read |
| `get_full_scrollback` | `bool` | If `true`, includes lines above and below the viewport |

**Returns:** `Result<`[`PaneContents`](./plugin-api-types.md#panecontents)`, String>` - the pane contents

**Example:**

```rust
match get_pane_scrollback(PaneId::Terminal(1), false) {
    Ok(contents) => {
        for line in &contents.viewport {
            eprintln!("{}", line);
        }
    },
    Err(e) => eprintln!("Error: {}", e),
}
```

---

### `list_clients`

```rust
fn list_clients()
```

**Required Permission:** [`ReadApplicationState`](./plugin-api-permissions.md)

Request a list of connected clients. Results are delivered asynchronously via the [`ListClients`](./plugin-api-events.md#listclients) event. The plugin must subscribe to this event before calling.

**Example:**

```rust
subscribe(&[EventType::ListClients]);
list_clients();
```

---

## Session Management

---

### `save_session`

```rust
fn save_session() -> Result<(), String>
```

**Required Permission:** [`ReadApplicationState`](./plugin-api-permissions.md)

Save the current session state to disk immediately.

**Returns:** `Result<(), String>` - `Ok(())` on success

---

### `current_session_last_saved_time`

```rust
fn current_session_last_saved_time() -> Option<u64>
```

**Required Permission:** [`ReadApplicationState`](./plugin-api-permissions.md)

Get the number of milliseconds elapsed since the last session save.

**Returns:** `Option<u64>` - milliseconds since last save, or `None` if never saved

---

### `switch_session`

```rust
fn switch_session(name: Option<&str>)
```

**Required Permission:** [`ChangeApplicationState`](./plugin-api-permissions.md)

Switch to a named session, or create a new session with a random name if `None` is provided.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `name` | `Option<&str>` | Session name to switch to, or `None` for a new session |

**Example:**

```rust
// Switch to existing session
switch_session(Some("my-project"));

// Create a new session with a random name
switch_session(None);
```

---

### `switch_session_with_layout`

```rust
fn switch_session_with_layout(
    name: Option<&str>,
    layout: LayoutInfo,
    cwd: Option<PathBuf>,
)
```

**Required Permission:** [`ChangeApplicationState`](./plugin-api-permissions.md)

Switch to a session with a specific layout and optional working directory. If the session does not exist, it is created with the given layout.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `name` | `Option<&str>` | Session name, or `None` for a new session |
| `layout` | [`LayoutInfo`](./plugin-api-types.md#layoutinfo) | Layout to apply |
| `cwd` | `Option<PathBuf>` | Working directory for the session |

---

### `switch_session_with_cwd`

```rust
fn switch_session_with_cwd(name: Option<&str>, cwd: Option<PathBuf>)
```

**Required Permission:** [`ChangeApplicationState`](./plugin-api-permissions.md)

Switch to a session with a specific working directory.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `name` | `Option<&str>` | Session name, or `None` for a new session |
| `cwd` | `Option<PathBuf>` | Working directory for the session |

---

### `switch_session_with_focus`

```rust
fn switch_session_with_focus(
    name: &str,
    tab_position: Option<usize>,
    pane_id: Option<(u32, bool)>,
)
```

**Required Permission:** [`ChangeApplicationState`](./plugin-api-permissions.md)

Switch to a session, focusing a specific pane or tab. The pane is prioritized over the tab position if both are provided.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `name` | `&str` | Session name to switch to |
| `tab_position` | `Option<usize>` | Tab position to focus |
| `pane_id` | `Option<(u32, bool)>` | Pane to focus: `(id, is_plugin)` |

---

### `rename_session`

```rust
fn rename_session(name: &str)
```

**Required Permission:** [`ChangeApplicationState`](./plugin-api-permissions.md)

Rename the current session.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `name` | `&str` | New session name |

---

### `delete_dead_session`

```rust
fn delete_dead_session(name: &str)
```

**Required Permission:** [`ChangeApplicationState`](./plugin-api-permissions.md)

Permanently delete a resurrectable (dead) session with the given name.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `name` | `&str` | Name of the dead session to delete |

---

### `delete_all_dead_sessions`

```rust
fn delete_all_dead_sessions()
```

**Required Permission:** [`ChangeApplicationState`](./plugin-api-permissions.md)

Permanently delete all resurrectable (dead) sessions on this machine.

---

### `kill_sessions`

```rust
fn kill_sessions<S: AsRef<str>>(session_names: &[S])
```

**Required Permission:** [`ChangeApplicationState`](./plugin-api-permissions.md)

Kill one or more sessions by name.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `session_names` | `&[S]` | Slice of session names to kill |

**Example:**

```rust
kill_sessions(&["old-session", "temp-session"]);
```

---

### `detach`

```rust
fn detach()
```

**Required Permission:** [`ChangeApplicationState`](./plugin-api-permissions.md)

Detach the user from the active session.

---

### `disconnect_other_clients`

```rust
fn disconnect_other_clients()
```

**Required Permission:** [`ChangeApplicationState`](./plugin-api-permissions.md)

Disconnect all other clients from the current session.

---

### `quit_zellij`

```rust
fn quit_zellij()
```

**Required Permission:** [`ChangeApplicationState`](./plugin-api-permissions.md)

Completely quit Zellij for this and all other connected clients.

---

## File Opening (Editor Panes)

All file opening commands open files in the user's default `$EDITOR`.

---

### `open_file`

```rust
fn open_file(
    file_to_open: FileToOpen,
    context: BTreeMap<String, String>,
) -> Option<PaneId>
```

**Required Permission:** [`OpenFiles`](./plugin-api-permissions.md)

Open a file in the user's default `$EDITOR` in a new tiled pane.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `file_to_open` | [`FileToOpen`](./plugin-api-types.md#filetoopen) | File path, optional line number, and optional cwd |
| `context` | `BTreeMap<String, String>` | Arbitrary context returned in `EditPaneOpened`/`EditPaneExited` events |

**Returns:** `Option<`[`PaneId`](./plugin-api-types.md#paneid)`>` - the ID of the opened pane, if available

**Example:**

```rust
let file = FileToOpen {
    path: PathBuf::from("src/main.rs"),
    line_number: Some(42),
    cwd: None,
};
let pane_id = open_file(file, BTreeMap::new());
```

---

### `open_file_floating`

```rust
fn open_file_floating(
    file_to_open: FileToOpen,
    coordinates: Option<FloatingPaneCoordinates>,
    context: BTreeMap<String, String>,
) -> Option<PaneId>
```

**Required Permission:** [`OpenFiles`](./plugin-api-permissions.md)

Open a file in the user's default `$EDITOR` in a new floating pane.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `file_to_open` | [`FileToOpen`](./plugin-api-types.md#filetoopen) | File path, optional line number, and optional cwd |
| `coordinates` | `Option<`[`FloatingPaneCoordinates`](./plugin-api-types.md#floatingpanecoordinates)`>` | Optional position and size |
| `context` | `BTreeMap<String, String>` | Arbitrary context for event callbacks |

**Returns:** `Option<PaneId>` - the ID of the opened pane

---

### `open_file_in_place`

```rust
fn open_file_in_place(
    file_to_open: FileToOpen,
    context: BTreeMap<String, String>,
) -> Option<PaneId>
```

**Required Permission:** [`OpenFiles`](./plugin-api-permissions.md)

Open a file in the user's default `$EDITOR`, temporarily replacing the focused pane.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `file_to_open` | [`FileToOpen`](./plugin-api-types.md#filetoopen) | File to open |
| `context` | `BTreeMap<String, String>` | Arbitrary context for event callbacks |

**Returns:** `Option<PaneId>` - the ID of the opened pane

---

### `open_file_near_plugin`

```rust
fn open_file_near_plugin(
    file_to_open: FileToOpen,
    context: BTreeMap<String, String>,
) -> Option<PaneId>
```

**Required Permission:** [`OpenFiles`](./plugin-api-permissions.md)

Open a file in the user's default `$EDITOR` in the same tab as the plugin as a tiled pane, regardless of the user's focus.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `file_to_open` | [`FileToOpen`](./plugin-api-types.md#filetoopen) | File to open |
| `context` | `BTreeMap<String, String>` | Arbitrary context for event callbacks |

**Returns:** `Option<PaneId>` - the ID of the opened pane

---

### `open_file_floating_near_plugin`

```rust
fn open_file_floating_near_plugin(
    file_to_open: FileToOpen,
    coordinates: Option<FloatingPaneCoordinates>,
    context: BTreeMap<String, String>,
) -> Option<PaneId>
```

**Required Permission:** [`OpenFiles`](./plugin-api-permissions.md)

Open a file in the user's default `$EDITOR` in the same tab as the plugin as a floating pane, regardless of the user's focus.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `file_to_open` | [`FileToOpen`](./plugin-api-types.md#filetoopen) | File to open |
| `coordinates` | `Option<FloatingPaneCoordinates>` | Optional position and size |
| `context` | `BTreeMap<String, String>` | Arbitrary context for event callbacks |

**Returns:** `Option<PaneId>` - the ID of the opened pane

---

### `open_file_in_place_of_plugin`

```rust
fn open_file_in_place_of_plugin(
    file_to_open: FileToOpen,
    close_plugin_after_replace: bool,
    context: BTreeMap<String, String>,
) -> Option<PaneId>
```

**Required Permission:** [`OpenFiles`](./plugin-api-permissions.md)

Open a file in the user's default `$EDITOR`, replacing the plugin pane itself, regardless of the user's focus.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `file_to_open` | [`FileToOpen`](./plugin-api-types.md#filetoopen) | File to open |
| `close_plugin_after_replace` | `bool` | If `true`, close the plugin pane after replacement |
| `context` | `BTreeMap<String, String>` | Arbitrary context for event callbacks |

**Returns:** `Option<PaneId>` - the ID of the opened pane

---

### `open_edit_pane_in_place_of_pane_id`

```rust
fn open_edit_pane_in_place_of_pane_id(
    pane_id: PaneId,
    file_to_open: FileToOpen,
    close_replaced_pane: bool,
    context: BTreeMap<String, String>,
) -> Option<PaneId>
```

**Required Permission:** [`OpenFiles`](./plugin-api-permissions.md)

Open a file in the user's default `$EDITOR`, replacing an arbitrary pane by its ID.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `pane_id` | [`PaneId`](./plugin-api-types.md#paneid) | The pane to replace |
| `file_to_open` | [`FileToOpen`](./plugin-api-types.md#filetoopen) | File to open |
| `close_replaced_pane` | `bool` | If `true`, close the replaced pane; if `false`, suppress it |
| `context` | `BTreeMap<String, String>` | Arbitrary context for event callbacks |

**Returns:** `Option<PaneId>` - the ID of the opened pane

---

## Terminal Pane Opening

---

### `open_terminal`

```rust
fn open_terminal<P: AsRef<Path>>(path: P) -> Option<PaneId>
```

**Required Permission:** [`OpenTerminalsOrPlugins`](./plugin-api-permissions.md)

Open a new terminal pane at the specified working directory.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `path` | `impl AsRef<Path>` | Working directory for the new terminal |

**Returns:** `Option<PaneId>` - the ID of the opened pane

**Example:**

```rust
let pane_id = open_terminal("/home/user/project");
```

---

### `open_terminal_near_plugin`

```rust
fn open_terminal_near_plugin<P: AsRef<Path>>(path: P) -> Option<PaneId>
```

**Required Permission:** [`OpenTerminalsOrPlugins`](./plugin-api-permissions.md)

Open a new tiled terminal in the tab where the plugin resides, regardless of the user's focus.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `path` | `impl AsRef<Path>` | Working directory for the new terminal |

**Returns:** `Option<PaneId>` - the ID of the opened pane

---

### `open_terminal_floating`

```rust
fn open_terminal_floating<P: AsRef<Path>>(
    path: P,
    coordinates: Option<FloatingPaneCoordinates>,
) -> Option<PaneId>
```

**Required Permission:** [`OpenTerminalsOrPlugins`](./plugin-api-permissions.md)

Open a new floating terminal pane at the specified working directory.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `path` | `impl AsRef<Path>` | Working directory for the new terminal |
| `coordinates` | `Option<FloatingPaneCoordinates>` | Optional position and size |

**Returns:** `Option<PaneId>` - the ID of the opened pane

---

### `open_terminal_floating_near_plugin`

```rust
fn open_terminal_floating_near_plugin<P: AsRef<Path>>(
    path: P,
    coordinates: Option<FloatingPaneCoordinates>,
) -> Option<PaneId>
```

**Required Permission:** [`OpenTerminalsOrPlugins`](./plugin-api-permissions.md)

Open a new floating terminal in the tab where the plugin resides, regardless of the user's focus.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `path` | `impl AsRef<Path>` | Working directory for the new terminal |
| `coordinates` | `Option<FloatingPaneCoordinates>` | Optional position and size |

**Returns:** `Option<PaneId>` - the ID of the opened pane

---

### `open_terminal_in_place`

```rust
fn open_terminal_in_place<P: AsRef<Path>>(path: P) -> Option<PaneId>
```

**Required Permission:** [`OpenTerminalsOrPlugins`](./plugin-api-permissions.md)

Open a new terminal pane, temporarily replacing the focused pane.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `path` | `impl AsRef<Path>` | Working directory for the new terminal |

**Returns:** `Option<PaneId>` - the ID of the opened pane

---

### `open_terminal_in_place_of_plugin`

```rust
fn open_terminal_in_place_of_plugin<P: AsRef<Path>>(
    path: P,
    close_plugin_after_replace: bool,
) -> Option<PaneId>
```

**Required Permission:** [`OpenTerminalsOrPlugins`](./plugin-api-permissions.md)

Open a new terminal pane, replacing the plugin pane, regardless of the user's focus.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `path` | `impl AsRef<Path>` | Working directory for the new terminal |
| `close_plugin_after_replace` | `bool` | If `true`, close the plugin; if `false`, suppress it |

**Returns:** `Option<PaneId>` - the ID of the opened pane

---

### `open_terminal_pane_in_place_of_pane_id`

```rust
fn open_terminal_pane_in_place_of_pane_id<P: AsRef<Path>>(
    pane_id: PaneId,
    cwd: P,
    close_replaced_pane: bool,
) -> Option<PaneId>
```

**Required Permission:** [`OpenTerminalsOrPlugins`](./plugin-api-permissions.md)

Open a new terminal pane, replacing an arbitrary pane by its ID.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `pane_id` | [`PaneId`](./plugin-api-types.md#paneid) | The pane to replace |
| `cwd` | `impl AsRef<Path>` | Working directory for the new terminal |
| `close_replaced_pane` | `bool` | If `true`, close the replaced pane; if `false`, suppress it |

**Returns:** `Option<PaneId>` - the ID of the opened pane

---

## Command Pane Opening

Command panes allow the user to control the command, re-run it, and see its exit status through the Zellij UI.

---

### `open_command_pane`

```rust
fn open_command_pane(
    command_to_run: CommandToRun,
    context: BTreeMap<String, String>,
) -> Option<PaneId>
```

**Required Permission:** [`RunCommands`](./plugin-api-permissions.md)

Open a new command pane with the specified command and arguments.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `command_to_run` | [`CommandToRun`](./plugin-api-types.md#commandtorun) | Command path, args, and optional cwd |
| `context` | `BTreeMap<String, String>` | Arbitrary context returned in `CommandPaneOpened`/`CommandPaneExited` events |

**Returns:** `Option<PaneId>` - the ID of the opened pane

**Example:**

```rust
let cmd = CommandToRun {
    path: PathBuf::from("cargo"),
    args: vec!["test".to_string()],
    cwd: Some(PathBuf::from("/home/user/project")),
};
let pane_id = open_command_pane(cmd, BTreeMap::new());
```

---

### `open_command_pane_near_plugin`

```rust
fn open_command_pane_near_plugin(
    command_to_run: CommandToRun,
    context: BTreeMap<String, String>,
) -> Option<PaneId>
```

**Required Permission:** [`RunCommands`](./plugin-api-permissions.md)

Open a new command pane in the same tab as the plugin, regardless of the user's focus.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `command_to_run` | [`CommandToRun`](./plugin-api-types.md#commandtorun) | Command to execute |
| `context` | `BTreeMap<String, String>` | Arbitrary context for event callbacks |

**Returns:** `Option<PaneId>` - the ID of the opened pane

---

### `open_command_pane_floating`

```rust
fn open_command_pane_floating(
    command_to_run: CommandToRun,
    coordinates: Option<FloatingPaneCoordinates>,
    context: BTreeMap<String, String>,
) -> Option<PaneId>
```

**Required Permission:** [`RunCommands`](./plugin-api-permissions.md)

Open a new floating command pane.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `command_to_run` | [`CommandToRun`](./plugin-api-types.md#commandtorun) | Command to execute |
| `coordinates` | `Option<FloatingPaneCoordinates>` | Optional position and size |
| `context` | `BTreeMap<String, String>` | Arbitrary context for event callbacks |

**Returns:** `Option<PaneId>` - the ID of the opened pane

---

### `open_command_pane_floating_near_plugin`

```rust
fn open_command_pane_floating_near_plugin(
    command_to_run: CommandToRun,
    coordinates: Option<FloatingPaneCoordinates>,
    context: BTreeMap<String, String>,
) -> Option<PaneId>
```

**Required Permission:** [`RunCommands`](./plugin-api-permissions.md)

Open a new floating command pane in the same tab as the plugin, regardless of the user's focus.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `command_to_run` | [`CommandToRun`](./plugin-api-types.md#commandtorun) | Command to execute |
| `coordinates` | `Option<FloatingPaneCoordinates>` | Optional position and size |
| `context` | `BTreeMap<String, String>` | Arbitrary context for event callbacks |

**Returns:** `Option<PaneId>` - the ID of the opened pane

---

### `open_command_pane_in_place`

```rust
fn open_command_pane_in_place(
    command_to_run: CommandToRun,
    context: BTreeMap<String, String>,
) -> Option<PaneId>
```

**Required Permission:** [`RunCommands`](./plugin-api-permissions.md)

Open a new command pane, temporarily replacing the focused pane.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `command_to_run` | [`CommandToRun`](./plugin-api-types.md#commandtorun) | Command to execute |
| `context` | `BTreeMap<String, String>` | Arbitrary context for event callbacks |

**Returns:** `Option<PaneId>` - the ID of the opened pane

---

### `open_command_pane_in_place_of_plugin`

```rust
fn open_command_pane_in_place_of_plugin(
    command_to_run: CommandToRun,
    close_plugin_after_replace: bool,
    context: BTreeMap<String, String>,
) -> Option<PaneId>
```

**Required Permission:** [`RunCommands`](./plugin-api-permissions.md)

Open a new command pane, replacing the plugin pane, regardless of the user's focus.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `command_to_run` | [`CommandToRun`](./plugin-api-types.md#commandtorun) | Command to execute |
| `close_plugin_after_replace` | `bool` | If `true`, close the plugin; if `false`, suppress it |
| `context` | `BTreeMap<String, String>` | Arbitrary context for event callbacks |

**Returns:** `Option<PaneId>` - the ID of the opened pane

---

### `open_command_pane_in_place_of_pane_id`

```rust
fn open_command_pane_in_place_of_pane_id(
    pane_id: PaneId,
    command_to_run: CommandToRun,
    close_replaced_pane: bool,
    context: BTreeMap<String, String>,
) -> Option<PaneId>
```

**Required Permission:** [`RunCommands`](./plugin-api-permissions.md)

Open a new command pane, replacing an arbitrary pane by its ID.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `pane_id` | [`PaneId`](./plugin-api-types.md#paneid) | The pane to replace |
| `command_to_run` | [`CommandToRun`](./plugin-api-types.md#commandtorun) | Command to execute |
| `close_replaced_pane` | `bool` | If `true`, close the replaced pane; if `false`, suppress it |
| `context` | `BTreeMap<String, String>` | Arbitrary context for event callbacks |

**Returns:** `Option<PaneId>` - the ID of the opened pane

---

### `open_command_pane_background`

```rust
fn open_command_pane_background(
    command_to_run: CommandToRun,
    context: BTreeMap<String, String>,
) -> Option<PaneId>
```

**Required Permission:** [`RunCommands`](./plugin-api-permissions.md)

Open a new hidden (background/suppressed) command pane. The pane runs but is not visible in the UI.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `command_to_run` | [`CommandToRun`](./plugin-api-types.md#commandtorun) | Command to execute |
| `context` | `BTreeMap<String, String>` | Arbitrary context for event callbacks |

**Returns:** `Option<PaneId>` - the ID of the opened pane

---

### `rerun_command_pane`

```rust
fn rerun_command_pane(terminal_pane_id: u32)
```

**Required Permission:** [`ChangeApplicationState`](./plugin-api-permissions.md)

Re-run the command in an existing command pane.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `terminal_pane_id` | `u32` | The terminal pane ID of the command pane |

---

## New Tab Opening

---

### `new_tab`

```rust
fn new_tab<S: AsRef<str>>(name: Option<S>, cwd: Option<S>) -> Option<usize>
```

**Required Permission:** [`ChangeApplicationState`](./plugin-api-permissions.md)

Open a new tab with the default layout.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `name` | `Option<impl AsRef<str>>` | Optional name for the new tab |
| `cwd` | `Option<impl AsRef<str>>` | Optional working directory |

**Returns:** `Option<usize>` - the tab ID of the new tab

**Example:**

```rust
let tab_id = new_tab(Some("build"), Some("/home/user/project"));
```

---

### `new_tabs_with_layout`

```rust
fn new_tabs_with_layout(layout: &str) -> Vec<usize>
```

**Required Permission:** [`ChangeApplicationState`](./plugin-api-permissions.md)

Apply a stringified KDL [`layout`](./layouts.md) to the current session. If the layout defines multiple tabs, all are opened.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `layout` | `&str` | KDL layout string |

**Returns:** `Vec<usize>` - the tab IDs of all created tabs

**Example:**

```rust
let tab_ids = new_tabs_with_layout(r#"
layout {
    tab name="code" {
        pane
        pane split_direction="vertical" {
            pane command="cargo" { args "watch"; }
        }
    }
}
"#);
```

---

### `new_tabs_with_layout_info`

```rust
fn new_tabs_with_layout_info<L: AsRef<LayoutInfo>>(layout_info: L) -> Vec<usize>
```

**Required Permission:** [`ChangeApplicationState`](./plugin-api-permissions.md)

Apply a [`LayoutInfo`](./plugin-api-types.md#layoutinfo) to the current session in new tabs.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `layout_info` | `impl AsRef<LayoutInfo>` | Layout specification |

**Returns:** `Vec<usize>` - the tab IDs of all created tabs

---

### `open_command_pane_in_new_tab`

```rust
fn open_command_pane_in_new_tab(
    command_to_run: CommandToRun,
    context: BTreeMap<String, String>,
) -> (Option<usize>, Option<PaneId>)
```

**Required Permission:** [`ChangeApplicationState`](./plugin-api-permissions.md)

Open a new tab with a command pane running the specified command.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `command_to_run` | [`CommandToRun`](./plugin-api-types.md#commandtorun) | Command to execute |
| `context` | `BTreeMap<String, String>` | Arbitrary context for event callbacks |

**Returns:** `(Option<usize>, Option<PaneId>)` - the tab ID and pane ID of the created tab and pane

---

### `open_plugin_pane_in_new_tab`

```rust
fn open_plugin_pane_in_new_tab(
    plugin_url: impl ToString,
    configuration: BTreeMap<String, String>,
    context: BTreeMap<String, String>,
) -> (Option<usize>, Option<PaneId>)
```

**Required Permission:** [`ChangeApplicationState`](./plugin-api-permissions.md)

Open a new tab with a plugin pane loaded from the specified URL.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `plugin_url` | `impl ToString` | Plugin URL (e.g., `"file:/path/to/plugin.wasm"` or a named alias) |
| `configuration` | `BTreeMap<String, String>` | Plugin configuration key-value pairs |
| `context` | `BTreeMap<String, String>` | Arbitrary context for event callbacks |

**Returns:** `(Option<usize>, Option<PaneId>)` - the tab ID and pane ID

---

### `open_editor_pane_in_new_tab`

```rust
fn open_editor_pane_in_new_tab(
    file_to_open: FileToOpen,
    context: BTreeMap<String, String>,
) -> (Option<usize>, Option<PaneId>)
```

**Required Permission:** [`ChangeApplicationState`](./plugin-api-permissions.md)

Open a new tab with an editor pane for the specified file.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `file_to_open` | [`FileToOpen`](./plugin-api-types.md#filetoopen) | File to open |
| `context` | `BTreeMap<String, String>` | Arbitrary context for event callbacks |

**Returns:** `(Option<usize>, Option<PaneId>)` - the tab ID and pane ID

---

## Tab Navigation & Management

---

### `switch_tab_to`

```rust
fn switch_tab_to(tab_idx: u32)
```

**Required Permission:** [`ChangeApplicationState`](./plugin-api-permissions.md)

Change the focused tab to the specified index. Tab indices correspond to the default tab names, starting at `1`. An index of `0` is treated as `1`.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `tab_idx` | `u32` | Tab index (1-based) |

---

### `go_to_next_tab`

```rust
fn go_to_next_tab()
```

**Required Permission:** [`ChangeApplicationState`](./plugin-api-permissions.md)

Switch to the next tab, wrapping around to the first tab if at the end.

---

### `go_to_previous_tab`

```rust
fn go_to_previous_tab()
```

**Required Permission:** [`ChangeApplicationState`](./plugin-api-permissions.md)

Switch to the previous tab, wrapping around to the last tab if at the beginning.

---

### `go_to_tab_name`

```rust
fn go_to_tab_name(tab_name: &str)
```

**Required Permission:** [`ChangeApplicationState`](./plugin-api-permissions.md)

Switch to the tab with the specified name.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `tab_name` | `&str` | Name of the tab to focus |

---

### `focus_or_create_tab`

```rust
fn focus_or_create_tab(tab_name: &str) -> Option<usize>
```

**Required Permission:** [`ChangeApplicationState`](./plugin-api-permissions.md)

Focus the tab with the specified name, or create it if it does not exist.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `tab_name` | `&str` | Name of the tab to focus or create |

**Returns:** `Option<usize>` - the tab ID

---

### `go_to_tab`

```rust
fn go_to_tab(tab_index: u32)
```

**Required Permission:** [`ChangeApplicationState`](./plugin-api-permissions.md)

Switch to a tab by its index.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `tab_index` | `u32` | Tab index |

---

### `toggle_tab`

```rust
fn toggle_tab()
```

**Required Permission:** [`ChangeApplicationState`](./plugin-api-permissions.md)

Toggle to the previously focused tab (regardless of tab position).

---

### `close_focused_tab`

```rust
fn close_focused_tab()
```

**Required Permission:** [`ChangeApplicationState`](./plugin-api-permissions.md)

Close the currently focused tab.

---

### `close_tab_with_index`

```rust
fn close_tab_with_index(tab_index: usize)
```

**Required Permission:** [`ChangeApplicationState`](./plugin-api-permissions.md)

Close a tab by its position index.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `tab_index` | `usize` | Tab position index |

---

### `close_tab_with_id`

```rust
fn close_tab_with_id(tab_id: u64)
```

**Required Permission:** [`ChangeApplicationState`](./plugin-api-permissions.md)

Close a tab by its stable ID.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `tab_id` | `u64` | Stable tab identifier |

---

### `rename_tab`

```rust
fn rename_tab<S: AsRef<str>>(tab_position: u32, new_name: S)
```

**Required Permission:** [`ChangeApplicationState`](./plugin-api-permissions.md)

Rename a tab by its position.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `tab_position` | `u32` | Tab position |
| `new_name` | `impl AsRef<str>` | New tab name |

---

### `rename_tab_with_id`

```rust
fn rename_tab_with_id<S: AsRef<str>>(tab_id: u64, new_name: S)
```

**Required Permission:** [`ChangeApplicationState`](./plugin-api-permissions.md)

Rename a tab by its stable ID.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `tab_id` | `u64` | Stable tab identifier |
| `new_name` | `impl AsRef<str>` | New tab name |

---

### `undo_rename_tab`

```rust
fn undo_rename_tab()
```

**Required Permission:** [`ChangeApplicationState`](./plugin-api-permissions.md)

Undo the last tab rename, reverting to the previous name.

---

### `toggle_active_tab_sync`

```rust
fn toggle_active_tab_sync()
```

**Required Permission:** [`ChangeApplicationState`](./plugin-api-permissions.md)

Toggle STDIN synchronization for the current tab. When active, input is broadcast to all panes in the tab.

---

### `break_panes_to_new_tab`

```rust
fn break_panes_to_new_tab(
    pane_ids: &[PaneId],
    new_tab_name: Option<String>,
    should_change_focus_to_new_tab: bool,
) -> Option<usize>
```

**Required Permission:** [`ChangeApplicationState`](./plugin-api-permissions.md)

Move the specified panes to a new tab.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `pane_ids` | `&[PaneId]` | Panes to move |
| `new_tab_name` | `Option<String>` | Optional name for the new tab |
| `should_change_focus_to_new_tab` | `bool` | Whether to switch focus to the new tab |

**Returns:** `Option<usize>` - the tab ID of the new tab

---

### `break_panes_to_tab_with_index`

```rust
fn break_panes_to_tab_with_index(
    pane_ids: &[PaneId],
    tab_index: usize,
    should_change_focus_to_new_tab: bool,
) -> Option<usize>
```

**Required Permission:** [`ChangeApplicationState`](./plugin-api-permissions.md)

Move the specified panes to an existing tab by index.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `pane_ids` | `&[PaneId]` | Panes to move |
| `tab_index` | `usize` | Target tab position index |
| `should_change_focus_to_new_tab` | `bool` | Whether to switch focus to the target tab |

**Returns:** `Option<usize>` - the tab ID

---

### `break_panes_to_tab_with_id`

```rust
fn break_panes_to_tab_with_id(
    pane_ids: &[PaneId],
    tab_id: usize,
    should_change_focus_to_target_tab: bool,
) -> Option<usize>
```

**Required Permission:** [`ChangeApplicationState`](./plugin-api-permissions.md)

Move the specified panes to an existing tab by its stable ID.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `pane_ids` | `&[PaneId]` | Panes to move |
| `tab_id` | `usize` | Target tab stable ID |
| `should_change_focus_to_target_tab` | `bool` | Whether to switch focus to the target tab |

**Returns:** `Option<usize>` - the tab ID

---

## Pane Focus & Visibility

---

### `hide_self`

```rust
fn hide_self()
```

Hide (suppress) the plugin pane from the UI. The plugin continues running in the background.

---

### `show_self`

```rust
fn show_self(should_float_if_hidden: bool)
```

Show the plugin pane (unsuppress it if suppressed), focus it, and switch to its tab.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `should_float_if_hidden` | `bool` | If `true`, show as a floating pane when unsuppressing |

---

### `close_self`

```rust
fn close_self()
```

Close this plugin pane entirely.

---

### `hide_pane_with_id`

```rust
fn hide_pane_with_id(pane_id: PaneId)
```

**Required Permission:** [`ChangeApplicationState`](./plugin-api-permissions.md)

Hide (suppress) a specific pane from the UI.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `pane_id` | [`PaneId`](./plugin-api-types.md#paneid) | The pane to hide |

---

### `show_pane_with_id`

```rust
fn show_pane_with_id(
    pane_id: PaneId,
    should_float_if_hidden: bool,
    should_focus_pane: bool,
)
```

**Required Permission:** [`ChangeApplicationState`](./plugin-api-permissions.md)

Show a specific pane (unsuppress it if suppressed), optionally focusing it and switching to its tab.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `pane_id` | [`PaneId`](./plugin-api-types.md#paneid) | The pane to show |
| `should_float_if_hidden` | `bool` | If `true`, show as floating when unsuppressing |
| `should_focus_pane` | `bool` | If `true`, focus the pane after showing |

---

### `focus_next_pane`

```rust
fn focus_next_pane()
```

**Required Permission:** [`ChangeApplicationState`](./plugin-api-permissions.md)

Move focus to the next pane in chronological order.

---

### `focus_previous_pane`

```rust
fn focus_previous_pane()
```

**Required Permission:** [`ChangeApplicationState`](./plugin-api-permissions.md)

Move focus to the previous pane in chronological order.

---

### `move_focus`

```rust
fn move_focus(direction: Direction)
```

**Required Permission:** [`ChangeApplicationState`](./plugin-api-permissions.md)

Move focus to the pane in the specified direction.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `direction` | [`Direction`](./plugin-api-types.md#direction) | `Left`, `Right`, `Up`, or `Down` |

---

### `move_focus_or_tab`

```rust
fn move_focus_or_tab(direction: Direction)
```

**Required Permission:** [`ChangeApplicationState`](./plugin-api-permissions.md)

Move focus in the specified direction. If the focused pane is at the edge of the screen, the next or previous tab is focused instead.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `direction` | [`Direction`](./plugin-api-types.md#direction) | `Left`, `Right`, `Up`, or `Down` |

---

### `focus_terminal_pane`

```rust
fn focus_terminal_pane(
    terminal_pane_id: u32,
    should_float_if_hidden: bool,
    should_be_in_place_if_hidden: bool,
)
```

**Required Permission:** [`ChangeApplicationState`](./plugin-api-permissions.md)

Focus a specific terminal pane by its ID, unsuppressing it if necessary and switching to its tab.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `terminal_pane_id` | `u32` | Terminal pane ID |
| `should_float_if_hidden` | `bool` | Show as floating when unsuppressing |
| `should_be_in_place_if_hidden` | `bool` | Show in-place (replacing the focused pane) when unsuppressing |

---

### `focus_plugin_pane`

```rust
fn focus_plugin_pane(
    plugin_pane_id: u32,
    should_float_if_hidden: bool,
    should_be_in_place_if_hidden: bool,
)
```

**Required Permission:** [`ChangeApplicationState`](./plugin-api-permissions.md)

Focus a specific plugin pane by its ID, unsuppressing it if necessary and switching to its tab.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `plugin_pane_id` | `u32` | Plugin pane ID |
| `should_float_if_hidden` | `bool` | Show as floating when unsuppressing |
| `should_be_in_place_if_hidden` | `bool` | Show in-place when unsuppressing |

---

### `focus_pane_with_id`

```rust
fn focus_pane_with_id(
    pane_id: PaneId,
    should_float_if_hidden: bool,
    should_be_in_place_if_hidden: bool,
)
```

**Required Permission:** [`ChangeApplicationState`](./plugin-api-permissions.md)

Focus any pane by its [`PaneId`](./plugin-api-types.md#paneid). This is a convenience wrapper around `focus_terminal_pane` and `focus_plugin_pane`.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `pane_id` | [`PaneId`](./plugin-api-types.md#paneid) | The pane to focus |
| `should_float_if_hidden` | `bool` | Show as floating when unsuppressing |
| `should_be_in_place_if_hidden` | `bool` | Show in-place when unsuppressing |

---

### `show_floating_panes`

```rust
fn show_floating_panes(tab_id: Option<usize>) -> Result<bool, String>
```

**Required Permission:** [`ChangeApplicationState`](./plugin-api-permissions.md)

Show all floating panes in the specified tab, or the active tab if `None`.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `tab_id` | `Option<usize>` | Tab ID, or `None` for the active tab |

**Returns:** `Result<bool, String>` - whether floating panes are now visible

---

### `hide_floating_panes`

```rust
fn hide_floating_panes(tab_id: Option<usize>) -> Result<bool, String>
```

**Required Permission:** [`ChangeApplicationState`](./plugin-api-permissions.md)

Hide all floating panes in the specified tab, or the active tab if `None`.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `tab_id` | `Option<usize>` | Tab ID, or `None` for the active tab |

**Returns:** `Result<bool, String>` - whether floating panes are now hidden

---

## Pane Manipulation

---

### `close_focus`

```rust
fn close_focus()
```

**Required Permission:** [`ChangeApplicationState`](./plugin-api-permissions.md)

Close the currently focused pane.

---

### `close_terminal_pane`

```rust
fn close_terminal_pane(terminal_pane_id: u32)
```

**Required Permission:** [`ChangeApplicationState`](./plugin-api-permissions.md)

Close a terminal pane by its ID.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `terminal_pane_id` | `u32` | Terminal pane ID to close |

---

### `close_plugin_pane`

```rust
fn close_plugin_pane(plugin_pane_id: u32)
```

**Required Permission:** [`ChangeApplicationState`](./plugin-api-permissions.md)

Close a plugin pane by its ID.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `plugin_pane_id` | `u32` | Plugin pane ID to close |

---

### `close_pane_with_id`

```rust
fn close_pane_with_id(pane_id: PaneId)
```

**Required Permission:** [`ChangeApplicationState`](./plugin-api-permissions.md)

Close any pane by its [`PaneId`](./plugin-api-types.md#paneid). Convenience wrapper around `close_terminal_pane` and `close_plugin_pane`.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `pane_id` | [`PaneId`](./plugin-api-types.md#paneid) | The pane to close |

---

### `close_multiple_panes`

```rust
fn close_multiple_panes(pane_ids: Vec<PaneId>)
```

**Required Permission:** [`ChangeApplicationState`](./plugin-api-permissions.md)

Close multiple panes at once.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `pane_ids` | `Vec<PaneId>` | Panes to close |

---

### `rename_terminal_pane`

```rust
fn rename_terminal_pane<S: AsRef<str>>(terminal_pane_id: u32, new_name: S)
```

**Required Permission:** [`ChangeApplicationState`](./plugin-api-permissions.md)

Rename a terminal pane (changes the title displayed in the UI).

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `terminal_pane_id` | `u32` | Terminal pane ID |
| `new_name` | `impl AsRef<str>` | New name |

---

### `rename_plugin_pane`

```rust
fn rename_plugin_pane<S: AsRef<str>>(plugin_pane_id: u32, new_name: S)
```

**Required Permission:** [`ChangeApplicationState`](./plugin-api-permissions.md)

Rename a plugin pane (changes the title displayed in the UI).

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `plugin_pane_id` | `u32` | Plugin pane ID |
| `new_name` | `impl AsRef<str>` | New name |

---

### `rename_pane_with_id`

```rust
fn rename_pane_with_id<S: AsRef<str>>(pane_id: PaneId, new_name: S)
```

**Required Permission:** [`ChangeApplicationState`](./plugin-api-permissions.md)

Rename any pane by its [`PaneId`](./plugin-api-types.md#paneid). Convenience wrapper around `rename_terminal_pane` and `rename_plugin_pane`.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `pane_id` | [`PaneId`](./plugin-api-types.md#paneid) | The pane to rename |
| `new_name` | `impl AsRef<str>` | New name |

---

### `undo_rename_pane`

```rust
fn undo_rename_pane()
```

**Required Permission:** [`ChangeApplicationState`](./plugin-api-permissions.md)

Undo the last pane rename, reverting to the previous name.

---

### `toggle_focus_fullscreen`

```rust
fn toggle_focus_fullscreen()
```

**Required Permission:** [`ChangeApplicationState`](./plugin-api-permissions.md)

Toggle the focused pane to be fullscreen or normal sized.

---

### `toggle_pane_id_fullscreen`

```rust
fn toggle_pane_id_fullscreen(pane_id: PaneId)
```

**Required Permission:** [`ChangeApplicationState`](./plugin-api-permissions.md)

Toggle a specific pane to be fullscreen or normal sized.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `pane_id` | [`PaneId`](./plugin-api-types.md#paneid) | The pane to toggle |

---

### `toggle_pane_frames`

```rust
fn toggle_pane_frames()
```

**Required Permission:** [`ChangeApplicationState`](./plugin-api-permissions.md)

Toggle the UI pane frames on or off globally.

---

### `toggle_pane_embed_or_eject`

```rust
fn toggle_pane_embed_or_eject()
```

**Required Permission:** [`ChangeApplicationState`](./plugin-api-permissions.md)

Toggle the focused pane between floating and tiled (embedded) mode.

---

### `toggle_pane_embed_or_eject_for_pane_id`

```rust
fn toggle_pane_embed_or_eject_for_pane_id(pane_id: PaneId)
```

**Required Permission:** [`ChangeApplicationState`](./plugin-api-permissions.md)

Toggle a specific pane between floating and tiled (embedded) mode.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `pane_id` | [`PaneId`](./plugin-api-types.md#paneid) | The pane to toggle |

---

### `toggle_pane_borderless`

```rust
fn toggle_pane_borderless(pane_id: PaneId)
```

**Required Permission:** [`ChangeApplicationState`](./plugin-api-permissions.md)

Toggle the borderless state for a pane.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `pane_id` | [`PaneId`](./plugin-api-types.md#paneid) | The pane to toggle |

---

### `set_pane_borderless`

```rust
fn set_pane_borderless(pane_id: PaneId, borderless: bool)
```

**Required Permission:** [`ChangeApplicationState`](./plugin-api-permissions.md)

Explicitly set the borderless state for a pane.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `pane_id` | [`PaneId`](./plugin-api-types.md#paneid) | The pane to modify |
| `borderless` | `bool` | `true` for borderless, `false` for bordered |

---

### `move_pane`

```rust
fn move_pane()
```

**Required Permission:** [`ChangeApplicationState`](./plugin-api-permissions.md)

Switch the position of the focused pane with another pane.

---

### `move_pane_with_direction`

```rust
fn move_pane_with_direction(direction: Direction)
```

**Required Permission:** [`ChangeApplicationState`](./plugin-api-permissions.md)

Switch the position of the focused pane with the pane in the specified direction.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `direction` | [`Direction`](./plugin-api-types.md#direction) | `Left`, `Right`, `Up`, or `Down` |

---

### `move_pane_with_pane_id`

```rust
fn move_pane_with_pane_id(pane_id: PaneId)
```

**Required Permission:** [`ChangeApplicationState`](./plugin-api-permissions.md)

Switch the position of the specified pane with another pane.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `pane_id` | [`PaneId`](./plugin-api-types.md#paneid) | The pane to move |

---

### `move_pane_with_pane_id_in_direction`

```rust
fn move_pane_with_pane_id_in_direction(pane_id: PaneId, direction: Direction)
```

**Required Permission:** [`ChangeApplicationState`](./plugin-api-permissions.md)

Move a specific pane in the specified direction.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `pane_id` | [`PaneId`](./plugin-api-types.md#paneid) | The pane to move |
| `direction` | [`Direction`](./plugin-api-types.md#direction) | Direction to move |

---

### `replace_pane_with_existing_pane`

```rust
fn replace_pane_with_existing_pane(
    pane_id_to_replace: PaneId,
    existing_pane_id: PaneId,
    suppress_replaced_pane: bool,
)
```

**Required Permission:** [`ChangeApplicationState`](./plugin-api-permissions.md)

Replace one pane with another existing pane.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `pane_id_to_replace` | [`PaneId`](./plugin-api-types.md#paneid) | Pane to be replaced |
| `existing_pane_id` | [`PaneId`](./plugin-api-types.md#paneid) | Pane to place in the replaced position |
| `suppress_replaced_pane` | `bool` | If `true`, suppress (hide) the replaced pane instead of closing it |

---

### `set_floating_pane_pinned`

```rust
fn set_floating_pane_pinned(pane_id: PaneId, should_be_pinned: bool)
```

**Required Permission:** [`ChangeApplicationState`](./plugin-api-permissions.md)

Pin or unpin a floating pane. Pinned floating panes remain visible when toggling floating pane visibility.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `pane_id` | [`PaneId`](./plugin-api-types.md#paneid) | The floating pane |
| `should_be_pinned` | `bool` | `true` to pin, `false` to unpin |

---

### `stack_panes`

```rust
fn stack_panes(pane_ids: Vec<PaneId>)
```

**Required Permission:** [`ChangeApplicationState`](./plugin-api-permissions.md)

Stack multiple panes together into a pane stack.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `pane_ids` | `Vec<PaneId>` | Panes to stack |

---

### `change_floating_panes_coordinates`

```rust
fn change_floating_panes_coordinates(
    pane_ids_and_coordinates: Vec<(PaneId, FloatingPaneCoordinates)>,
)
```

**Required Permission:** [`ChangeApplicationState`](./plugin-api-permissions.md)

Change the position and size of floating panes.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `pane_ids_and_coordinates` | `Vec<(PaneId, FloatingPaneCoordinates)>` | Pairs of pane IDs and their new coordinates |

---

### `float_multiple_panes`

```rust
fn float_multiple_panes(pane_ids: Vec<PaneId>)
```

**Required Permission:** [`ChangeApplicationState`](./plugin-api-permissions.md)

Convert multiple tiled panes to floating panes.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `pane_ids` | `Vec<PaneId>` | Panes to float |

---

### `embed_multiple_panes`

```rust
fn embed_multiple_panes(pane_ids: Vec<PaneId>)
```

**Required Permission:** [`ChangeApplicationState`](./plugin-api-permissions.md)

Convert multiple floating panes to tiled (embedded) panes.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `pane_ids` | `Vec<PaneId>` | Panes to embed |

---

### `group_and_ungroup_panes`

```rust
fn group_and_ungroup_panes(
    pane_ids_to_group: Vec<PaneId>,
    pane_ids_to_ungroup: Vec<PaneId>,
    for_all_clients: bool,
)
```

**Required Permission:** [`ChangeApplicationState`](./plugin-api-permissions.md)

Group and/or ungroup panes for bulk selection actions.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `pane_ids_to_group` | `Vec<PaneId>` | Panes to add to a group |
| `pane_ids_to_ungroup` | `Vec<PaneId>` | Panes to remove from a group |
| `for_all_clients` | `bool` | Apply to all clients, not just the current one |

---

### `highlight_and_unhighlight_panes`

```rust
fn highlight_and_unhighlight_panes(
    pane_ids_to_highlight: Vec<PaneId>,
    pane_ids_to_unhighlight: Vec<PaneId>,
)
```

**Required Permission:** [`ChangeApplicationState`](./plugin-api-permissions.md)

Highlight or unhighlight panes in the UI.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `pane_ids_to_highlight` | `Vec<PaneId>` | Panes to highlight |
| `pane_ids_to_unhighlight` | `Vec<PaneId>` | Panes to unhighlight |

---

### `set_pane_color`

```rust
fn set_pane_color(pane_id: PaneId, fg: Option<String>, bg: Option<String>)
```

**Required Permission:** [`ChangeApplicationState`](./plugin-api-permissions.md)

Set the default foreground and/or background color of a pane.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `pane_id` | [`PaneId`](./plugin-api-types.md#paneid) | The pane to modify |
| `fg` | `Option<String>` | Foreground color (e.g., `"#00e000"`) |
| `bg` | `Option<String>` | Background color (e.g., `"#001a3a"`) |

---

## Pane Resize & Scroll

---

### `resize_focused_pane`

```rust
fn resize_focused_pane(resize: Resize)
```

**Required Permission:** [`ChangeApplicationState`](./plugin-api-permissions.md)

Increase or decrease the size of the focused pane.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `resize` | [`Resize`](./plugin-api-types.md#resize) | `Increase` or `Decrease` |

---

### `resize_focused_pane_with_direction`

```rust
fn resize_focused_pane_with_direction(resize: Resize, direction: Direction)
```

**Required Permission:** [`ChangeApplicationState`](./plugin-api-permissions.md)

Resize the focused pane in a specific direction.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `resize` | [`Resize`](./plugin-api-types.md#resize) | `Increase` or `Decrease` |
| `direction` | [`Direction`](./plugin-api-types.md#direction) | Direction to resize towards |

---

### `resize_pane_with_id`

```rust
fn resize_pane_with_id(resize_strategy: ResizeStrategy, pane_id: PaneId)
```

**Required Permission:** [`ChangeApplicationState`](./plugin-api-permissions.md)

Resize a specific pane using a full resize strategy.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `resize_strategy` | [`ResizeStrategy`](./plugin-api-types.md#resizestrategy) | Resize parameters |
| `pane_id` | [`PaneId`](./plugin-api-types.md#paneid) | The pane to resize |

---

### `scroll_up`

```rust
fn scroll_up()
```

**Required Permission:** [`ChangeApplicationState`](./plugin-api-permissions.md)

Scroll the focused pane up 1 line.

---

### `scroll_down`

```rust
fn scroll_down()
```

**Required Permission:** [`ChangeApplicationState`](./plugin-api-permissions.md)

Scroll the focused pane down 1 line.

---

### `scroll_to_top`

```rust
fn scroll_to_top()
```

**Required Permission:** [`ChangeApplicationState`](./plugin-api-permissions.md)

Scroll the focused pane to the top of the scroll buffer.

---

### `scroll_to_bottom`

```rust
fn scroll_to_bottom()
```

**Required Permission:** [`ChangeApplicationState`](./plugin-api-permissions.md)

Scroll the focused pane to the bottom of the scroll buffer.

---

### `page_scroll_up`

```rust
fn page_scroll_up()
```

**Required Permission:** [`ChangeApplicationState`](./plugin-api-permissions.md)

Scroll the focused pane up one page.

---

### `page_scroll_down`

```rust
fn page_scroll_down()
```

**Required Permission:** [`ChangeApplicationState`](./plugin-api-permissions.md)

Scroll the focused pane down one page.

---

### `scroll_up_in_pane_id`

```rust
fn scroll_up_in_pane_id(pane_id: PaneId)
```

**Required Permission:** [`ChangeApplicationState`](./plugin-api-permissions.md)

Scroll a specific pane up 1 line.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `pane_id` | [`PaneId`](./plugin-api-types.md#paneid) | The pane to scroll |

---

### `scroll_down_in_pane_id`

```rust
fn scroll_down_in_pane_id(pane_id: PaneId)
```

**Required Permission:** [`ChangeApplicationState`](./plugin-api-permissions.md)

Scroll a specific pane down 1 line.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `pane_id` | [`PaneId`](./plugin-api-types.md#paneid) | The pane to scroll |

---

### `scroll_to_top_in_pane_id`

```rust
fn scroll_to_top_in_pane_id(pane_id: PaneId)
```

**Required Permission:** [`ChangeApplicationState`](./plugin-api-permissions.md)

Scroll a specific pane to the top of the scroll buffer.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `pane_id` | [`PaneId`](./plugin-api-types.md#paneid) | The pane to scroll |

---

### `scroll_to_bottom_in_pane_id`

```rust
fn scroll_to_bottom_in_pane_id(pane_id: PaneId)
```

**Required Permission:** [`ChangeApplicationState`](./plugin-api-permissions.md)

Scroll a specific pane to the bottom of the scroll buffer.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `pane_id` | [`PaneId`](./plugin-api-types.md#paneid) | The pane to scroll |

---

### `page_scroll_up_in_pane_id`

```rust
fn page_scroll_up_in_pane_id(pane_id: PaneId)
```

**Required Permission:** [`ChangeApplicationState`](./plugin-api-permissions.md)

Scroll a specific pane up one page.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `pane_id` | [`PaneId`](./plugin-api-types.md#paneid) | The pane to scroll |

---

### `page_scroll_down_in_pane_id`

```rust
fn page_scroll_down_in_pane_id(pane_id: PaneId)
```

**Required Permission:** [`ChangeApplicationState`](./plugin-api-permissions.md)

Scroll a specific pane down one page.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `pane_id` | [`PaneId`](./plugin-api-types.md#paneid) | The pane to scroll |

---

### `edit_scrollback`

```rust
fn edit_scrollback()
```

**Required Permission:** [`ChangeApplicationState`](./plugin-api-permissions.md)

Open the scroll buffer of the focused pane in the user's default `$EDITOR`.

---

### `edit_scrollback_for_pane_with_id`

```rust
fn edit_scrollback_for_pane_with_id(pane_id: PaneId)
```

**Required Permission:** [`ChangeApplicationState`](./plugin-api-permissions.md)

Open the scroll buffer of a specific pane in the user's default `$EDITOR`. Currently only works for terminal panes.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `pane_id` | [`PaneId`](./plugin-api-types.md#paneid) | The pane whose scrollback to edit |

---

### `clear_screen`

```rust
fn clear_screen()
```

**Required Permission:** [`ChangeApplicationState`](./plugin-api-permissions.md)

Clear the scroll buffer of the focused pane.

---

### `clear_screen_for_pane_id`

```rust
fn clear_screen_for_pane_id(pane_id: PaneId)
```

**Required Permission:** [`ChangeApplicationState`](./plugin-api-permissions.md)

Clear the scroll buffer of a specific pane.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `pane_id` | [`PaneId`](./plugin-api-types.md#paneid) | The pane to clear |

---

## Writing to Panes & Signals

---

### `write`

```rust
fn write(bytes: Vec<u8>)
```

**Required Permission:** [`WriteToStdin`](./plugin-api-permissions.md)

Write raw bytes to the STDIN of the focused pane.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `bytes` | `Vec<u8>` | Raw bytes to write |

---

### `write_chars`

```rust
fn write_chars(chars: &str)
```

**Required Permission:** [`WriteToStdin`](./plugin-api-permissions.md)

Write characters to the STDIN of the focused pane.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `chars` | `&str` | Characters to write |

**Example:**

```rust
write_chars("ls -la\n");
```

---

### `write_to_pane_id`

```rust
fn write_to_pane_id(bytes: Vec<u8>, pane_id: PaneId)
```

**Required Permission:** [`WriteToStdin`](./plugin-api-permissions.md)

Write raw bytes to the STDIN of a specific pane.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `bytes` | `Vec<u8>` | Raw bytes to write |
| `pane_id` | [`PaneId`](./plugin-api-types.md#paneid) | Target pane |

---

### `write_chars_to_pane_id`

```rust
fn write_chars_to_pane_id(chars: &str, pane_id: PaneId)
```

**Required Permission:** [`WriteToStdin`](./plugin-api-permissions.md)

Write characters to the STDIN of a specific pane.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `chars` | `&str` | Characters to write |
| `pane_id` | [`PaneId`](./plugin-api-types.md#paneid) | Target pane |

---

### `copy_to_clipboard`

```rust
fn copy_to_clipboard(text: impl Into<String>)
```

**Required Permission:** [`WriteToClipboard`](./plugin-api-permissions.md)

Copy arbitrary text to the user's clipboard. Respects the user's configured clipboard destination (system clipboard or primary selection).

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `text` | `impl Into<String>` | Text to copy |

---

### `send_sigint_to_pane_id`

```rust
fn send_sigint_to_pane_id(pane_id: PaneId)
```

**Required Permission:** [`ChangeApplicationState`](./plugin-api-permissions.md)

Send SIGINT to the process running inside a terminal pane.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `pane_id` | [`PaneId`](./plugin-api-types.md#paneid) | Target terminal pane |

---

### `send_sigkill_to_pane_id`

```rust
fn send_sigkill_to_pane_id(pane_id: PaneId)
```

**Required Permission:** [`ChangeApplicationState`](./plugin-api-permissions.md)

Send SIGKILL to the process running inside a terminal pane.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `pane_id` | [`PaneId`](./plugin-api-types.md#paneid) | Target terminal pane |

---

## Input Mode & Key Management

---

### `switch_to_input_mode`

```rust
fn switch_to_input_mode(mode: &InputMode)
```

**Required Permission:** [`ChangeApplicationState`](./plugin-api-permissions.md)

Switch to the specified input mode (e.g., `Normal`, `Tab`, `Pane`).

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `mode` | `&`[`InputMode`](./plugin-api-types.md#inputmode) | The input mode to switch to |

**Example:**

```rust
switch_to_input_mode(&InputMode::Normal);
```

---

### `rebind_keys`

```rust
fn rebind_keys(
    keys_to_unbind: Vec<(InputMode, KeyWithModifier)>,
    keys_to_rebind: Vec<(InputMode, KeyWithModifier, Vec<Action>)>,
    write_config_to_disk: bool,
)
```

**Required Permission:** [`Reconfigure`](./plugin-api-permissions.md)

Rebind and/or unbind keys for the current session.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `keys_to_unbind` | `Vec<(InputMode, KeyWithModifier)>` | Keys to remove bindings for |
| `keys_to_rebind` | `Vec<(InputMode, KeyWithModifier, Vec<Action>)>` | Keys to bind to new actions |
| `write_config_to_disk` | `bool` | If `true`, persist changes to the config file |

---

### `intercept_key_presses`

```rust
fn intercept_key_presses()
```

**Required Permission:** [`InterceptInput`](./plugin-api-permissions.md)

Start intercepting key presses. Intercepted keys are delivered via the [`InterceptedKeyPress`](./plugin-api-events.md#interceptedkeypress) event rather than being processed by Zellij.

---

### `clear_key_presses_intercepts`

```rust
fn clear_key_presses_intercepts()
```

**Required Permission:** [`InterceptInput`](./plugin-api-permissions.md)

Stop intercepting key presses, returning to normal key handling.

---

## Layout Management

---

### `dump_layout`

```rust
fn dump_layout(layout_name: &str) -> Result<String, String>
```

**Required Permission:** [`ReadApplicationState`](./plugin-api-permissions.md)

Get a layout's KDL content by name. Supports both built-in layouts (e.g., `"default"`, `"compact"`, `"welcome"`) and custom layouts from the layout directory.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `layout_name` | `&str` | Name of the layout |

**Returns:** `Result<String, String>` - the KDL layout string on success

---

### `dump_session_layout`

```rust
fn dump_session_layout() -> Result<(String, Option<LayoutMetadata>), String>
```

**Required Permission:** [`ReadApplicationState`](./plugin-api-permissions.md)

Get the current session layout as a KDL string, along with optional metadata. The requesting plugin is removed from the dumped layout.

**Returns:** `Result<(String, Option<`[`LayoutMetadata`](./plugin-api-types.md#layoutmetadata)`>), String>`

---

### `dump_session_layout_for_tab`

```rust
fn dump_session_layout_for_tab(
    tab_index: usize,
) -> Result<(String, Option<LayoutMetadata>), String>
```

**Required Permission:** [`ReadApplicationState`](./plugin-api-permissions.md)

Get the layout for a specific tab as a KDL string.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `tab_index` | `usize` | Tab position index |

**Returns:** `Result<(String, Option<LayoutMetadata>), String>`

---

### `parse_layout`

```rust
fn parse_layout(layout_string: &str) -> Result<LayoutMetadata, LayoutParsingError>
```

**Required Permission:** [`ReadApplicationState`](./plugin-api-permissions.md)

Parse a KDL layout string and return its metadata without applying it.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `layout_string` | `&str` | KDL layout string to parse |

**Returns:** `Result<`[`LayoutMetadata`](./plugin-api-types.md#layoutmetadata)`, LayoutParsingError>`

---

### `save_layout`

```rust
fn save_layout<S: AsRef<str>>(
    layout_name: S,
    layout_kdl: S,
    overwrite: bool,
) -> Result<(), String>
```

**Required Permission:** [`ChangeApplicationState`](./plugin-api-permissions.md)

Save a KDL layout to the user's layout directory.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `layout_name` | `impl AsRef<str>` | Name for the layout file |
| `layout_kdl` | `impl AsRef<str>` | KDL layout content |
| `overwrite` | `bool` | If `true`, overwrite existing file; if `false`, fail if file exists |

**Returns:** `Result<(), String>` - `Ok(())` on success

---

### `delete_layout`

```rust
fn delete_layout<S: AsRef<str>>(layout_name: S) -> Result<(), String>
```

**Required Permission:** [`ChangeApplicationState`](./plugin-api-permissions.md)

Delete a layout file from the user's layout directory.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `layout_name` | `impl AsRef<str>` | Name of the layout to delete |

**Returns:** `Result<(), String>` - `Ok(())` on success

---

### `rename_layout`

```rust
fn rename_layout(
    old_layout_name: impl Into<String>,
    new_layout_name: impl Into<String>,
) -> Result<(), String>
```

**Required Permission:** [`ChangeApplicationState`](./plugin-api-permissions.md)

Rename a layout file in the user's layout directory.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `old_layout_name` | `impl Into<String>` | Current layout name |
| `new_layout_name` | `impl Into<String>` | New layout name |

**Returns:** `Result<(), String>` - `Ok(())` on success

---

### `edit_layout`

```rust
fn edit_layout<S: AsRef<str>>(
    layout_name: S,
    context: BTreeMap<String, String>,
) -> Result<(), String>
```

**Required Permission:** [`ChangeApplicationState`](./plugin-api-permissions.md)

Open a layout file in the user's default `$EDITOR`.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `layout_name` | `impl AsRef<str>` | Name of the layout to edit |
| `context` | `BTreeMap<String, String>` | Arbitrary context for event callbacks |

**Returns:** `Result<(), String>` - `Ok(())` on success

---

### `override_layout`

```rust
fn override_layout<L: AsRef<LayoutInfo>>(
    layout_info: L,
    retain_existing_terminal_panes: bool,
    retain_existing_plugin_panes: bool,
    apply_only_to_active_tab: bool,
    context: BTreeMap<String, String>,
)
```

**Required Permission:** [`ChangeApplicationState`](./plugin-api-permissions.md)

Override the current layout with a new one.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `layout_info` | `impl AsRef<LayoutInfo>` | New layout to apply |
| `retain_existing_terminal_panes` | `bool` | Keep existing terminal panes |
| `retain_existing_plugin_panes` | `bool` | Keep existing plugin panes |
| `apply_only_to_active_tab` | `bool` | Only apply to the active tab |
| `context` | `BTreeMap<String, String>` | Arbitrary context |

---

### `previous_swap_layout`

```rust
fn previous_swap_layout()
```

**Required Permission:** [`ChangeApplicationState`](./plugin-api-permissions.md)

Switch to the previous [swap layout](./swap-layouts.md).

---

### `next_swap_layout`

```rust
fn next_swap_layout()
```

**Required Permission:** [`ChangeApplicationState`](./plugin-api-permissions.md)

Switch to the next [swap layout](./swap-layouts.md).

---

## Background Command Execution & Web Requests

---

### `run_command`

```rust
fn run_command(cmd: &[&str], context: BTreeMap<String, String>)
```

**Required Permission:** [`RunCommands`](./plugin-api-permissions.md)

Run a command in the background on the host machine. Results are delivered via the [`RunCommandResult`](./plugin-api-events.md#runcommandresult) event if subscribed.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `cmd` | `&[&str]` | Command and arguments (first element is the command) |
| `context` | `BTreeMap<String, String>` | Arbitrary context returned with the result event |

**Example:**

```rust
subscribe(&[EventType::RunCommandResult]);
let mut context = BTreeMap::new();
context.insert("request_id".to_string(), "git-status".to_string());
run_command(&["git", "status", "--porcelain"], context);
```

---

### `run_command_with_env_variables_and_cwd`

```rust
fn run_command_with_env_variables_and_cwd(
    cmd: &[&str],
    env_variables: BTreeMap<String, String>,
    cwd: PathBuf,
    context: BTreeMap<String, String>,
)
```

**Required Permission:** [`RunCommands`](./plugin-api-permissions.md)

Run a command in the background with specific environment variables and working directory.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `cmd` | `&[&str]` | Command and arguments |
| `env_variables` | `BTreeMap<String, String>` | Environment variables for the command |
| `cwd` | `PathBuf` | Working directory |
| `context` | `BTreeMap<String, String>` | Arbitrary context returned with the result event |

---

### `web_request`

```rust
fn web_request<S: AsRef<str>>(
    url: S,
    verb: HttpVerb,
    headers: BTreeMap<String, String>,
    body: Vec<u8>,
    context: BTreeMap<String, String>,
)
```

**Required Permission:** [`WebAccess`](./plugin-api-permissions.md)

Make an HTTP request. Results are delivered via the [`WebRequestResult`](./plugin-api-events.md#webrequestresult) event if subscribed.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `url` | `impl AsRef<str>` | Request URL |
| `verb` | [`HttpVerb`](./plugin-api-types.md#httpverb) | HTTP method (`Get`, `Post`, `Put`, `Delete`) |
| `headers` | `BTreeMap<String, String>` | Request headers |
| `body` | `Vec<u8>` | Request body |
| `context` | `BTreeMap<String, String>` | Arbitrary context returned with the result event |

**Example:**

```rust
subscribe(&[EventType::WebRequestResult]);
let mut headers = BTreeMap::new();
headers.insert("Accept".to_string(), "application/json".to_string());
let mut context = BTreeMap::new();
context.insert("request_id".to_string(), "api-call".to_string());
web_request(
    "https://api.example.com/data",
    HttpVerb::Get,
    headers,
    vec![],
    context,
);
```

---

### `set_timeout`

```rust
fn set_timeout(secs: f64)
```

Set a timer. After the specified duration, the plugin's [`update`](./plugin-lifecycle.md#update) method will be called with the [`Timer`](./plugin-api-events.md#timer) event. The plugin must subscribe to `EventType::Timer` beforehand.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `secs` | `f64` | Duration in seconds (supports fractions, e.g., `0.5`) |

**Example:**

```rust
subscribe(&[EventType::Timer]);
set_timeout(2.0); // Fire after 2 seconds
```

---

## Plugin Communication

---

### `post_message_to`

```rust
fn post_message_to(plugin_message: PluginMessage)
```

Post a message to one of this plugin's workers. See [Workers for Async Tasks](./plugin-api-workers.md) for details.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `plugin_message` | [`PluginMessage`](./plugin-api-types.md#pluginmessage) | Message with worker name, message name, and payload |

**Example:**

```rust
post_message_to(PluginMessage {
    name: "fetch_data".to_string(),
    payload: "https://example.com".to_string(),
    worker_name: Some("background_worker".to_string()),
});
```

---

### `post_message_to_plugin`

```rust
fn post_message_to_plugin(plugin_message: PluginMessage)
```

Post a message back to this plugin's `update` method as a [`CustomMessage`](./plugin-api-events.md#custommessage) event. Typically used by workers to send results back to the main plugin.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `plugin_message` | [`PluginMessage`](./plugin-api-types.md#pluginmessage) | Message with name and payload |

---

### `pipe_message_to_plugin`

```rust
fn pipe_message_to_plugin(message_to_plugin: MessageToPlugin)
```

**Required Permission:** [`MessageAndLaunchOtherPlugins`](./plugin-api-permissions.md)

Send a message to another plugin. If the target plugin is not running, it will be launched.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `message_to_plugin` | [`MessageToPlugin`](./plugin-api-types.md#messagetoplugin) | Message specification including target plugin URL/ID, message content, and launch configuration |

**Example:**

```rust
pipe_message_to_plugin(MessageToPlugin {
    plugin_url: Some("file:/path/to/other-plugin.wasm".to_string()),
    destination_plugin_id: None,
    plugin_config: BTreeMap::new(),
    message_name: "process_data".to_string(),
    message_payload: Some("payload content".to_string()),
    message_args: BTreeMap::new(),
    new_plugin_args: None,
    floating_pane_coordinates: None,
});
```

---

### `report_panic`

```rust
fn report_panic(info: &std::panic::PanicHookInfo)
```

Report a panic to Zellij for error display. Typically used inside a custom panic hook.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `info` | `&std::panic::PanicHookInfo` | The panic information |

**Example:**

```rust
std::panic::set_hook(Box::new(|info| {
    report_panic(info);
}));
```

---

## CLI Pipe Management

For more details, see [Pipes for communicating with and between plugins](./plugin-pipes.md).

---

### `unblock_cli_pipe_input`

```rust
fn unblock_cli_pipe_input(pipe_name: &str)
```

**Required Permission:** [`ReadCliPipes`](./plugin-api-permissions.md)

Unblock the input side of a pipe, requesting the next message to be sent if one is available.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `pipe_name` | `&str` | Name of the pipe |

---

### `block_cli_pipe_input`

```rust
fn block_cli_pipe_input(pipe_name: &str)
```

**Required Permission:** [`ReadCliPipes`](./plugin-api-permissions.md)

Block the input side of a pipe. The pipe will remain blocked until explicitly unblocked by this or another plugin.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `pipe_name` | `&str` | Name of the pipe |

---

### `cli_pipe_output`

```rust
fn cli_pipe_output(pipe_name: &str, output: &str)
```

**Required Permission:** [`ReadCliPipes`](./plugin-api-permissions.md)

Send output to the output side of a pipe. This does not affect the input side of the same pipe.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `pipe_name` | `&str` | Name of the pipe |
| `output` | `&str` | Output content |

---

## Plugin Lifecycle

---

### `start_or_reload_plugin`

```rust
fn start_or_reload_plugin(url: &str)
```

**Required Permission:** [`OpenTerminalsOrPlugins`](./plugin-api-permissions.md)

Start a plugin by URL, or reload it if already running.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `url` | `&str` | Plugin URL (e.g., `"file:/path/to/plugin.wasm"`) |

---

### `reload_plugin_with_id`

```rust
fn reload_plugin_with_id(plugin_id: u32)
```

**Required Permission:** [`OpenTerminalsOrPlugins`](./plugin-api-permissions.md)

Reload a running plugin by its ID.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `plugin_id` | `u32` | Plugin ID to reload |

---

### `load_new_plugin`

```rust
fn load_new_plugin<S: AsRef<str>>(
    url: S,
    config: BTreeMap<String, String>,
    load_in_background: bool,
    skip_plugin_cache: bool,
)
```

**Required Permission:** [`OpenTerminalsOrPlugins`](./plugin-api-permissions.md)

Load a new plugin instance.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `url` | `impl AsRef<str>` | Plugin URL |
| `config` | `BTreeMap<String, String>` | Plugin configuration |
| `load_in_background` | `bool` | If `true`, load suppressed (hidden) |
| `skip_plugin_cache` | `bool` | If `true`, force a fresh load |

---

## Configuration & Host

---

### `reconfigure`

```rust
fn reconfigure(new_config: String, save_configuration_file: bool)
```

**Required Permission:** [`Reconfigure`](./plugin-api-permissions.md)

Change the Zellij runtime configuration for the current session. The configuration is provided as a KDL string.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `new_config` | `String` | KDL configuration string |
| `save_configuration_file` | `bool` | If `true`, persist the configuration change to disk |

**Example:**

```rust
reconfigure(r#"
    theme "catppuccin-mocha"
    pane_frames false
"#.to_string(), false);
```

---

### `change_host_folder`

```rust
fn change_host_folder(new_host_folder: PathBuf)
```

**Required Permission:** [`ChangeApplicationState`](./plugin-api-permissions.md)

Change the host folder (working directory) for the session.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `new_host_folder` | `PathBuf` | New working directory path |

---

### `scan_host_folder`

```rust
fn scan_host_folder<S: AsRef<Path>>(folder_to_scan: &S)
```

Scan a specific folder in the host filesystem. This is a performance optimization to work around WASI runtime limitations. Does not follow symlinks.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `folder_to_scan` | `impl AsRef<Path>` | Folder path to scan |

---

### `watch_filesystem`

```rust
fn watch_filesystem()
```

Start watching the host folder for filesystem changes. File change events ([`FileSystemCreate`](./plugin-api-events.md#filesystemcreate), [`FileSystemUpdate`](./plugin-api-events.md#filesystemupdate), [`FileSystemDelete`](./plugin-api-events.md#filesystemdelete)) will be delivered to the plugin.

---

## Web Server & Sharing

---

### `start_web_server`

```rust
fn start_web_server()
```

**Required Permission:** [`StartWebServer`](./plugin-api-permissions.md)

Start a local web server for serving Zellij sessions to web clients.

---

### `stop_web_server`

```rust
fn stop_web_server()
```

**Required Permission:** [`StartWebServer`](./plugin-api-permissions.md)

Stop the local web server.

---

### `query_web_server_status`

```rust
fn query_web_server_status()
```

**Required Permission:** [`StartWebServer`](./plugin-api-permissions.md)

Query the current status of the web server. Results are delivered via the [`WebServerStatus`](./plugin-api-events.md#webserverstatus) event.

---

### `share_current_session`

```rust
fn share_current_session()
```

**Required Permission:** [`StartWebServer`](./plugin-api-permissions.md)

Share the current session via the web server.

---

### `stop_sharing_current_session`

```rust
fn stop_sharing_current_session()
```

**Required Permission:** [`StartWebServer`](./plugin-api-permissions.md)

Stop sharing the current session.

---

### `generate_web_login_token`

```rust
fn generate_web_login_token(
    token_label: Option<String>,
    read_only: bool,
) -> Result<String, String>
```

**Required Permission:** [`StartWebServer`](./plugin-api-permissions.md)

Generate a web login token for authenticating web clients.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `token_label` | `Option<String>` | Optional label for the token |
| `read_only` | `bool` | If `true`, the token grants read-only access |

**Returns:** `Result<String, String>` - the generated token string

---

### `revoke_web_login_token`

```rust
fn revoke_web_login_token(token_label: &str) -> Result<(), String>
```

**Required Permission:** [`StartWebServer`](./plugin-api-permissions.md)

Revoke a web login token by its label.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `token_label` | `&str` | Label of the token to revoke |

**Returns:** `Result<(), String>` - `Ok(())` on success

---

### `list_web_login_tokens`

```rust
fn list_web_login_tokens() -> Result<Vec<(String, String, bool)>, String>
```

**Required Permission:** [`StartWebServer`](./plugin-api-permissions.md)

List all web login tokens.

**Returns:** `Result<Vec<(String, String, bool)>, String>` - list of `(label, created_at, read_only)` tuples

---

### `revoke_all_web_tokens`

```rust
fn revoke_all_web_tokens() -> Result<(), String>
```

**Required Permission:** [`StartWebServer`](./plugin-api-permissions.md)

Revoke all web login tokens.

**Returns:** `Result<(), String>` - `Ok(())` on success

---

### `rename_web_token`

```rust
fn rename_web_token(old_name: &str, new_name: &str) -> Result<(), String>
```

**Required Permission:** [`StartWebServer`](./plugin-api-permissions.md)

Rename a web login token.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `old_name` | `&str` | Current token label |
| `new_name` | `&str` | New token label |

**Returns:** `Result<(), String>` - `Ok(())` on success

---

## Regex Highlights

---

### `set_pane_regex_highlights`

```rust
fn set_pane_regex_highlights(pane_id: PaneId, highlights: Vec<RegexHighlight>)
```

**Required Permission:** [`ChangeApplicationState`](./plugin-api-permissions.md)

Set or update regex-based content highlights for a pane. Highlights are matched against the pane's terminal output and rendered with the specified styles. When the user clicks on a highlight, a [`HighlightClicked`](./plugin-api-events.md#highlightclicked) event is delivered.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `pane_id` | [`PaneId`](./plugin-api-types.md#paneid) | The pane to apply highlights to |
| `highlights` | `Vec<`[`RegexHighlight`](./plugin-api-types.md#regexhighlight)`>` | Highlight specifications |

**Example:**

```rust
set_pane_regex_highlights(PaneId::Terminal(1), vec![
    RegexHighlight {
        pattern: r"https?://\S+".to_string(),
        style: HighlightStyle::Emphasis0,
        layer: HighlightLayer::Hint,
        context: BTreeMap::new(),
        on_hover: false,
        bold: false,
        italic: false,
        underline: true,
        tooltip_text: Some("Click to open URL".to_string()),
    },
]);
```

---

### `clear_pane_highlights`

```rust
fn clear_pane_highlights(pane_id: PaneId)
```

**Required Permission:** [`ChangeApplicationState`](./plugin-api-permissions.md)

Remove all regex highlights that this plugin set on a pane.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `pane_id` | [`PaneId`](./plugin-api-types.md#paneid) | The pane to clear highlights from |

---

## Action Execution

---

### `run_action`

```rust
fn run_action(action: Action, context: BTreeMap<String, String>)
```

**Required Permission:** [`RunActionsAsUser`](./plugin-api-permissions.md)

Run an arbitrary Zellij [`Action`](./plugin-api-types.md#action) programmatically. This provides access to the full set of Zellij actions, including those not exposed through dedicated plugin commands.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `action` | [`Action`](./plugin-api-types.md#action) | The action to execute |
| `context` | `BTreeMap<String, String>` | Arbitrary context returned with the `ActionComplete` event |

**Example:**

```rust
use zellij_tile::prelude::*;

// Toggle floating panes
run_action(Action::ToggleFloatingPanes, BTreeMap::new());

// Switch to a specific input mode
run_action(
    Action::SwitchToMode { input_mode: InputMode::Pane },
    BTreeMap::new(),
);
```

---

## Utility Functions

These are local helper functions that do not communicate with the Zellij host. They operate on data already available to the plugin.

---

### `get_focused_tab`

```rust
fn get_focused_tab(tab_infos: &Vec<TabInfo>) -> Option<TabInfo>
```

Extract the active (focused) tab from a list of tab information. This is a local helper that does not make a host call.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `tab_infos` | `&Vec<TabInfo>` | List of tab information (from a `TabUpdate` event) |

**Returns:** `Option<`[`TabInfo`](./plugin-api-types.md#tabinfo)`>` - the focused tab, or `None` if none is focused

**Example:**

```rust
fn update(&mut self, event: Event) -> bool {
    match event {
        Event::TabUpdate(tabs) => {
            if let Some(focused) = get_focused_tab(&tabs) {
                eprintln!("Active tab: {}", focused.name);
            }
            true
        },
        _ => false,
    }
}
```

---

### `get_focused_pane`

```rust
fn get_focused_pane(tab_position: usize, pane_manifest: &PaneManifest) -> Option<PaneInfo>
```

Extract the focused non-plugin pane from a pane manifest for a given tab. This is a local helper that does not make a host call.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `tab_position` | `usize` | Tab position (0-indexed) |
| `pane_manifest` | `&PaneManifest` | Pane manifest (from a `PaneUpdate` event) |

**Returns:** `Option<`[`PaneInfo`](./plugin-api-types.md#paneinfo)`>` - the focused pane, or `None`
