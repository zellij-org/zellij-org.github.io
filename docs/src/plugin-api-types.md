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
- [SessionListSnapshot](#sessionlistsnapshot)
- [HostTerminalThemeMode](#hostterminalthememode)
- [ClientInfo](#clientinfo)
- [ModeInfo](#modeinfo)
- [PaneFrameStyle](#paneframestyle)
- [StyledText](#styledtext)
- [Mouse](#mouse)
- [CopyDestination](#copydestination)
- [PermissionType](#permissiontype)
- [PermissionStatus](#permissionstatus)
- [WebServerStatus](#webserverstatus)
- [FileMetadata](#filemetadata)
- [ConnectToSession](#connecttosession)
- [Action](#action)
- [EventType](#eventtype)
- [BorderStyleOverride](#borderstyleoverride)
- [HiddenBars](#hiddenbars)
- [MouseTrigger](#mousetrigger)
- [PopupOptions](#popupoptions)
- [PromptRequest](#promptrequest)
- [PromptResult](#promptresult)
- [ContextMenuTarget](#contextmenutarget)
- [ContextMenuContext](#contextmenucontext)
- [PluginSettingsEntry](#pluginsettingsentry)
- [Slot](#slot)
- [NestedSessionKeybinds](#nestedsessionkeybinds)
- [PaneAttention](#paneattention)
- [GlobalAttention](#globalattention)
- [SessionHistoryInfo](#sessionhistoryinfo)
- [SessionTerminalRequest](#sessionterminalrequest)
- [SessionSuggestions](#sessionsuggestions)
- [SessionPreview](#sessionpreview)
- [LiveView](#liveview)
- [SettingKey](#settingkey)
- [ConfigSnapshot](#configsnapshot)
- [KeybindPresetInfo](#keybindpresetinfo)

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
    PaneId::Terminal(id) => {},
    PaneId::Plugin(id) => {},
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
    pub border_style: Option<BorderStyleOverride>,
}
```

| Field | Type | Description |
|-------|------|-------------|
| `path` | `PathBuf` | Path to the file to open |
| `line_number` | `Option<usize>` | Optional line number to jump to (if the editor supports it) |
| `cwd` | `Option<PathBuf>` | Optional working directory for the editor process |
| `border_style` | `Option<`[`BorderStyleOverride`](#borderstyleoverride)`>` | Optional border line style for the new pane |

The builder methods `FileToOpen::new(path)`, `.with_line_number(line)`, `.with_cwd(cwd)` and `.with_border_style(border_style)` keep working when fields are added.

**Example:**

```rust
let file = FileToOpen::new("/home/user/project/src/main.rs").with_line_number(42);
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
    pub border_style: Option<BorderStyleOverride>,
}
```

| Field | Type | Description |
|-------|------|-------------|
| `path` | `PathBuf` | Path to the executable |
| `args` | `Vec<String>` | Command-line arguments |
| `cwd` | `Option<PathBuf>` | Optional working directory |
| `border_style` | `Option<`[`BorderStyleOverride`](#borderstyleoverride)`>` | Optional border line style for the new pane |

The builder methods `CommandToRun::new(path)`, `CommandToRun::new_with_args(path, args)` and `.with_border_style(border_style)` are also available. When building the struct directly, end it with `..Default::default()` so that it keeps compiling when fields are added.

**Example:**

```rust
let cmd = CommandToRun {
    path: PathBuf::from("cargo"),
    args: vec!["build".to_string(), "--release".to_string()],
    cwd: Some(PathBuf::from("/home/user/project")),
    ..Default::default()
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
    pub border_style: Option<BorderStyleOverride>,
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
| `border_style` | `Option<`[`BorderStyleOverride`](#borderstyleoverride)`>` | Border line style of the pane |

All fields are optional. When `None`, Zellij uses its default placement logic.

---

## `PercentOrFixed`

Specifies a dimension as either a percentage or a fixed number of rows/columns.

```rust
pub enum PercentOrFixed {
    Percent(usize),
    Fixed(usize),
}
```

`Percent` is a value from 1 to 100. `Fixed` is an absolute number of columns or rows.

**Example:**

```rust
let coords = FloatingPaneCoordinates {
    x: Some(PercentOrFixed::Percent(10)),
    y: Some(PercentOrFixed::Fixed(5)),
    width: Some(PercentOrFixed::Percent(80)),
    height: Some(PercentOrFixed::Fixed(20)),
    pinned: Some(true),
    ..Default::default()
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
| `client_id` | `ClientId` | The client that loaded this plugin (`u32`) |

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
    RenameSession,
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
| `RenameSession` | Allows assigning a new name to the session (plugins built against `0.45` see it as `RenameTab`) |

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
    pub cursor: Option<(usize, usize)>,
}
```

| Field | Type | Description |
|-------|------|-------------|
| `lines_above_viewport` | `Vec<String>` | Lines above the current viewport (only populated if full scrollback is requested) |
| `lines_below_viewport` | `Vec<String>` | Lines below the current viewport (only populated if full scrollback is requested) |
| `viewport` | `Vec<String>` | Currently visible lines |
| `selected_text` | `Option<SelectedText>` | Currently selected text range, if any |
| `cursor` | `Option<(usize, usize)>` | Cursor position (x, y) inside the viewport, if visible |

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
    pub other_focused_client_slots: Vec<usize>,
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
    pub attention: TabAttention,
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
| `other_focused_client_slots` | `Vec<usize>` | The display color slot of each client in `other_focused_clients`, in the same order. Pass it to `client_slot_to_colors` to get that client's colors |
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
| `attention` | [`TabAttention`](#paneattention) | The most urgent attention state of the tab's panes, with counts |

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
    pub is_collapsed: bool,
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
    pub nested_session_name: Option<String>,
    pub attention: PaneAttention,
    pub command_state: CommandState,
    pub program_status: Vec<ProgramStatusRecord>,
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
| `is_collapsed` | `bool` | Whether this pane gave its layout space back with [`set_self_collapsed`](./plugin-api-commands.md#set_self_collapsed) |
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
| `nested_session_name` | `Option<String>` | Name of the [nested Zellij session](./nested-sessions.md) running in this pane, if any |
| `attention` | [`PaneAttention`](#paneattention) | Attention state of the pane |
| `command_state` | [`CommandState`](#paneattention) | What the shell in the pane is doing: at the prompt, running a command, finished, and the last command's outcome |
| `program_status` | `Vec<`[`ProgramStatusRecord`](#paneattention)`>` | Statuses reported by programs running in the pane |

Without the [`ReadPaneContents`](./plugin-api-permissions.md#readpanecontents) permission, `attention` and `command_state` arrive without the text of the commands.

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
    pub attention_muted: bool,
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
| `attention_muted` | `bool` | Whether the attention status of the whole session is muted |

---

## `SessionListSnapshot`

A point-in-time snapshot of all sessions on the local machine, returned by [`get_session_list`](./plugin-api-commands.md#get_session_list).

```rust
pub struct SessionListSnapshot {
    pub live_sessions: Vec<SessionInfo>,
    pub resurrectable_sessions: Vec<(String, Duration)>,
}
```

| Field | Type | Description |
|-------|------|-------------|
| `live_sessions` | `Vec<`[`SessionInfo`](#sessioninfo)`>` | All currently running sessions |
| `resurrectable_sessions` | `Vec<(String, Duration)>` | Names of dead-but-resurrectable sessions, paired with how long ago each was last alive |

---

## `HostTerminalThemeMode`

The color-scheme mode reported by the host terminal via CSI 2031 / DSR 997. Delivered as the payload of the [`HostTerminalThemeChanged`](./plugin-api-events.md#hostterminalthemechanged) event.

```rust
pub enum HostTerminalThemeMode {
    Dark,
    Light,
}
```

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
| `client_id` | `ClientId` | Unique client identifier (`u32`). Client ids are not reused within a session |

> **Changed in `0.46.0`:** `ClientId` used to be a `u16`, and the ids of clients that left were given to new clients.
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
    pub pane_frame_style: Option<PaneFrameStyle>,
    pub session_dimmed: Option<bool>,
    pub session_ancestry: Vec<String>,
    pub host_fullscreen: Option<bool>,
    pub nested_ascend_keys: Vec<KeyWithModifier>,
    pub session_ascended: Option<bool>,
    pub nested_descend_keys: Vec<KeyWithModifier>,
    pub remote_client: Option<String>,
    pub hidden_bars: HiddenBars,
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
| `pane_frame_style` | `Option<`[`PaneFrameStyle`](#paneframestyle)`>` | The frame style currently used in this session |
| `session_dimmed` | `Option<bool>` | Whether this session's UI is dimmed because focus was handed to a nested session |
| `session_ancestry` | `Vec<String>` | The names of the sessions this session is nested in, outermost first |
| `host_fullscreen` | `Option<bool>` | Whether this session's pane is fullscreen inside its host session |
| `nested_ascend_keys` | `Vec<`[`KeyWithModifier`](#keywithmodifier)`>` | Keys bound to `FocusHostSession` |
| `session_ascended` | `Option<bool>` | Whether focus has been handed back up to the host session |
| `nested_descend_keys` | `Vec<`[`KeyWithModifier`](#keywithmodifier)`>` | Keys bound to `FocusGuestSession` |
| `remote_client` | `Option<String>` | How this client is connected, for display (eg. `"from a terminal"`, `"from a terminal, over SSH from 10.0.0.2"` or `"through the web server"`); `None` in the [Zellij terminal](./zellij-terminal.md) desktop app |
| `hidden_bars` | [`HiddenBars`](#hiddenbars) | The bars currently hidden with [`hide_bars`](./plugin-api-commands.md#hide_bars) or the matching actions |

The seven fields from `pane_frame_style` to `nested_descend_keys` relate to [nested sessions](./nested-sessions.md) and to the [pane frame style](./options.md#pane_frame_style). They allow plugins that render session chrome (eg. the tab-bar and status-bar) to indicate where the session sits in the nesting hierarchy and how to leave it.

`style` (of type `Style`) also has the fields `border_style` and `floating_border_style`, each a `BorderStyle` with the line style of every side (`top`, `right`, `bottom`, `left`) and `rounded_corners`: the configured border style of tiled and of floating panes.

The theme colors (`style.colors`, of type `Styling`) have one `StyleDeclaration` (the six colors `base`, `background` and `emphasis_0` to `emphasis_3`, each a `PaletteColor`) per [theme component](./themes.md#theme-ui-components), plus `ribbon_hover: Option<StyleDeclaration>`, which is `None` when the theme has no [`ribbon_hover`](./themes.md#ribbon_hover) section. To draw a hovered ribbon, use `Styling::ribbon_hover_style()`: it returns the hover colors that apply, including the fallback for themes without that section. Do not use `ribbon_unselected.emphasis_1` as the hover fill.

---

## `PaneFrameStyle`

The style used to render pane frames in the session. See the [`pane_frame_style`](./options.md#pane_frame_style) option.

```rust
pub enum PaneFrameStyle {
    Full,
    Titles,
    None,
}
```

| Variant | Description |
|---------|-------------|
| `Full` | A full border around each pane |
| `Titles` | A single title line above each pane (default) |
| `None` | No pane frames |

---

## `StyledText`

A piece of text with a set of highlighted (emphasized) character indices. Used, among others, as the payload of the [`HintText`](./plugin-api-events.md#hinttext) event. It can be turned into a `Text` UI component with `Text::from(styled_text)`.

```rust
pub struct StyledText {
    pub text: String,
    pub indices: Vec<Vec<usize>>,
}
```

| Field | Type | Description |
|-------|------|-------------|
| `text` | `String` | The text itself |
| `indices` | `Vec<Vec<usize>>` | Character indices to emphasize, grouped by [color index](./plugin-ui-rendering.md#indices) |

`StyledText::plain(text)` creates a `StyledText` with no highlights, and `is_plain()` returns `true` when nothing is highlighted. A `StyledText` can also be created from a `&str` or a `String` (with no highlights), or from a `Text` UI component (`StyledText::from(text)`).

---

## `Mouse`

A mouse event that occurred while the user is focused on the plugin pane.

```rust
pub enum Mouse {
    ScrollUp(usize),
    ScrollDown(usize),
    ScrollLeft(usize),
    ScrollRight(usize),
    LeftClick(isize, usize),
    RightClick(isize, usize),
    Hold(isize, usize),
    Release(isize, usize),
    Hover(isize, usize),
    DoubleClick(isize, usize),
}
```

| Variant | Parameters | Description |
|---------|-----------|-------------|
| `ScrollUp(n)` | `usize` - number of lines | Mouse wheel scrolled up |
| `ScrollDown(n)` | `usize` - number of lines | Mouse wheel scrolled down |
| `ScrollLeft(n)` | `usize` - number of columns | Mouse wheel scrolled left (horizontal scroll) |
| `ScrollRight(n)` | `usize` - number of columns | Mouse wheel scrolled right (horizontal scroll) |
| `LeftClick(line, col)` | `isize, usize` - line and column | Left mouse button clicked |
| `RightClick(line, col)` | `isize, usize` - line and column | Right mouse button clicked |
| `Hold(line, col)` | `isize, usize` - line and column | Mouse button held (drag) |
| `Release(line, col)` | `isize, usize` - line and column | Mouse button released |
| `Hover(line, col)` | `isize, usize` - line and column | Mouse moved without button pressed |
| `DoubleClick(line, col)` | `isize, usize` - line and column | Left mouse button double-clicked (not sent while [mouse selection support](./plugin-api-commands.md#set_self_mouse_selection_support) is enabled) |

The modifier keys held during a mouse event are returned by [`mouse_modifiers`](./plugin-api-commands.md#mouse_modifiers).

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
    pub switch_context: Option<SwitchContext>,
}
```

| Field | Type | Description |
|-------|------|-------------|
| `name` | `Option<String>` | Session name (if `None`, a new session with a random name is created) |
| `tab_position` | `Option<usize>` | Tab to focus after switching |
| `pane_id` | `Option<(u32, bool)>` | Pane to focus: `(id, is_plugin)` |
| `layout` | `Option<LayoutInfo>` | Layout to apply when creating a new session |
| `cwd` | `Option<PathBuf>` | Working directory for the new session |
| `switch_context` | `Option<SwitchContext>` | Extra options for the switch (see below) |

Of `SwitchContext`, plugins can set two fields (the others are filled in by Zellij):

| Field | Type | Description |
|-------|------|-------------|
| `startup_card` | `Option<StartupCard>` | Whether to show the session card on arrival: `Attention` (only when a pane is waiting for the user), `Always` or `Never` |
| `disconnect_others` | `bool` | Disconnect all other clients from the target session once this client is attached |

`ConnectToSession` implements `Default`, so it can be built with `..Default::default()`.

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
| `FocusLastPane` | Focus the previously focused pane |
| `ToggleFocusNoUiFullscreen` | Toggle fullscreen for the focused pane, covering the UI bars as well |
| `SetPaneFrameStyle { pane_frame_style }` | Set the [pane frame style](#paneframestyle) for the session |
| `AreFloatingPanesVisible` | Query whether floating panes are visible |
| `SetDarkTheme` / `SetLightTheme` / `ToggleTheme` | Switch between the configured dark and light themes |
| `FocusHostSession` | [Nested sessions](./nested-sessions.md): move focus to the host session |
| `FocusGuestSession` | [Nested sessions](./nested-sessions.md): descend into the guest session in the focused pane |
| `ToggleHostFullscreen` | [Nested sessions](./nested-sessions.md): toggle this session's pane fullscreen in its host |
| `ScrollToPreviousPrompt` / `ScrollToNextPrompt` | Jump between shell prompts in the scrollback ([OSC 133](./shell-integration.md)) |
| `SelectCommandAtScrollPosition` | Select the command and output at the scroll position ([OSC 133](./shell-integration.md)) |
| `CopyLastCommandOutput` | Copy the last command's output to the clipboard ([OSC 133](./shell-integration.md)) |
| `ApplyTiledSwapLayout` / `ApplyFloatingSwapLayout` | Apply a [swap layout](./swap-layouts.md) by name |
| `SetPaneBorderStyle` | Set the border line style of a pane |
| `ToggleBars` / `HideBars` / `ShowBars` | Hide or show bars at runtime |
| `CloseFocusByPaneId`, `ToggleFocusFullscreenByPaneId`, `TogglePaneEmbedOrFloatingByPaneId`, `TogglePanePinnedByPaneId`, `TogglePaneInGroupByPaneId`, `StartRenamePaneByPaneId` | Pane actions that target a specific pane |
| `StartRenameTabByTabId`, `MoveTabByTabId`, `MoveTabToPosition` | Tab actions that target a specific tab |
| `MutePane`, `IgnorePaneOutput`, `WatchPane`, `MuteTab`, `MuteSession`, `MarkPaneSeen`, `MarkAllSeen`, `GoToNextAttention` | Attention controls (see the [inbox](./inbox.md)) |
| `GoToPreviousSession` / `GoToNextSession` / `ToggleSession` | Move through the session history |

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
    ActionComplete,
    CwdChanged,
    AvailableLayoutInfo,
    PluginConfigurationChanged,
    HighlightClicked,
    CommandChanged,
    InitialKeybinds,
    HostTerminalThemeChanged,
    SoftKeyboardVisibilityChanged,
    HintText,
    ActivePaneScroll,
    MouseWithModifiers,
    NestedSessionModeUpdate,
    NestedSessionEnded,
    ContextMenu,
    ConfigChangesDropped,
    AvailableKeybindPresets,
    ConfigFileChangedSinceRead,
    PromptResult,
    SessionSuggestions,
    SessionCountsUpdate,
    FolderSessionsUpdate,
    TerminalCommandSubmitted,
    SessionPreview,
    SavedSessionPreview,
    PaneAttentionChanged,
    PromptShown,
    CommandStarted,
    CommandFinished,
    GlobalAttentionUpdate,
    SessionHistoryUpdate,
    DesktopIntegration,
    PluginSettingsEntries,
    LiveViewStateChanged,
}
```

See [Events](./plugin-api-events.md) for details on each event and its payload. `MouseWithModifiers` is used inside Zellij only: subscribing to it is the same as subscribing to `Mouse`.

---

## `BorderStyleOverride`

The border line style of a single pane, side by side. Used by [`set_pane_border_style`](./plugin-api-commands.md#set_pane_border_style) and by the `border_style` field of [`FileToOpen`](#filetoopen), [`CommandToRun`](#commandtorun) and [`FloatingPaneCoordinates`](#floatingpanecoordinates). Every field left as `None` keeps the configured style.

```rust
pub struct BorderStyleOverride {
    pub all: Option<LineStyle>,
    pub top: Option<LineStyle>,
    pub right: Option<LineStyle>,
    pub bottom: Option<LineStyle>,
    pub left: Option<LineStyle>,
    pub rounded_corners: Option<bool>,
}

pub enum LineStyle {
    Single,
    Double,
    Heavy,
    Dashed,
    HeavyDashed,
}
```

| Field | Type | Description |
|-------|------|-------------|
| `all` | `Option<LineStyle>` | Style for every side that does not set its own |
| `top`, `right`, `bottom`, `left` | `Option<LineStyle>` | Style for one side; takes precedence over `all` |
| `rounded_corners` | `Option<bool>` | Whether the corners are rounded |

`BorderStyleOverride` implements `Default`. `BorderStyleOverride::from_cli_string` parses the same text as the command line, eg. `"double"` or `"top:double,left:heavy,rounded"`.

---

## `HiddenBars`

The bars currently hidden, as reported in [`ModeInfo`](#modeinfo).

```rust
pub enum HiddenBars {
    None,
    All,
    Named(BTreeSet<String>),
}
```

| Variant | Description |
|---------|-------------|
| `None` | No bar is hidden |
| `All` | All bars are hidden |
| `Named(names)` | The bars with these names are hidden (eg. `tab-bar`, `status-bar`, `compact-bar`, or a plugin alias or location) |

`hidden_bars.hides("tab-bar")` tells whether a specific bar is hidden. The constants `ALL_BARS`, `TAB_BAR`, `STATUS_BAR` and `COMPACT_BAR` hold the built-in names.

---

## `MouseTrigger`

A mouse button press, as used in [mouse bindings](./mouse-bindings.md) and [`reset_mousebinds`](./plugin-api-commands.md#reset_mousebinds).

```rust
pub struct MouseTrigger {
    pub button: MouseButton,
    pub modifiers: BTreeSet<KeyModifier>,
    pub click_count: u8,
    pub target: MouseTarget,
}

pub enum MouseButton {
    Left,
    Right,
    Middle,
    ScrollUp,
    ScrollDown,
    ScrollLeft,
    ScrollRight,
}

pub enum MouseTarget {
    Any,
    Content,
    Frame,
}
```

| Field | Type | Description |
|-------|------|-------------|
| `button` | `MouseButton` | The button (or wheel direction) |
| `modifiers` | `BTreeSet<KeyModifier>` | Modifier keys held |
| `click_count` | `u8` | `1` for a click, `2` for a double click |
| `target` | `MouseTarget` | Where the press happens: anywhere (default), in pane content, or on a pane frame |

`MouseTrigger::new(button)` builds one, and `.with_modifiers()`, `.with_click_count()` and `.with_target()` change it.

---

## `PopupOptions`

How a popup opened with [`open_plugin_popup_with_options`](./plugin-api-commands.md#open_plugin_popup_with_options) behaves. The struct is marked `#[non_exhaustive]`: build it with `PopupOptions::default()` and the builder methods `.focused()`, `.corner()`, `.capture_all_keys()` and `.outside_click()`.

```rust
pub struct PopupOptions {
    pub focused: bool,
    pub corner: Option<PopupCorner>,
    pub capture_all_keys: bool,
    pub outside_click: Option<OutsideClick>,
}

pub enum PopupCorner {
    TopLeft,
    TopRight,
    BottomLeft,
    BottomRight,
}

pub enum OutsideClick {
    Block,
    Close,
}
```

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `focused` | `bool` | `true` | `true` for a menu-like popup that takes key focus and replaces the user's other open menus; `false` for an information popup that does not take key focus |
| `corner` | `Option<PopupCorner>` | `None` | Place the popup in this corner of the screen instead of at the requested position |
| `capture_all_keys` | `bool` | `false` | Send every key to the popup, including the ones bound to Zellij actions |
| `outside_click` | `Option<OutsideClick>` | `None` | What a click outside the popup does: `Block` ignores it, `Close` closes the popup. `None` means `Close` for focused popups and `Block` for the others |

---

## `PromptRequest`

A question to ask with [`prompt`](./plugin-api-commands.md#prompt). It is marked `#[non_exhaustive]`: build it with one of the constructors below and the builder methods.

| Constructor | Asks for | Answer |
|-------------|----------|--------|
| `PromptRequest::confirm(message)` | Yes or no | `PromptResult::Confirmed(bool)` |
| `PromptRequest::choose(items)` | One item of a list (several with `.multi()`) | `PromptValue::Choice`, or `PromptValue::Choices` with `.multi()` |
| `PromptRequest::input(message)` | A line of text | `PromptValue::Text` |
| `PromptRequest::number(message)` | A whole number | `PromptValue::Number` |
| `PromptRequest::toggle(message)` | On or off | `PromptValue::Bool` |
| `PromptRequest::select(message, options)` | One option of a dropdown | `PromptValue::Choice` |
| `PromptRequest::menu(items)` | An action from a menu | `PromptValue::Choice` with the value of the chosen item |
| `PromptRequest::form(fields)` / `PromptRequest::form_spec(spec)` | Several fields at once | `PromptValue::Form`, keyed by field id |
| `PromptRequest::notify(message)` | Nothing: a notice in the top right corner that does not take focus | `PromptValue::Bool(true)` only if the user clicks it; no result if it closes otherwise |
| `PromptRequest::info(title, message)` | Nothing: an information popup | - |

Builder methods that apply to every request:

| Method | Description |
|--------|-------------|
| `.title(title)` | Title shown at the top of the popup |
| `.message(text)` | The question, or the text above the fields of a form (accepts a `Text` to color parts of it) |
| `.timeout(duration)` | Close the prompt after this long; the answer is then `PromptResult::TimedOut` |
| `.default(value)` | The initial value, and the answer used when the timeout runs out |
| `.placement(placement)` | Where to open: `PromptPlacement::Pane(pane_id)`, `Center`, `Mouse`, `Cursor` or `Corner(corner)`; by default over the calling plugin's pane |
| `.focused(bool)` | Whether the popup takes key focus (all elements except `notify` do by default) |
| `.capture_all_keys(bool)` | Send every key to the popup, including the ones bound to Zellij actions |
| `.outside_click(OutsideClick)` | What a click outside does; by default `Close` for `info` and `Block` for the others |

Builder methods for specific elements: `.yes(label)` and `.no(label)` (confirm), `.multi()` and `.selected(values)` (choose), `.placeholder(text)`, `.validate(regex)` and `.required()` (input), `.min(n)` and `.max(n)` (number), `.remember(label)` and `.padded()` (menu), and `.buttons(submit, cancel)` (form). Items are `ChoiceItem`s, which can be built from a `&str`, a `String` or a `(value, label)` pair.

Form fields are built with `FormField::input(id, label)`, `FormField::toggle(id, label)`, `FormField::number(id, label)`, `FormField::select(id, label, options)` and `FormField::choose(id, label, options)`, then refined with `.required()`, `.validate(regex)`, `.placeholder(text)`, `.multi()`, `.min(n)`, `.max(n)`, `.step(n)` and `.default_value(value)`. A `FormSpec` (`FormSpec::new(fields)` with `.title()`, `.message()` and `.buttons()`) gives the form its own title and button labels.

**Example:**

```rust
let request = PromptRequest::form(vec![
    FormField::input("name", "Name").required(),
    FormField::toggle("public", "Public"),
])
.title("New project")
.timeout(Duration::from_secs(60));
self.form_request = Some(prompt(request));
```

---

## `PromptResult`

The answer to a [`prompt`](./plugin-api-commands.md#prompt), delivered with the [`PromptResult`](./plugin-api-events.md#promptresult) event.

```rust
pub enum PromptResult {
    Answered(PromptValue),
    Confirmed(bool),
    Cancelled,
    TimedOut(Option<PromptValue>),
    Error(String),
}

pub enum PromptValue {
    Text(String),
    Number(i64),
    Bool(bool),
    Choice(String),
    Choices(Vec<String>),
    Form(BTreeMap<String, PromptValue>),
}
```

| Variant | Description |
|---------|-------------|
| `Answered(value)` | The user answered; see [`PromptRequest`](#promptrequest) for which `PromptValue` each element gives |
| `Confirmed(answer)` | The answer to a `confirm` prompt |
| `Cancelled` | The user dismissed the prompt |
| `TimedOut(default)` | The timeout passed; carries the default value, if any |
| `Error(message)` | The request was invalid or the popup could not be opened |

---

## `ContextMenuTarget`

What a context menu opened with [`open_context_menu`](./plugin-api-commands.md#open_context_menu) is about.

```rust
pub enum ContextMenuTarget {
    Tab(usize),
    Bar,
}
```

| Variant | Description |
|---------|-------------|
| `Tab(position)` | The tab at this position (0-indexed) |
| `Bar` | The bar plugin that opens the menu |

---

## `ContextMenuContext`

What was right-clicked, delivered with the [`ContextMenu`](./plugin-api-events.md#contextmenu) event together with the entries to show.

```rust
pub struct ContextMenuContext {
    pub kind: ContextMenuKind,
    pub pane_id: Option<PaneId>,
    pub pane_is_floating: bool,
    pub tab_index: Option<usize>,
    pub tab_id: Option<usize>,
    pub tab_count: usize,
    pub line: usize,
    pub column: usize,
    pub client_id: ClientId,
    pub paste_shortcut: Option<String>,
}

pub enum ContextMenuKind {
    Pane,
    PaneFrame,
    Tab,
    Bar,
}

pub enum ContextMenuEntry {
    Item {
        label: String,
        actions: Vec<ContextMenuAction>,
        toggled_label: Option<String>,
    },
    Separator,
}
```

| Field | Type | Description |
|-------|------|-------------|
| `kind` | `ContextMenuKind` | Whether a pane's content, a pane frame, a tab or a bar was clicked |
| `pane_id` | `Option<PaneId>` | The pane clicked, if any |
| `pane_is_floating` | `bool` | Whether that pane is floating |
| `tab_index` / `tab_id` | `Option<usize>` | Position and id of the tab clicked, if any |
| `tab_count` | `usize` | Number of tabs |
| `line` / `column` | `usize` | Screen position of the click |
| `client_id` | `ClientId` | The user who clicked |
| `paste_shortcut` | `Option<String>` | The key that pastes from the clipboard, for display |

Each `ContextMenuEntry::Item` has a label and the actions it runs (a `ContextMenuAction` is either a plain `Action` or an action on the clicked pane or tab). For items that toggle something, Zellij picks the right label (`label` or `toggled_label`) before sending the entries, so the `label` received is the one to show.

---

## `PluginSettingsEntry`

An entry a plugin added to the settings screen with [`register_settings_entry`](./plugin-api-commands.md#register_settings_entry).

```rust
pub struct PluginSettingsEntry {
    pub plugin_id: u32,
    pub title: String,
}
```

The constants `OPEN_PLUGIN_SETTINGS_MESSAGE` (`"zellij:open_plugin_settings"`) and `OPEN_PLUGIN_SETTINGS_CLIENT_ID_ARG` (`"client_id"`) are the name and argument of the pipe message sent to the plugin when its entry is selected.

---

## `Slot`

Types used by [shared plugins](./plugin-lifecycle.md#shared-plugins).

```rust
pub type SlotId = u32;

pub struct Slot {
    pub id: SlotId,
    pub kind: SlotKind,
    pub configuration: BTreeMap<String, String>,
}

pub enum SlotKind {
    Pane,
    Background,
}

pub struct EventContext {
    pub slot_id: Option<SlotId>,
    pub client_id: Option<ClientId>,
}

pub enum RenderResponse {
    Nothing,
    All,
    Client(ClientId),
    Slots(Vec<SlotId>),
}
```

| Type | Description |
|------|-------------|
| `Slot` | One use of a shared plugin: a pane (`SlotKind::Pane`) or a background load, eg. from `load_plugins` (`SlotKind::Background`). Its id is the plugin id of that pane, and `configuration` is the configuration it was opened with |
| `EventContext` | The slot an event is about (for events tied to one pane, eg. `Key`, `Mouse`, `PastedText`, `Visible`, `PermissionRequestResult` and `PluginConfigurationChanged`) and the client it came from, when known |
| `RenderResponse` | What to render after an event: nothing (default), every slot for every client, every slot as seen by one client, or specific slots |

---

## `NestedSessionKeybinds`

Returned by [`get_nested_session_keybinds`](./plugin-api-commands.md#get_nested_session_keybinds).

```rust
pub type NestedSessionKeybindsResponse = Result<NestedSessionKeybinds, NestedSessionKeybindsError>;

pub struct NestedSessionKeybinds {
    pub session_path: Vec<String>,
    pub mode: InputMode,
    pub base_mode: Option<InputMode>,
    pub keybinds: KeybindsVec,
    pub keybinds_generation: u64,
}

pub enum NestedSessionKeybindsError {
    NotANestedSession,
    NotSupported,
    GuestUnresponsive,
    GuestGone,
    TooLarge,
    Timeout,
}

pub enum NestedSessionEndReason {
    Exited,
    Unresponsive,
}
```

`keybinds` has the same shape as the keybindings of [`InitialKeybinds`](./plugin-api-events.md#initialkeybinds). `session_path`, `mode`, `base_mode` and `keybinds_generation` mean the same as in [`NestedSessionModeUpdate`](./plugin-api-events.md#nestedsessionmodeupdate).

| Error | Description |
|-------|-------------|
| `NotANestedSession` | No nested session runs in this pane |
| `NotSupported` | The nested session cannot report its keybindings (eg. an older Zellij version) |
| `GuestUnresponsive` | The nested session is not responding |
| `GuestGone` | The nested session has ended |
| `TooLarge` | The keybindings are too large to send |
| `Timeout` | No answer arrived in time |

`NestedSessionEndReason` is the reason given by [`NestedSessionEnded`](./plugin-api-events.md#nestedsessionended).

---

## `PaneAttention`

The attention state of a pane: whether it is working, done, failed, waiting for the user, and so on. See the [inbox](./inbox.md). Found in [`PaneInfo`](#paneinfo) and in the [`PaneAttentionChanged`](./plugin-api-events.md#paneattentionchanged) event.

```rust
pub struct PaneAttention {
    pub status: AttentionStatus,
    pub source: Option<AttentionSource>,
    pub text: String,
    pub detail: AttentionDetail,
    pub since_ms: u64,
    pub changed_ms: u64,
    pub seen: bool,
    pub muted: Option<MuteScope>,
    pub ignore_output: bool,
    pub watched: bool,
    pub from_watch: bool,
    pub remembered: Option<RememberedStatus>,
}

pub enum AttentionStatus {
    Idle,
    Working,
    NewOutput,
    Quiet,
    Done,
    Failed,
    NeedsYou,
}
```

| Field | Type | Description |
|-------|------|-------------|
| `status` | `AttentionStatus` | The state, from least to most urgent: `Idle`, `Working`, `NewOutput`, `Quiet`, `Done`, `Failed`, `NeedsYou` |
| `source` | `Option<AttentionSource>` | What set it: `ProgramStatus`, `Notification`, `Bell`, `CommandPane`, `ShellCommand`, `ForegroundProcess`, `IdleRule`, `Watch` or `UnseenOutput` |
| `text` | `String` | Short description, for display |
| `detail` | `AttentionDetail` | More detail when known: the kind of block (`BlockedKind`: `Permission`, `Question`, `Auth`), progress, app, title, body, exit code, duration and command |
| `since_ms` / `changed_ms` | `u64` | When the status started and last changed (milliseconds since the Unix epoch) |
| `seen` | `bool` | Whether the user has seen it |
| `muted` | `Option<MuteScope>` | Whether it is muted, and by what: `Pane`, `Tab` or `Session` |
| `ignore_output` | `bool` | Whether new output of the pane is ignored |
| `watched` / `from_watch` | `bool` | Whether the pane is watched, and whether this status came from the watch |
| `remembered` | `Option<RememberedStatus>` | An earlier status kept for display (`status`, `text`, `since_ms`) |

Related types:

- `TabAttention` (in [`TabInfo`](#tabinfo)): `status`, `counts` and `muted` for a whole tab.
- `AttentionCounts`: the number of panes in each state (`needs_you`, `failed`, `done`, `working`, `quiet`, `new_output`) and of muted panes (`muted`).
- `CommandState` (in [`PaneInfo`](#paneinfo)): `phase` (`Unknown`, `AtPrompt`, `Typing`, `Running`, `Finished`), the `running` command and when it started, the `last` `CommandOutcome`, the `cwd` the shell reported, and `reports_markers` (whether the shell reports prompts and commands).
- `CommandOutcome` (in [`CommandFinished`](./plugin-api-events.md#commandfinished)): `result` (`Succeeded`, `Failed` or `Unknown`), `exit_code`, `err`, `duration_ms`, `ended_ms` and `command`.
- `CommandText`: the `text` of a command and its `source` (`Shell`, `Screen` or `Process`). Left out without the [`ReadPaneContents`](./plugin-api-permissions.md#readpanecontents) permission.
- `ProgramStatusRecord` (in [`PaneInfo`](#paneinfo)): a status reported by a program in the pane, with an optional `id`, a `state` (`Idle`, `Working`, `Done`, `Blocked` or `Error`), `kind`, `progress`, `app`, `title`, `msg` and `updated_ms`.

All of these are defined in `zellij_utils::attention`. Most are also exported by `zellij_tile::prelude`; `CommandState`, `CommandText` and `ProgramStatusRecord` are not, and are reached through the fields that hold them.

---

## `GlobalAttention`

The attention state of every running session on the machine, delivered with the [`GlobalAttentionUpdate`](./plugin-api-events.md#globalattentionupdate) event.

```rust
pub struct GlobalAttention {
    pub current_session: String,
    pub sessions: Vec<GlobalSessionAttention>,
    pub items: Vec<GlobalAttentionItem>,
    pub counts: AttentionCounts,
    pub status: AttentionStatus,
    pub badge_colors: Vec<(AttentionStatus, [u8; 3])>,
    pub attention_disabled: bool,
}
```

| Field | Type | Description |
|-------|------|-------------|
| `current_session` | `String` | The session this plugin runs in |
| `sessions` | `Vec<GlobalSessionAttention>` | Each session's `name`, whether it `is_current`, and its `SessionAttention` (`status`, `counts`, `muted`, the `top` item and all `items`) |
| `items` | `Vec<GlobalAttentionItem>` | Every pane needing attention, with its `session` and whether it `is_current`. Each `AttentionItem` has the `pane_id`, `tab_id`, `tab_name`, `pane_title` and [`PaneAttention`](#paneattention) |
| `counts` | `AttentionCounts` | Totals across all sessions |
| `status` | `AttentionStatus` | The most urgent status across all sessions |
| `badge_colors` | `Vec<(AttentionStatus, [u8; 3])>` | The configured RGB color of each status |
| `attention_disabled` | `bool` | Whether attention tracking is turned off in the configuration |

---

## `SessionHistoryInfo`

A user's session history, delivered with the [`SessionHistoryUpdate`](./plugin-api-events.md#sessionhistoryupdate) event.

```rust
pub struct SessionHistoryInfo {
    pub current: String,
    pub previous: Option<String>,
    pub back: Vec<String>,
    pub forward: Vec<String>,
    pub arrived_from: Option<String>,
    pub arrival: Option<SessionArrival>,
    pub arrived_at_ms: u64,
}

pub enum SessionArrival {
    Switch,
    Toggle,
    Back,
    Forward,
    Attention { pane_id: PaneId },
}
```

| Field | Type | Description |
|-------|------|-------------|
| `current` | `String` | The current session |
| `previous` | `Option<String>` | The session the user would toggle back to |
| `back` / `forward` | `Vec<String>` | Sessions to go back or forward to |
| `arrived_from` | `Option<String>` | The session the user came from |
| `arrival` | `Option<SessionArrival>` | How the user arrived: a switch, a toggle, back, forward, or by following a pane that needed attention |
| `arrived_at_ms` | `u64` | When the user arrived |

---

## `SessionTerminalRequest`

What to open in the [Zellij terminal](./zellij-terminal.md) desktop app, used by [`request_session_terminal`](./plugin-api-commands.md#request_session_terminal).

```rust
pub struct SessionTerminalRequest {
    pub session_name: Option<String>,
    pub new_window: bool,
    pub pane_id: Option<PaneId>,
    pub layout: Option<LayoutInfo>,
    pub cwd: Option<PathBuf>,
}
```

| Field | Type | Description |
|-------|------|-------------|
| `session_name` | `Option<String>` | The session to open; `None` creates a new session |
| `new_window` | `bool` | Open a new window even if one already shows this session |
| `pane_id` | `Option<PaneId>` | Pane to focus |
| `layout` | `Option<LayoutInfo>` | Layout for a new session |
| `cwd` | `Option<PathBuf>` | Working directory for a new session |

`SessionTerminalRequest::existing(session_name, pane_id, new_window)` and `SessionTerminalRequest::new_session(session_name, layout, cwd)` build the two common cases.

---

## `SessionSuggestions`

Ranked sessions, delivered with the [`SessionSuggestions`](./plugin-api-events.md#sessionsuggestions) event. See [session suggestions](./session-suggestions.md).

```rust
pub struct SessionSuggestions {
    pub folder: Option<String>,
    pub branch: Option<String>,
    pub columns: Vec<SessionSuggestionColumn>,
    pub suggestions: Vec<SessionSuggestion>,
    pub command_submitted: bool,
    pub from_script: bool,
    pub desktop_app_running: bool,
    pub desktop_window_sessions: Vec<String>,
}

pub struct SessionSuggestion {
    pub name: String,
    pub is_running: bool,
    pub last_used_secs_ago: u64,
    pub created_secs_ago: u64,
    pub folder: Option<String>,
    pub folder_relation: FolderRelation,
    pub repo: Option<String>,
    pub branch: Option<String>,
    pub facts: BTreeMap<String, String>,
    pub tier: Option<u32>,
    pub matching_columns: Vec<String>,
    pub script_label: Option<String>,
    pub tabs: Vec<SessionPreviewTab>,
    pub connected_clients: usize,
}
```

`folder` and `branch` describe where the user is now. Each suggestion's `folder_relation` is `Here`, `Subfolder` or `Other` relative to that folder. `columns` lists the extra facts (each with a `fact` key and a `title`) to show for each suggestion, read with `suggestion.fact_value(fact)`. `desktop_window_sessions` lists the sessions already open in a desktop window.

The related events carry two smaller types:

```rust
pub struct SessionCounts {
    pub running: u32,
    pub resumable_matching: u32,
}

pub struct FolderSessions {
    pub folder: String,
    pub running: Vec<String>,
    pub resumable: Vec<String>,
    pub full_match_running: Vec<String>,
}
```

---

## `SessionPreview`

The contents of another session, delivered with the [`SessionPreview`](./plugin-api-events.md#sessionpreview) and [`SavedSessionPreview`](./plugin-api-events.md#savedsessionpreview) events.

```rust
pub struct SessionPreview {
    pub session_name: String,
    pub tab_index: Option<usize>,
    pub active_tab_index: Option<usize>,
    pub tab_names: Vec<String>,
    pub contents: String,
    pub pane_count: usize,
    pub connected_clients: usize,
    pub error: Option<String>,
    pub tabs: Vec<SessionPreviewTab>,
    pub pane_id: Option<(u32, bool)>,
    pub anchor_line: Option<usize>,
}

pub struct SessionPreviewTab {
    pub name: String,
    pub active: bool,
    pub panes: Vec<SessionPreviewPane>,
}

pub struct SessionPreviewPane {
    pub id: u32,
    pub is_plugin: bool,
    pub title: String,
    pub focused: bool,
    pub contents: Option<String>,
}

pub enum PreviewAnchor {
    Bottom,
    LastCommandOutput,
    NewOutputStart,
}

pub struct SavedSessionPreview {
    pub session_name: String,
    pub folder: Option<String>,
    pub tabs: Vec<SavedTabPreview>,
    pub error: Option<String>,
}

pub struct SavedTabPreview {
    pub name: String,
    pub focused: bool,
    pub panes: Vec<SavedPanePreview>,
}

pub struct SavedPanePreview {
    pub title: Option<String>,
    pub command: Option<String>,
    pub cwd: Option<String>,
    pub contents: Option<String>,
    pub focused: bool,
}
```

`contents` is the screen of the previewed pane (the requested one, or the focused pane of the tab), including its ANSI color codes, and `error` is set when the preview could not be made. With an anchor, `anchor_line` is the line of `contents` the anchor points at. `PreviewAnchor` chooses where a pane preview starts: the bottom of the pane, the output of the last command, or the start of output the user has not seen yet.

---

## `LiveView`

A live view of another pane inside a plugin, set with [`set_live_view`](./plugin-api-commands.md#set_live_view).

```rust
pub struct LiveView {
    pub target: PaneAddress,
    pub x: usize,
    pub y: usize,
    pub cols: usize,
    pub rows: usize,
    pub resize_allowed: Option<bool>,
    pub view_only: bool,
}

pub struct PaneAddress {
    pub host: Option<HostId>,
    pub session: String,
    pub pane_id: PaneId,
}
```

| Field | Type | Description |
|-------|------|-------------|
| `target` | `PaneAddress` | The pane to show: its `session` and `pane_id`. `host` is `None` for this machine. An empty `session` shows nothing |
| `x`, `y`, `cols`, `rows` | `usize` | Where in the plugin's content area to show it |
| `resize_allowed` | `Option<bool>` | Whether the view may resize the program in the mirrored pane to its own size; `None` uses the `mirror_resizes_source_pane` option |
| `view_only` | `bool` | If `true`, the view never takes input |

`LiveView::new(target, x, y, cols, rows)` builds one with the defaults, and `PaneAddress::local(session, pane_id)` builds a target on this machine.

The state reported by [`LiveViewStateChanged`](./plugin-api-events.md#liveviewstatechanged) uses these types:

```rust
pub enum MirrorState {
    NoTarget,
    Connecting,
    Live,
    Closed(MirrorClosedReason),
}

pub enum MirrorClosedReason {
    PaneClosed,
    PaneNotFound,
    SessionEnding,
    Rejected,
    VersionMismatch,
    UnsupportedHost,
    ConnectionFailed,
    ConnectionLost,
    ProtocolError,
    ContainsViewer,
}

pub enum LiveViewRelease {
    Key,
    ClickOutside,
    FocusLost,
    Plugin,
    Cleared,
    NotAllowed,
}
```

`LiveViewRelease` tells why input went back to the plugin: the release key, a click outside the view, focus moving away, the plugin, the view being removed or replaced, or the capture not being allowed.

---

## `SettingKey`

Identifies one configuration setting, for the commands under [editing the configuration](./plugin-api-commands.md#editing-the-configuration). There is one variant per setting (eg. `SettingKey::Theme`, `SettingKey::MouseMode`, `SettingKey::FrameRoundedCorners`).

| Method | Description |
|--------|-------------|
| `key.id()` | The setting's full name, eg. `"theme"` or `"ui.pane_frames.rounded_corners"` |
| `SettingKey::from_id(id)` | The key for a full name |
| `key.kdl_name()` | The name of the setting's KDL node |
| `key.requires_restart()` | Whether a change only takes effect after a restart |
| `key.value_shape()` | The kind of value: `Flag`, `Number`, `Decimal`, `Text`, `List` or `Colour` |
| `SettingKey::all()` | Every key |

---

## `ConfigSnapshot`

The configuration as returned by [`read_config`](./plugin-api-commands.md#read_config).

```rust
pub struct ConfigSnapshot {
    pub settings: Vec<ConfigSettingState>,
    pub config_file_path: Option<String>,
    pub backup_file_path: Option<String>,
    pub pending_restart_settings: Vec<SettingKey>,
    pub theme_names: Vec<String>,
    pub plugin_aliases: Vec<String>,
    pub load_plugins: Vec<String>,
    pub env_vars: Vec<String>,
    pub context_menu_items: Vec<String>,
    pub blocks: ConfigBlocks,
    pub saved_blocks: ConfigBlocks,
    pub default_blocks: ConfigBlocks,
    pub keybindings: Vec<KeybindingEntry>,
    pub keybinds: KeybindsSelectionSnapshot,
    pub mousebindings: Vec<MousebindingEntry>,
    pub font_families: Vec<String>,
}

pub struct ConfigSettingState {
    pub key: SettingKey,
    pub saved_value: Option<String>,
    pub current_value: Option<String>,
    pub set_in_file: bool,
}
```

| Field | Description |
|-------|-------------|
| `settings` | Each setting's saved and current value (a setting is unsaved when they differ), and whether it is set in the file |
| `config_file_path` / `backup_file_path` | The configuration file and its backup |
| `pending_restart_settings` | Changed settings that only take effect after a restart |
| `theme_names`, `plugin_aliases`, `load_plugins`, `env_vars`, `context_menu_items` | Names available for display |
| `blocks`, `saved_blocks`, `default_blocks` | The current, saved and default configuration blocks (`ConfigBlocks`: plugin aliases, `load_plugins`, `env`, context menu sections and themes) |
| `keybindings` | Every keybinding (`KeybindingEntry`: mode, key, actions, where it comes from, and whether it is unbound or unsaved) |
| `keybinds` | The selected keybinding preset and its values (`KeybindsSelectionSnapshot`) |
| `mousebindings` | Every mouse binding (`MousebindingEntry`), like `keybindings` |
| `font_families` | Font families available to the [Zellij terminal](./zellij-terminal.md) |

`snapshot.setting(key)` finds one setting and `snapshot.unsaved_count()` counts the unsaved ones.

---

## `KeybindPresetInfo`

A keybinding preset, delivered with the [`AvailableKeybindPresets`](./plugin-api-events.md#availablekeybindpresets) event.

```rust
pub struct KeybindPresetInfo {
    pub name: String,
    pub display_name: String,
    pub description: Option<String>,
    pub source: KeybindPresetSource,
    pub placeholders: Vec<String>,
    pub path: Option<String>,
    pub examples: Vec<(String, String)>,
}

pub enum KeybindPresetSource {
    BuiltIn,
    Folder,
    File,
}

pub struct KeybindPresetWithError {
    pub name: String,
    pub path: String,
    pub error: String,
}
```

`placeholders` are the names of the values the preset lets the user choose, and `examples` are pairs of keys and what they do, from the preset's header, for display. `KeybindPresetWithError` describes a preset file that could not be read.
