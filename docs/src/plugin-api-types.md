# Plugin API - Type Reference

This page documents the key data types used throughout the Zellij plugin API. These types are used as parameters and return values in [plugin commands](./plugin-api-commands.md) and as payloads in [plugin events](./plugin-api-events.md).

For the complete type definitions, see the [`zellij-tile`](https://docs.rs/zellij-tile/latest/zellij_tile/) API documentation.

All types listed here are available via `use zellij_tile::prelude::*;`.

---

## Table of Contents

- [PaneId](#paneid)
- [FileToOpen](#filetoopen)
- [CommandToRun](#commandtorun)
- [FloatingPaneCoordinates](#floatingpanecoordinates)
- [PercentOrFixed](#percentorfixed)
- [PluginIds](#pluginids)
- [PluginMessage](#pluginmessage)
- [MessageToPlugin](#messagetoplugin)
- [NewPluginArgs](#newpluginargs)
- [ResizeStrategy](#resizestrategy)
- [Resize](#resize)
- [Direction](#direction)
- [InputMode](#inputmode)
- [HttpVerb](#httpverb)
- [RegexHighlight](#regexhighlight)
- [HighlightStyle](#highlightstyle)
- [HighlightLayer](#highlightlayer)
- [PaneContents](#panecontents)
- [LayoutInfo](#layoutinfo)
- [LayoutMetadata](#layoutmetadata)
- [KeyWithModifier](#keywithmodifier)
- [TabInfo](#tabinfo)
- [PaneInfo](#paneinfo)
- [PaneManifest](#panemanifest)
- [SessionInfo](#sessioninfo)
- [ClientInfo](#clientinfo)
- [ModeInfo](#modeinfo)
- [Mouse](#mouse)
- [CopyDestination](#copydestination)
- [PermissionType](#permissiontype)
- [PermissionStatus](#permissionstatus)
- [WebServerStatus](#webserverstatus)
- [FileMetadata](#filemetadata)
- [ConnectToSession](#connecttosession)
- [Action](#action)
- [EventType](#eventtype)

---

## `PaneId`

Uniquely identifies a pane across the session. A pane is either a terminal or a plugin.

```rust
pub enum PaneId {
    Terminal(u32),
    Plugin(u32),
}
```

**Example:**

```rust
let terminal_pane = PaneId::Terminal(1);
let plugin_pane = PaneId::Plugin(0);

match pane_id {
    PaneId::Terminal(id) => { /* terminal pane */ },
    PaneId::Plugin(id) => { /* plugin pane */ },
}
```

---

## `FileToOpen`

Specifies a file to open in the user's `$EDITOR`, with optional line number and working directory.

```rust
pub struct FileToOpen {
    pub path: PathBuf,
    pub line_number: Option<usize>,
    pub cwd: Option<PathBuf>,
}
```

| Field | Type | Description |
|-------|------|-------------|
| `path` | `PathBuf` | Path to the file to open |
| `line_number` | `Option<usize>` | Optional line number to jump to (if the editor supports it) |
| `cwd` | `Option<PathBuf>` | Optional working directory for the editor process |

**Example:**

```rust
let file = FileToOpen {
    path: PathBuf::from("/home/user/project/src/main.rs"),
    line_number: Some(42),
    cwd: None,
};
open_file(file, BTreeMap::new());
```

---

## `CommandToRun`

Specifies a command to execute in a command pane.

```rust
pub struct CommandToRun {
    pub path: PathBuf,
    pub args: Vec<String>,
    pub cwd: Option<PathBuf>,
}
```

| Field | Type | Description |
|-------|------|-------------|
| `path` | `PathBuf` | Path to the executable |
| `args` | `Vec<String>` | Command-line arguments |
| `cwd` | `Option<PathBuf>` | Optional working directory |

**Example:**

```rust
let cmd = CommandToRun {
    path: PathBuf::from("cargo"),
    args: vec!["build".to_string(), "--release".to_string()],
    cwd: Some(PathBuf::from("/home/user/project")),
};
open_command_pane(cmd, BTreeMap::new());
```

---

## `FloatingPaneCoordinates`

Specifies the position and size of a floating pane.

```rust
pub struct FloatingPaneCoordinates {
    pub x: Option<PercentOrFixed>,
    pub y: Option<PercentOrFixed>,
    pub width: Option<PercentOrFixed>,
    pub height: Option<PercentOrFixed>,
    pub pinned: Option<bool>,
    pub borderless: Option<bool>,
}
```

| Field | Type | Description |
|-------|------|-------------|
| `x` | `Option<PercentOrFixed>` | Horizontal position (columns from left) |
| `y` | `Option<PercentOrFixed>` | Vertical position (rows from top) |
| `width` | `Option<PercentOrFixed>` | Width of the pane |
| `height` | `Option<PercentOrFixed>` | Height of the pane |
| `pinned` | `Option<bool>` | Whether the floating pane is pinned (stays visible when toggling floating panes) |
| `borderless` | `Option<bool>` | Whether the pane border is hidden |

All fields are optional. When `None`, Zellij uses its default placement logic.

---

## `PercentOrFixed`

Specifies a dimension as either a percentage or a fixed number of rows/columns.

```rust
pub enum PercentOrFixed {
    Percent(usize),  // 1 to 100
    Fixed(usize),    // absolute number of columns or rows
}
```

**Example:**

```rust
let coords = FloatingPaneCoordinates {
    x: Some(PercentOrFixed::Percent(10)),
    y: Some(PercentOrFixed::Fixed(5)),
    width: Some(PercentOrFixed::Percent(80)),
    height: Some(PercentOrFixed::Fixed(20)),
    pinned: Some(true),
    borderless: None,
};
```

---

## `PluginIds`

Contains identifying information for the current plugin instance.

```rust
pub struct PluginIds {
    pub plugin_id: u32,
    pub zellij_pid: u32,
    pub initial_cwd: PathBuf,
    pub client_id: ClientId,
}
```

| Field | Type | Description |
|-------|------|-------------|
| `plugin_id` | `u32` | Unique identifier for this plugin pane |
| `zellij_pid` | `u32` | Process ID of the Zellij server |
| `initial_cwd` | `PathBuf` | Working directory when the plugin was loaded |
| `client_id` | `ClientId` | The client that loaded this plugin (`u16`) |

---

## `PluginMessage`

A message for communication between a plugin and its workers.

```rust
pub struct PluginMessage {
    pub name: String,
    pub payload: String,
    pub worker_name: Option<String>,
}
```

| Field | Type | Description |
|-------|------|-------------|
| `name` | `String` | Message identifier/type |
| `payload` | `String` | Message content |
| `worker_name` | `Option<String>` | Target worker name (used with `post_message_to`) |

See [Workers for Async Tasks](./plugin-api-workers.md) for usage details.

---

## `MessageToPlugin`

A message destined for another plugin instance (potentially launching it).

```rust
pub struct MessageToPlugin {
    pub plugin_url: Option<String>,
    pub destination_plugin_id: Option<u32>,
    pub plugin_config: BTreeMap<String, String>,
    pub message_name: String,
    pub message_payload: Option<String>,
    pub message_args: BTreeMap<String, String>,
    pub new_plugin_args: Option<NewPluginArgs>,
    pub floating_pane_coordinates: Option<FloatingPaneCoordinates>,
}
```

| Field | Type | Description |
|-------|------|-------------|
| `plugin_url` | `Option<String>` | URL of the target plugin (e.g., `"file:/path/to/plugin.wasm"`) |
| `destination_plugin_id` | `Option<u32>` | ID of a specific running plugin instance |
| `plugin_config` | `BTreeMap<String, String>` | Configuration to match or provide to the target plugin |
| `message_name` | `String` | Message identifier |
| `message_payload` | `Option<String>` | Optional message content |
| `message_args` | `BTreeMap<String, String>` | Additional key-value arguments |
| `new_plugin_args` | `Option<NewPluginArgs>` | Configuration for launching a new plugin if none is running |
| `floating_pane_coordinates` | `Option<FloatingPaneCoordinates>` | Position for newly launched plugin pane |

---

## `NewPluginArgs`

Configuration for launching a new plugin instance when the target of a message is not already running.

```rust
pub struct NewPluginArgs {
    pub should_float: Option<bool>,
    pub pane_id_to_replace: Option<PaneId>,
    pub pane_title: Option<String>,
    pub cwd: Option<PathBuf>,
    pub skip_cache: bool,
    pub should_focus: Option<bool>,
}
```

| Field | Type | Description |
|-------|------|-------------|
| `should_float` | `Option<bool>` | Whether the new pane should float |
| `pane_id_to_replace` | `Option<PaneId>` | Pane to replace with the new plugin |
| `pane_title` | `Option<String>` | Title for the new pane |
| `cwd` | `Option<PathBuf>` | Working directory for the new plugin |
| `skip_cache` | `bool` | Whether to skip the plugin cache (force reload) |
| `should_focus` | `Option<bool>` | Whether the new pane should receive focus |

---

## `ResizeStrategy`

Describes how a pane should be resized, including direction and boundary behavior.

```rust
pub struct ResizeStrategy {
    pub resize: Resize,
    pub direction: Option<Direction>,
    pub invert_on_boundaries: bool,
}
```

| Field | Type | Description |
|-------|------|-------------|
| `resize` | [`Resize`](#resize) | Whether to increase or decrease the pane area |
| `direction` | `Option<`[`Direction`](#direction)`>` | Which border to move (`None` = all borders equally) |
| `invert_on_boundaries` | `bool` | If `true` (default), resize inverts when hitting viewport boundaries |

---

## `Resize`

The direction of a resize operation.

```rust
pub enum Resize {
    Increase,
    Decrease,
}
```

---

## `Direction`

A cardinal direction used for focus movement, pane movement, and resizing.

```rust
pub enum Direction {
    Left,
    Right,
    Up,
    Down,
}
```

---

## `InputMode`

Describes the different input modes, which change the way keystrokes are interpreted.

```rust
pub enum InputMode {
    Normal,
    Locked,
    Resize,
    Pane,
    Tab,
    Scroll,
    EnterSearch,
    Search,
    RenameTab,
    RenamePane,
    Session,
    Move,
    Prompt,
    Tmux,
}
```

| Variant | Description |
|---------|-------------|
| `Normal` | Input is written to the terminal, except for mode-switching shortcuts |
| `Locked` | All input goes to the terminal; all shortcuts disabled except the one to return to Normal |
| `Resize` | Allows resizing panes |
| `Pane` | Allows creating, closing, and navigating between panes |
| `Tab` | Allows creating, closing, and navigating between tabs |
| `Scroll` | Allows scrolling up and down within a pane |
| `EnterSearch` | Allows typing a search needle for the scroll buffer |
| `Search` | Allows searching within a pane (superset of Scroll) |
| `RenameTab` | Allows assigning a new name to a tab |
| `RenamePane` | Allows assigning a new name to a pane |
| `Session` | Allows detaching and session management |
| `Move` | Allows moving panes within a tab |
| `Prompt` | Allows interacting with active prompts |
| `Tmux` | Provides basic tmux keybinding compatibility |

---

## `HttpVerb`

HTTP method for web requests.

```rust
pub enum HttpVerb {
    Get,
    Post,
    Put,
    Delete,
}
```

---

## `RegexHighlight`

Defines a regex-based content highlight that a plugin can apply to a terminal pane.

```rust
pub struct RegexHighlight {
    pub pattern: String,
    pub style: HighlightStyle,
    pub layer: HighlightLayer,
    pub context: BTreeMap<String, String>,
    pub on_hover: bool,
    pub bold: bool,
    pub italic: bool,
    pub underline: bool,
    pub tooltip_text: Option<String>,
}
```

| Field | Type | Description |
|-------|------|-------------|
| `pattern` | `String` | Regex pattern to match against pane content |
| `style` | [`HighlightStyle`](#highlightstyle) | Color scheme for matched text |
| `layer` | [`HighlightLayer`](#highlightlayer) | Priority layer for overlapping highlights |
| `context` | `BTreeMap<String, String>` | Arbitrary data echoed back on click via `HighlightClicked` event |
| `on_hover` | `bool` | If `true`, highlight only renders when the cursor overlaps the match |
| `bold` | `bool` | Render matched text in bold |
| `italic` | `bool` | Render matched text in italic |
| `underline` | `bool` | Render matched text with underline |
| `tooltip_text` | `Option<String>` | Text shown at the bottom of the pane frame when hovering over the match |

---

## `HighlightStyle`

Color scheme for a regex highlight. Theme-based variants reference colors from the active theme.

```rust
pub enum HighlightStyle {
    None,
    Emphasis0,
    Emphasis1,
    Emphasis2,
    Emphasis3,
    BackgroundEmphasis0,
    BackgroundEmphasis1,
    BackgroundEmphasis2,
    BackgroundEmphasis3,
    CustomRgb {
        fg: Option<(u8, u8, u8)>,
        bg: Option<(u8, u8, u8)>,
    },
    CustomIndex {
        fg: Option<u8>,
        bg: Option<u8>,
    },
}
```

| Variant | Description |
|---------|-------------|
| `None` | No color override (use with bold/italic/underline for style-only highlights) |
| `Emphasis0`..`Emphasis3` | Foreground set to theme emphasis color 0-3, no background override |
| `BackgroundEmphasis0`..`BackgroundEmphasis3` | Background set to theme emphasis color 0-3, foreground set to background color |
| `CustomRgb` | Custom foreground and/or background as RGB tuples |
| `CustomIndex` | Custom foreground and/or background as terminal color indices (0-255) |

---

## `HighlightLayer`

Priority layer for plugin-supplied regex highlights. Higher-priority layers take visual precedence over lower ones when highlights overlap. Built-in highlights (mouse selection, search results) always take precedence over all plugin layers.

```rust
pub enum HighlightLayer {
    Hint,
    Tool,
    ActionFeedback,
}
```

| Variant | Priority | Description |
|---------|----------|-------------|
| `Hint` | Lowest | Pure pattern matching (paths, URLs, IPs) |
| `Tool` | Middle | Backed by runtime domain knowledge (git, docker, k8s) |
| `ActionFeedback` | Highest | Result of an explicit user action (search, bookmarks) |

---

## `PaneContents`

The text contents of a pane, including viewport and scrollback.

```rust
pub struct PaneContents {
    pub lines_above_viewport: Vec<String>,
    pub lines_below_viewport: Vec<String>,
    pub viewport: Vec<String>,
    pub selected_text: Option<SelectedText>,
}
```

| Field | Type | Description |
|-------|------|-------------|
| `lines_above_viewport` | `Vec<String>` | Lines above the current viewport (only populated if full scrollback is requested) |
| `lines_below_viewport` | `Vec<String>` | Lines below the current viewport (only populated if full scrollback is requested) |
| `viewport` | `Vec<String>` | Currently visible lines |
| `selected_text` | `Option<SelectedText>` | Currently selected text range, if any |

**Note:** `lines_above_viewport` and `lines_below_viewport` are only populated when explicitly requested (e.g., with `get_full_scrollback: true` in `get_pane_scrollback`). This is for performance reasons.

---

## `LayoutInfo`

Identifies a layout by its source.

```rust
pub enum LayoutInfo {
    BuiltIn(String),
    File(String, LayoutMetadata),
    Url(String),
    Stringified(String),
}
```

| Variant | Description |
|---------|-------------|
| `BuiltIn(name)` | A built-in layout (e.g., `"default"`, `"compact"`, `"welcome"`) |
| `File(name, metadata)` | A layout file from the layout directory, with parsed metadata |
| `Url(url)` | A layout loaded from a URL |
| `Stringified(kdl)` | A raw KDL layout string |

---

## `LayoutMetadata`

Parsed metadata about a layout's structure.

```rust
pub struct LayoutMetadata {
    pub tabs: Vec<TabMetadata>,
    pub creation_time: String,
    pub update_time: String,
}
```

| Field | Type | Description |
|-------|------|-------------|
| `tabs` | `Vec<TabMetadata>` | Metadata for each tab defined in the layout |
| `creation_time` | `String` | When the layout was created |
| `update_time` | `String` | When the layout was last updated |

---

## `KeyWithModifier`

A keyboard key combined with zero or more modifier keys.

```rust
pub struct KeyWithModifier {
    pub bare_key: BareKey,
    pub key_modifiers: BTreeSet<KeyModifier>,
}
```

| Field | Type | Description |
|-------|------|-------------|
| `bare_key` | `BareKey` | The base key (e.g., `BareKey::Char('a')`, `BareKey::Enter`, `BareKey::F(1)`) |
| `key_modifiers` | `BTreeSet<KeyModifier>` | Set of active modifiers (`Ctrl`, `Alt`, `Shift`, `Super`) |

---

## `TabInfo`

Information about a currently opened tab.

```rust
pub struct TabInfo {
    pub position: usize,
    pub name: String,
    pub active: bool,
    pub panes_to_hide: usize,
    pub is_fullscreen_active: bool,
    pub is_sync_panes_active: bool,
    pub are_floating_panes_visible: bool,
    pub other_focused_clients: Vec<ClientId>,
    pub active_swap_layout_name: Option<String>,
    pub is_swap_layout_dirty: bool,
    pub viewport_rows: usize,
    pub viewport_columns: usize,
    pub display_area_rows: usize,
    pub display_area_columns: usize,
    pub selectable_tiled_panes_count: usize,
    pub selectable_floating_panes_count: usize,
    pub tab_id: usize,
    pub has_bell_notification: bool,
    pub is_flashing_bell: bool,
}
```

| Field | Type | Description |
|-------|------|-------------|
| `position` | `usize` | The tab's 0-indexed position |
| `name` | `String` | Display name of the tab |
| `active` | `bool` | Whether this tab is currently focused |
| `panes_to_hide` | `usize` | Number of suppressed panes in this tab |
| `is_fullscreen_active` | `bool` | Whether a pane is taking up the full display area |
| `is_sync_panes_active` | `bool` | Whether STDIN sync is active for this tab |
| `are_floating_panes_visible` | `bool` | Whether floating panes are visible |
| `other_focused_clients` | `Vec<ClientId>` | Other clients focused on this tab |
| `active_swap_layout_name` | `Option<String>` | Name of the active swap layout, if any |
| `is_swap_layout_dirty` | `bool` | Whether the user manually changed the layout |
| `viewport_rows` | `usize` | Row count in the viewport (excluding UI panes) |
| `viewport_columns` | `usize` | Column count in the viewport (excluding UI panes) |
| `display_area_rows` | `usize` | Total row count (including UI panes) |
| `display_area_columns` | `usize` | Total column count (including UI panes) |
| `selectable_tiled_panes_count` | `usize` | Number of selectable tiled panes |
| `selectable_floating_panes_count` | `usize` | Number of selectable floating panes |
| `tab_id` | `usize` | Stable identifier for this tab |
| `has_bell_notification` | `bool` | Whether this tab has an active bell notification |
| `is_flashing_bell` | `bool` | Whether this tab is currently flashing its bell |

---

## `PaneInfo`

Information about a currently open pane.

The coordinates and size fields come in two variants:
- **Pane coordinates** (`pane_x`, `pane_columns`, etc.) - the entire space including frame and title
- **Content coordinates** (`pane_content_x`, `pane_content_columns`, etc.) - the area taken by the pane's content only

```rust
pub struct PaneInfo {
    pub id: u32,
    pub is_plugin: bool,
    pub is_focused: bool,
    pub is_fullscreen: bool,
    pub is_floating: bool,
    pub is_suppressed: bool,
    pub title: String,
    pub exited: bool,
    pub exit_status: Option<i32>,
    pub is_held: bool,
    pub pane_x: usize,
    pub pane_content_x: usize,
    pub pane_y: usize,
    pub pane_content_y: usize,
    pub pane_rows: usize,
    pub pane_content_rows: usize,
    pub pane_columns: usize,
    pub pane_content_columns: usize,
    pub cursor_coordinates_in_pane: Option<(usize, usize)>,
    pub terminal_command: Option<String>,
    pub plugin_url: Option<String>,
    pub is_selectable: bool,
    pub index_in_pane_group: BTreeMap<ClientId, usize>,
    pub default_fg: Option<String>,
    pub default_bg: Option<String>,
}
```

| Field | Type | Description |
|-------|------|-------------|
| `id` | `u32` | Pane identifier (unique within its type: terminal or plugin) |
| `is_plugin` | `bool` | `true` if plugin pane, `false` if terminal pane |
| `is_focused` | `bool` | Whether this pane is focused in its layer |
| `is_fullscreen` | `bool` | Whether this pane is in fullscreen mode |
| `is_floating` | `bool` | Whether this pane is floating |
| `is_suppressed` | `bool` | Whether this pane is suppressed (hidden but still running) |
| `title` | `String` | Display title of the pane |
| `exited` | `bool` | Whether the pane's process has exited |
| `exit_status` | `Option<i32>` | Exit code if the process exited |
| `is_held` | `bool` | Whether the pane is paused waiting for user input |
| `pane_x` | `usize` | X position including frame |
| `pane_content_x` | `usize` | X position of content area |
| `pane_y` | `usize` | Y position including frame |
| `pane_content_y` | `usize` | Y position of content area |
| `pane_rows` | `usize` | Height including frame |
| `pane_content_rows` | `usize` | Height of content area |
| `pane_columns` | `usize` | Width including frame |
| `pane_content_columns` | `usize` | Width of content area |
| `cursor_coordinates_in_pane` | `Option<(usize, usize)>` | Cursor position (x, y) relative to pane, if visible |
| `terminal_command` | `Option<String>` | Stringified command and args (for command panes) |
| `plugin_url` | `Option<String>` | Plugin URL (for plugin panes) |
| `is_selectable` | `bool` | Whether the user can select this pane |
| `index_in_pane_group` | `BTreeMap<ClientId, usize>` | Pane group membership indices per client |
| `default_fg` | `Option<String>` | Default foreground color (e.g., `"#00e000"`) |
| `default_bg` | `Option<String>` | Default background color (e.g., `"#001a3a"`) |

---

## `PaneManifest`

A dictionary of all panes in the session, indexed by tab position.

```rust
pub struct PaneManifest {
    pub panes: HashMap<usize, Vec<PaneInfo>>,
}
```

| Field | Type | Description |
|-------|------|-------------|
| `panes` | `HashMap<usize, Vec<PaneInfo>>` | Map from tab position (0-indexed) to panes in that tab |

Panes include tiled, floating, and suppressed panes.

---

## `SessionInfo`

Information about a running Zellij session.

```rust
pub struct SessionInfo {
    pub name: String,
    pub tabs: Vec<TabInfo>,
    pub panes: PaneManifest,
    pub connected_clients: usize,
    pub is_current_session: bool,
    pub available_layouts: Vec<LayoutInfo>,
    pub plugins: BTreeMap<u32, PluginInfo>,
    pub web_clients_allowed: bool,
    pub web_client_count: usize,
    pub tab_history: BTreeMap<ClientId, Vec<usize>>,
    pub pane_history: BTreeMap<ClientId, Vec<PaneId>>,
    pub creation_time: Duration,
}
```

| Field | Type | Description |
|-------|------|-------------|
| `name` | `String` | Session name |
| `tabs` | `Vec<TabInfo>` | All tabs in this session |
| `panes` | `PaneManifest` | All panes in this session |
| `connected_clients` | `usize` | Number of connected clients |
| `is_current_session` | `bool` | Whether this is the session the plugin is running in |
| `available_layouts` | `Vec<LayoutInfo>` | Layouts available in this session |
| `plugins` | `BTreeMap<u32, PluginInfo>` | Running plugins indexed by ID |
| `web_clients_allowed` | `bool` | Whether web clients are allowed |
| `web_client_count` | `usize` | Number of connected web clients |
| `tab_history` | `BTreeMap<ClientId, Vec<usize>>` | Tab focus history per client |
| `pane_history` | `BTreeMap<ClientId, Vec<PaneId>>` | Pane focus history per client |
| `creation_time` | `Duration` | When the session was created |

---

## `ClientInfo`

Information about a connected client.

```rust
pub struct ClientInfo {
    pub client_id: ClientId,
    pub pane_id: PaneId,
    pub running_command: String,
    pub is_current_client: bool,
}
```

| Field | Type | Description |
|-------|------|-------------|
| `client_id` | `ClientId` | Unique client identifier (`u16`) |
| `pane_id` | `PaneId` | The pane this client is focused on |
| `running_command` | `String` | Stringified command or plugin name in the focused pane |
| `is_current_client` | `bool` | Whether this is the client associated with the requesting plugin |

---

## `ModeInfo`

Information about the current input mode, keybindings, and session metadata. Delivered via the `ModeUpdate` event.

```rust
pub struct ModeInfo {
    pub mode: InputMode,
    pub base_mode: Option<InputMode>,
    pub keybinds: Vec<(InputMode, Vec<(KeyWithModifier, Vec<Action>)>)>,
    pub style: Style,
    pub capabilities: PluginCapabilities,
    pub session_name: Option<String>,
    pub editor: Option<PathBuf>,
    pub shell: Option<PathBuf>,
    pub web_clients_allowed: Option<bool>,
    pub web_sharing: Option<WebSharing>,
    pub currently_marking_pane_group: Option<bool>,
    pub is_web_client: Option<bool>,
    pub web_server_ip: Option<IpAddr>,
    pub web_server_port: Option<u16>,
    pub web_server_capability: Option<bool>,
}
```

| Field | Type | Description |
|-------|------|-------------|
| `mode` | `InputMode` | Currently active input mode |
| `base_mode` | `Option<InputMode>` | Base mode (when in a transient mode) |
| `keybinds` | `Vec<(InputMode, Vec<(KeyWithModifier, Vec<Action>)>)>` | All keybindings organized by mode |
| `style` | `Style` | Active theme colors and styling |
| `capabilities` | `PluginCapabilities` | Terminal capabilities |
| `session_name` | `Option<String>` | Name of the current session |
| `editor` | `Option<PathBuf>` | Configured `$EDITOR` |
| `shell` | `Option<PathBuf>` | Configured shell |
| `web_clients_allowed` | `Option<bool>` | Whether web clients are permitted |
| `web_sharing` | `Option<WebSharing>` | Web sharing status |
| `currently_marking_pane_group` | `Option<bool>` | Whether pane group marking mode is active |
| `is_web_client` | `Option<bool>` | Whether the current client is a web client |
| `web_server_ip` | `Option<IpAddr>` | Configured web server IP |
| `web_server_port` | `Option<u16>` | Configured web server port |
| `web_server_capability` | `Option<bool>` | Whether web server functionality is available |

---

## `Mouse`

A mouse event that occurred while the user is focused on the plugin pane.

```rust
pub enum Mouse {
    ScrollUp(usize),
    ScrollDown(usize),
    LeftClick(isize, usize),
    RightClick(isize, usize),
    Hold(isize, usize),
    Release(isize, usize),
    Hover(isize, usize),
}
```

| Variant | Parameters | Description |
|---------|-----------|-------------|
| `ScrollUp(n)` | `usize` - number of lines | Mouse wheel scrolled up |
| `ScrollDown(n)` | `usize` - number of lines | Mouse wheel scrolled down |
| `LeftClick(line, col)` | `isize, usize` - line and column | Left mouse button clicked |
| `RightClick(line, col)` | `isize, usize` - line and column | Right mouse button clicked |
| `Hold(line, col)` | `isize, usize` - line and column | Mouse button held (drag) |
| `Release(line, col)` | `isize, usize` - line and column | Mouse button released |
| `Hover(line, col)` | `isize, usize` - line and column | Mouse moved without button pressed |

---

## `CopyDestination`

Specifies where text was copied to.

```rust
pub enum CopyDestination {
    Command,
    Primary,
    System,
}
```

| Variant | Description |
|---------|-------------|
| `Command` | Copied via a configured command |
| `Primary` | Copied to the primary selection (X11) |
| `System` | Copied to the system clipboard |

---

## `PermissionType`

Permission types that plugins can request. See [Permissions](./plugin-api-permissions.md) for details.

```rust
pub enum PermissionType {
    ReadApplicationState,
    ChangeApplicationState,
    OpenFiles,
    RunCommands,
    OpenTerminalsOrPlugins,
    WriteToStdin,
    WebAccess,
    ReadCliPipes,
    MessageAndLaunchOtherPlugins,
    Reconfigure,
    FullHdAccess,
    StartWebServer,
    InterceptInput,
    ReadPaneContents,
    RunActionsAsUser,
    WriteToClipboard,
    ReadSessionEnvironmentVariables,
}
```

| Variant | Description |
|---------|-------------|
| `ReadApplicationState` | Read Zellij state (panes, tabs, UI) |
| `ChangeApplicationState` | Change Zellij state and run commands |
| `OpenFiles` | Open files for editing |
| `RunCommands` | Run host commands |
| `OpenTerminalsOrPlugins` | Start new terminals and plugins |
| `WriteToStdin` | Write to pane STDIN |
| `WebAccess` | Make HTTP requests |
| `ReadCliPipes` | Control CLI pipe input/output |
| `MessageAndLaunchOtherPlugins` | Send messages to and launch other plugins |
| `Reconfigure` | Change Zellij runtime configuration |
| `FullHdAccess` | Full access to the host filesystem |
| `StartWebServer` | Start a local web server |
| `InterceptInput` | Intercept keyboard and mouse input |
| `ReadPaneContents` | Read pane viewport and scrollback contents |
| `RunActionsAsUser` | Execute actions as the user |
| `WriteToClipboard` | Write to the user's clipboard |
| `ReadSessionEnvironmentVariables` | Read environment variables from session creation |

---

## `PermissionStatus`

Result of a permission request.

```rust
pub enum PermissionStatus {
    Granted,
    Denied,
}
```

---

## `WebServerStatus`

Status of the Zellij web server.

```rust
pub enum WebServerStatus {
    Online(String),
    Offline,
    DifferentVersion(String),
}
```

| Variant | Description |
|---------|-------------|
| `Online(base_url)` | Web server is online at the given base URL |
| `Offline` | Web server is not running |
| `DifferentVersion(version)` | Web server is running a different Zellij version |

---

## `FileMetadata`

Metadata about a file from filesystem events.

```rust
pub struct FileMetadata {
    pub is_dir: bool,
    pub is_file: bool,
    pub is_symlink: bool,
    pub len: u64,
}
```

| Field | Type | Description |
|-------|------|-------------|
| `is_dir` | `bool` | Whether the path is a directory |
| `is_file` | `bool` | Whether the path is a regular file |
| `is_symlink` | `bool` | Whether the path is a symbolic link |
| `len` | `u64` | File size in bytes |

---

## `ConnectToSession`

Configuration for switching to or creating a session.

```rust
pub struct ConnectToSession {
    pub name: Option<String>,
    pub tab_position: Option<usize>,
    pub pane_id: Option<(u32, bool)>,
    pub layout: Option<LayoutInfo>,
    pub cwd: Option<PathBuf>,
}
```

| Field | Type | Description |
|-------|------|-------------|
| `name` | `Option<String>` | Session name (if `None`, a new session with a random name is created) |
| `tab_position` | `Option<usize>` | Tab to focus after switching |
| `pane_id` | `Option<(u32, bool)>` | Pane to focus: `(id, is_plugin)` |
| `layout` | `Option<LayoutInfo>` | Layout to apply when creating a new session |
| `cwd` | `Option<PathBuf>` | Working directory for the new session |

---

## `Action`

The `Action` enum represents all possible Zellij actions that can be triggered programmatically via `run_action`. The full enum has many variants; the most commonly used ones are listed below:

| Variant | Description |
|---------|-------------|
| `Quit` | Quit Zellij |
| `Write { bytes, .. }` | Write bytes to the focused pane |
| `WriteChars { chars }` | Write characters to the focused pane |
| `SwitchToMode { input_mode }` | Switch input mode |
| `Resize { resize, direction }` | Resize the focused pane |
| `MoveFocus { direction }` | Move focus in a direction |
| `NewPane { direction, .. }` | Open a new pane |
| `NewTab { .. }` | Open a new tab |
| `GoToNextTab` | Switch to the next tab |
| `GoToPreviousTab` | Switch to the previous tab |
| `GoToTab { index }` | Switch to a tab by index |
| `CloseTab` | Close the focused tab |
| `CloseFocus` | Close the focused pane |
| `ToggleFocusFullscreen` | Toggle focused pane fullscreen |
| `ToggleFloatingPanes` | Toggle floating panes visibility |
| `Detach` | Detach from the session |
| `Copy` | Copy selected text |
| `PreviousSwapLayout` | Switch to previous swap layout |
| `NextSwapLayout` | Switch to next swap layout |
| `LaunchOrFocusPlugin { plugin, .. }` | Launch or focus a plugin |
| `RenameSession { name }` | Rename the current session |

For the complete list, see the [source code](https://github.com/zellij-org/zellij/blob/main/zellij-utils/src/input/actions.rs).

---

## `EventType`

Discriminant enum used with `subscribe` and `unsubscribe`. Each variant corresponds to an `Event` variant of the same name.

```rust
pub enum EventType {
    ModeUpdate,
    TabUpdate,
    PaneUpdate,
    Key,
    Mouse,
    Timer,
    CopyToClipboard,
    SystemClipboardFailure,
    InputReceived,
    Visible,
    CustomMessage,
    FileSystemCreate,
    FileSystemRead,
    FileSystemUpdate,
    FileSystemDelete,
    PermissionRequestResult,
    SessionUpdate,
    RunCommandResult,
    WebRequestResult,
    CommandPaneOpened,
    CommandPaneExited,
    PaneClosed,
    EditPaneOpened,
    EditPaneExited,
    CommandPaneReRun,
    FailedToWriteConfigToDisk,
    ListClients,
    HostFolderChanged,
    FailedToChangeHostFolder,
    PastedText,
    ConfigWasWrittenToDisk,
    WebServerStatus,
    FailedToStartWebServer,
    BeforeClose,
    InterceptedKeyPress,
    UserAction,
    PaneRenderReport,
    PaneRenderReportWithAnsi,
    ActionComplete,
    CwdChanged,
    AvailableLayoutInfo,
    PluginConfigurationChanged,
    HighlightClicked,
}
```

See [Events](./plugin-api-events.md) for details on each event and its payload.
