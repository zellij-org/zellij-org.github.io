# Plugin API - Events

A plugin can [subscribe](./plugin-api-commands.md#subscribe) to events using their [`EventType`](./plugin-api-types.md#eventtype) discriminant. Once subscribed, events are delivered to the plugin's [`update`](./plugin-lifecycle.md#update) method with their associated payload.

For complete type definitions referenced below, see the [Type Reference](./plugin-api-types.md). For additional details, see the [`zellij-tile`](https://docs.rs/zellij-tile/latest/zellij_tile/) API documentation.

A plugin built with `zellij-tile` `0.46.0` or later that receives an event it cannot read (eg. one added in a newer Zellij version) skips it, printing a message to its log, instead of crashing.

## Table of Contents

- [ModeUpdate](#modeupdate)
- [TabUpdate](#tabupdate)
- [PaneUpdate](#paneupdate)
- [Key](#key)
- [Mouse](#mouse)
- [Timer](#timer)
- [CopyToClipboard](#copytoclipboard)
- [SystemClipboardFailure](#systemclipboardfailure)
- [InputReceived](#inputreceived)
- [Visible](#visible)
- [CustomMessage](#custommessage)
- [FileSystemCreate](#filesystemcreate)
- [FileSystemRead](#filesystemread)
- [FileSystemUpdate](#filesystemupdate)
- [FileSystemDelete](#filesystemdelete)
- [PermissionRequestResult](#permissionrequestresult)
- [SessionUpdate](#sessionupdate)
- [RunCommandResult](#runcommandresult)
- [WebRequestResult](#webrequestresult)
- [CommandPaneOpened](#commandpaneopened)
- [CommandPaneExited](#commandpaneexited)
- [PaneClosed](#paneclosed)
- [EditPaneOpened](#editpaneopened)
- [EditPaneExited](#editpaneexited)
- [CommandPaneReRun](#commandpanererun)
- [FailedToWriteConfigToDisk](#failedtowriteconfigtodisk)
- [ListClients](#listclients)
- [HostFolderChanged](#hostfolderchanged)
- [FailedToChangeHostFolder](#failedtochangehostfolder)
- [PastedText](#pastedtext)
- [ConfigWasWrittenToDisk](#configwaswrittentodisk)
- [WebServerStatus](#webserverstatus)
- [FailedToStartWebServer](#failedtostartwebserver)
- [BeforeClose](#beforeclose)
- [InterceptedKeyPress](#interceptedkeypress)
- [UserAction](#useraction)
- [PaneRenderReport](#panerenderreport)
- [ActionComplete](#actioncomplete)
- [CwdChanged](#cwdchanged)
- [AvailableLayoutInfo](#availablelayoutinfo)
- [PluginConfigurationChanged](#pluginconfigurationchanged)
- [HighlightClicked](#highlightclicked)
- [CommandChanged](#commandchanged)
- [HostTerminalThemeChanged](#hostterminalthemechanged)
- [InitialKeybinds](#initialkeybinds)
- [SoftKeyboardVisibilityChanged](#softkeyboardvisibilitychanged)
- [HintText](#hinttext)
- [ActivePaneScroll](#activepanescroll)
- [NestedSessionModeUpdate](#nestedsessionmodeupdate)
- [NestedSessionEnded](#nestedsessionended)
- [PromptResult](#promptresult)
- [ContextMenu](#contextmenu)
- [PluginSettingsEntries](#pluginsettingsentries)
- [ConfigChangesDropped](#configchangesdropped)
- [ConfigFileChangedSinceRead](#configfilechangedsinceread)
- [AvailableKeybindPresets](#availablekeybindpresets)
- [PaneAttentionChanged](#paneattentionchanged)
- [PromptShown](#promptshown)
- [CommandStarted](#commandstarted)
- [CommandFinished](#commandfinished)
- [GlobalAttentionUpdate](#globalattentionupdate)
- [SessionHistoryUpdate](#sessionhistoryupdate)
- [SessionSuggestions](#sessionsuggestions)
- [SessionCountsUpdate](#sessioncountsupdate)
- [FolderSessionsUpdate](#foldersessionsupdate)
- [TerminalCommandSubmitted](#terminalcommandsubmitted)
- [SessionPreview](#sessionpreview)
- [SavedSessionPreview](#savedsessionpreview)
- [LiveViewStateChanged](#liveviewstatechanged)
- [DesktopIntegration](#desktopintegration)

---

## `ModeUpdate`

```rust
Event::ModeUpdate(ModeInfo)
```

**Required Permission:** [`ReadApplicationState`](./plugin-api-permissions.md)

**Payload:** [`ModeInfo`](./plugin-api-types.md#modeinfo)

Fired when the input mode or relevant session metadata changes. Provides information about the current input mode (e.g., `Normal`, `Locked`, `Pane`, `Tab`), bound keys, the active theme colors, and the session name.

**Note:** plugins that subscribe to [`InitialKeybinds`](#initialkeybinds) receive the keybindings through that event instead, and their `ModeUpdate` events arrive with an empty `keybinds` field from then on - this keeps the frequently fired `ModeUpdate` lightweight.

**Example:**

```rust
fn update(&mut self, event: Event) -> bool {
    match event {
        Event::ModeUpdate(mode_info) => {
            self.current_mode = mode_info.mode;
            self.session_name = mode_info.session_name.clone();
            true
        },
        _ => false,
    }
}
```

---

## `TabUpdate`

```rust
Event::TabUpdate(Vec<TabInfo>)
```

**Required Permission:** [`ReadApplicationState`](./plugin-api-permissions.md)

**Payload:** `Vec<`[`TabInfo`](./plugin-api-types.md#tabinfo)`>`

Fired when tab state changes in the application. Provides a list of all tabs with their position, name, active status, pane counts, swap layout information, and viewport dimensions.

**Example:**

```rust
fn update(&mut self, event: Event) -> bool {
    match event {
        Event::TabUpdate(tabs) => {
            self.tabs = tabs;
            if let Some(active) = self.tabs.iter().find(|t| t.active) {
                self.active_tab_name = active.name.clone();
            }
            true
        },
        _ => false,
    }
}
```

---

## `PaneUpdate`

```rust
Event::PaneUpdate(PaneManifest)
```

**Required Permission:** [`ReadApplicationState`](./plugin-api-permissions.md)

**Payload:** [`PaneManifest`](./plugin-api-types.md#panemanifest)

Fired when pane state changes in the application. Provides information about all panes in all tabs, including their title, position, size, command, focus state, and more.

Plugins without the [`ReadPaneContents`](./plugin-api-permissions.md#readpanecontents) permission receive the `attention` and `command_state` of each [`PaneInfo`](./plugin-api-types.md#paneinfo) without the text of the commands run in the pane. The same applies to the panes in [`SessionUpdate`](#sessionupdate).

**Example:**

```rust
fn update(&mut self, event: Event) -> bool {
    match event {
        Event::PaneUpdate(pane_manifest) => {
            self.pane_manifest = pane_manifest;
            true
        },
        _ => false,
    }
}
```

---

## `Key`

```rust
Event::Key(KeyWithModifier)
```

**Payload:** [`KeyWithModifier`](./plugin-api-types.md#keywithmodifier)

Fired when the user presses a key while focused on this plugin's pane. No permission is required - this event is always available for the plugin's own pane.

**Example:**

```rust
fn update(&mut self, event: Event) -> bool {
    match event {
        Event::Key(key) => {
            match key.bare_key {
                BareKey::Char('q') if key.has_no_modifiers() => {
                    close_self();
                },
                BareKey::Enter => {
                    self.handle_enter();
                },
                _ => {},
            }
            true
        },
        _ => false,
    }
}
```

---

## `Mouse`

```rust
Event::Mouse(Mouse)
```

**Payload:** [`Mouse`](./plugin-api-types.md#mouse)

Fired when the user performs a mouse action (click, double click, scroll, hover, etc.) while focused on the plugin pane. No permission is required.

The modifier keys held during the event (`Shift`, `Ctrl`, `Alt`) are available while handling it through [`mouse_modifiers`](./plugin-api-commands.md#mouse_modifiers). Plugins built against an older `zellij-tile` do not receive `Mouse::DoubleClick`.

> **Note:** the `EventType::MouseWithModifiers` and `Event::MouseWithModifiers` variants are used inside Zellij only: plugins subscribe to `EventType::Mouse` and receive `Event::Mouse`.

**Example:**

```rust
fn update(&mut self, event: Event) -> bool {
    match event {
        Event::Mouse(Mouse::LeftClick(line, col)) => {
            self.handle_click(line as usize, col);
            true
        },
        Event::Mouse(Mouse::ScrollUp(_)) => {
            self.scroll_offset += 1;
            true
        },
        Event::Mouse(Mouse::ScrollDown(_)) => {
            self.scroll_offset = self.scroll_offset.saturating_sub(1);
            true
        },
        _ => false,
    }
}
```

---

## `Timer`

```rust
Event::Timer(f64)
```

**Payload:** `f64` - the duration (in seconds) that was originally set

Fired when a timer set by [`set_timeout`](./plugin-api-commands.md#set_timeout) expires. No permission is required.

**Example:**

```rust
fn load(&mut self, _config: BTreeMap<String, String>) {
    subscribe(&[EventType::Timer]);
    set_timeout(1.0);
}

fn update(&mut self, event: Event) -> bool {
    match event {
        Event::Timer(elapsed) => {
            self.tick();
            set_timeout(1.0);
            true
        },
        _ => false,
    }
}
```

---

## `CopyToClipboard`

```rust
Event::CopyToClipboard(CopyDestination)
```

**Required Permission:** [`ReadApplicationState`](./plugin-api-permissions.md)

**Payload:** [`CopyDestination`](./plugin-api-types.md#copydestination)

Fired when the user copies text to their clipboard anywhere in the application. The payload indicates the clipboard destination (`System`, `Primary`, or `Command`).

---

## `SystemClipboardFailure`

```rust
Event::SystemClipboardFailure
```

**Required Permission:** [`ReadApplicationState`](./plugin-api-permissions.md)

**Payload:** *(none)*

Fired when the system fails to copy text to the clipboard.

---

## `InputReceived`

```rust
Event::InputReceived
```

**Payload:** *(none)*

Fired whenever any input is received anywhere in Zellij. Does not specify which input was received. No permission is required.

---

## `Visible`

```rust
Event::Visible(bool)
```

**Payload:** `bool` - `true` if the plugin became visible, `false` if it became invisible

Fired when the plugin pane becomes visible or invisible (e.g., when switching tabs to or away from the plugin's tab). No permission is required.

**Example:**

```rust
fn update(&mut self, event: Event) -> bool {
    match event {
        Event::Visible(is_visible) => {
            self.is_visible = is_visible;
            if is_visible {
                self.refresh();
            }
            true
        },
        _ => false,
    }
}
```

---

## `CustomMessage`

```rust
Event::CustomMessage(String, String)
```

**Payload:** `(String, String)` - `(message_name, payload)`

Fired when a message is received from one of the plugin's workers via [`post_message_to_plugin`](./plugin-api-commands.md#post_message_to_plugin). No permission is required. See [Workers for Async Tasks](./plugin-api-workers.md) for details.

**Example:**

```rust
fn update(&mut self, event: Event) -> bool {
    match event {
        Event::CustomMessage(name, payload) => {
            if name == "fetch_complete" {
                self.data = serde_json::from_str(&payload).ok();
                true
            } else {
                false
            }
        },
        _ => false,
    }
}
```

---

## `FileSystemCreate`

```rust
Event::FileSystemCreate(Vec<(PathBuf, Option<FileMetadata>)>)
```

**Payload:** `Vec<(PathBuf, Option<`[`FileMetadata`](./plugin-api-types.md#filemetadata)`)>)` - paths and optional metadata of created files

Fired when files are created in the Zellij host folder. The plugin must call [`watch_filesystem`](./plugin-api-commands.md#watch_filesystem) to start receiving these events. No permission is required beyond subscribing.

---

## `FileSystemRead`

```rust
Event::FileSystemRead(Vec<(PathBuf, Option<FileMetadata>)>)
```

**Payload:** `Vec<(PathBuf, Option<FileMetadata>)>` - paths and optional metadata of accessed files

Fired when files are read/accessed in the Zellij host folder.

---

## `FileSystemUpdate`

```rust
Event::FileSystemUpdate(Vec<(PathBuf, Option<FileMetadata>)>)
```

**Payload:** `Vec<(PathBuf, Option<FileMetadata>)>` - paths and optional metadata of modified files

Fired when files are modified in the Zellij host folder.

**Example:**

```rust
fn update(&mut self, event: Event) -> bool {
    match event {
        Event::FileSystemUpdate(files) => {
            for (path, metadata) in &files {
                if path.extension().map_or(false, |ext| ext == "rs") {
                    self.rust_files_changed = true;
                }
            }
            true
        },
        _ => false,
    }
}
```

---

## `FileSystemDelete`

```rust
Event::FileSystemDelete(Vec<(PathBuf, Option<FileMetadata>)>)
```

**Payload:** `Vec<(PathBuf, Option<FileMetadata>)>` - paths and optional metadata of deleted files

Fired when files are deleted from the Zellij host folder.

---

## `PermissionRequestResult`

```rust
Event::PermissionRequestResult(PermissionStatus)
```

**Payload:** [`PermissionStatus`](./plugin-api-types.md#permissionstatus) - `Granted` or `Denied`

Fired after [`request_permission`](./plugin-api-commands.md#request_permission) is called and the user responds. No permission is required.

**Example:**

```rust
fn update(&mut self, event: Event) -> bool {
    match event {
        Event::PermissionRequestResult(PermissionStatus::Granted) => {
            subscribe(&[EventType::TabUpdate, EventType::PaneUpdate]);
            true
        },
        Event::PermissionRequestResult(PermissionStatus::Denied) => {
            eprintln!("Permissions denied - plugin functionality limited");
            true
        },
        _ => false,
    }
}
```

---

## `SessionUpdate`

```rust
Event::SessionUpdate(Vec<SessionInfo>, Vec<(String, Duration)>)
```

**Required Permission:** [`ReadApplicationState`](./plugin-api-permissions.md)

**Payload:**
- `Vec<`[`SessionInfo`](./plugin-api-types.md#sessioninfo)`>` - list of active sessions
- `Vec<(String, Duration)>` - list of resurrectable sessions `(name, time_since_death)`

Fired when session state changes, providing information about all active sessions of the current Zellij version and all resurrectable (dead) sessions.

**Example:**

```rust
fn update(&mut self, event: Event) -> bool {
    match event {
        Event::SessionUpdate(sessions, resurrectable) => {
            self.sessions = sessions;
            self.dead_sessions = resurrectable;
            true
        },
        _ => false,
    }
}
```

---

## `RunCommandResult`

```rust
Event::RunCommandResult(Option<i32>, Vec<u8>, Vec<u8>, BTreeMap<String, String>)
```

**Payload:**
- `Option<i32>` - exit code (if the command exited normally)
- `Vec<u8>` - stdout
- `Vec<u8>` - stderr
- `BTreeMap<String, String>` - the context dictionary provided when running the command

Fired after a command executed with [`run_command`](./plugin-api-commands.md#run_command) completes. No permission is required beyond the `RunCommands` permission used to initiate the command.

**Example:**

```rust
fn update(&mut self, event: Event) -> bool {
    match event {
        Event::RunCommandResult(exit_code, stdout, stderr, context) => {
            if context.get("request_id") == Some(&"git-status".to_string()) {
                let output = String::from_utf8_lossy(&stdout);
                self.git_status = output.to_string();
            }
            true
        },
        _ => false,
    }
}
```

---

## `WebRequestResult`

```rust
Event::WebRequestResult(u16, BTreeMap<String, String>, Vec<u8>, BTreeMap<String, String>)
```

**Payload:**
- `u16` - HTTP status code
- `BTreeMap<String, String>` - response headers
- `Vec<u8>` - response body
- `BTreeMap<String, String>` - the context dictionary provided when making the request

Fired after a web request made with [`web_request`](./plugin-api-commands.md#web_request) completes. No permission is required beyond the `WebAccess` permission used to initiate the request.

**Example:**

```rust
fn update(&mut self, event: Event) -> bool {
    match event {
        Event::WebRequestResult(status, headers, body, context) => {
            if status == 200 {
                let body_str = String::from_utf8_lossy(&body);
                self.api_response = Some(body_str.to_string());
            }
            true
        },
        _ => false,
    }
}
```

---

## `CommandPaneOpened`

```rust
Event::CommandPaneOpened(u32, BTreeMap<String, String>)
```

**Required Permission:** [`ReadApplicationState`](./plugin-api-permissions.md)

**Payload:**
- `u32` - terminal pane ID of the opened command pane
- `BTreeMap<String, String>` - the context dictionary provided when opening the pane

Fired when a command pane opened with one of the `open_command_pane*` [plugin commands](./plugin-api-commands.md) has been created.

---

## `CommandPaneExited`

```rust
Event::CommandPaneExited(u32, Option<i32>, BTreeMap<String, String>)
```

**Required Permission:** [`ReadApplicationState`](./plugin-api-permissions.md)

**Payload:**
- `u32` - terminal pane ID
- `Option<i32>` - exit code of the command (if available)
- `BTreeMap<String, String>` - context dictionary

Fired when the command inside a command pane has exited. Note that this does not mean the pane is closed - the pane remains open in a "held" state, allowing the user to re-run the command. This event can fire multiple times if the user re-runs the command.

---

## `PaneClosed`

```rust
Event::PaneClosed(PaneId)
```

**Required Permission:** [`ReadApplicationState`](./plugin-api-permissions.md)

**Payload:** [`PaneId`](./plugin-api-types.md#paneid) - the ID of the closed pane

Fired when a pane in the current session is closed.

**Example:**

```rust
fn update(&mut self, event: Event) -> bool {
    match event {
        Event::PaneClosed(pane_id) => {
            self.tracked_panes.remove(&pane_id);
            true
        },
        _ => false,
    }
}
```

---

## `EditPaneOpened`

```rust
Event::EditPaneOpened(u32, BTreeMap<String, String>)
```

**Required Permission:** [`ReadApplicationState`](./plugin-api-permissions.md)

**Payload:**
- `u32` - terminal pane ID of the editor pane
- `BTreeMap<String, String>` - context dictionary

Fired when an editor pane opened with one of the `open_file*` [plugin commands](./plugin-api-commands.md) has been created.

---

## `EditPaneExited`

```rust
Event::EditPaneExited(u32, Option<i32>, BTreeMap<String, String>)
```

**Required Permission:** [`ReadApplicationState`](./plugin-api-permissions.md)

**Payload:**
- `u32` - terminal pane ID of the editor pane
- `Option<i32>` - editor exit code (if available)
- `BTreeMap<String, String>` - context dictionary

Fired when the editor process inside an editor pane has exited.

---

## `CommandPaneReRun`

```rust
Event::CommandPaneReRun(u32, BTreeMap<String, String>)
```

**Required Permission:** [`ReadApplicationState`](./plugin-api-permissions.md)

**Payload:**
- `u32` - terminal pane ID
- `BTreeMap<String, String>` - context dictionary

Fired when a command pane's command has been re-run. This is often triggered by the user pressing `Enter` when focused on a held command pane, but can also be triggered programmatically via [`rerun_command_pane`](./plugin-api-commands.md#rerun_command_pane).

---

## `FailedToWriteConfigToDisk`

```rust
Event::FailedToWriteConfigToDisk(Option<String>)
```

**Required Permission:** [`ReadApplicationState`](./plugin-api-permissions.md)

**Payload:** `Option<String>` - error message or file path (if available)

Fired when the plugin attempted to write configuration to disk (via [`reconfigure`](./plugin-api-commands.md#reconfigure) with `save_configuration_file: true`) and there was an error (e.g., the file was read-only).

---

## `ListClients`

```rust
Event::ListClients(Vec<ClientInfo>)
```

**Required Permission:** [`ReadApplicationState`](./plugin-api-permissions.md)

**Payload:** `Vec<`[`ClientInfo`](./plugin-api-types.md#clientinfo)`>`

Fired as a result of the [`list_clients`](./plugin-api-commands.md#list_clients) command. Contains information about all connected clients in the session, including their ID, focused pane, running command, and whether they are the current client.

**Example:**

```rust
fn update(&mut self, event: Event) -> bool {
    match event {
        Event::ListClients(clients) => {
            self.clients = clients;
            let current = self.clients.iter().find(|c| c.is_current_client);
            true
        },
        _ => false,
    }
}
```

---

## `HostFolderChanged`

```rust
Event::HostFolderChanged(PathBuf)
```

**Payload:** `PathBuf` - the new host folder path

Fired when the host folder (working directory) has been changed, either via [`change_host_folder`](./plugin-api-commands.md#change_host_folder) or by other means. No permission is required.

---

## `FailedToChangeHostFolder`

```rust
Event::FailedToChangeHostFolder(Option<String>)
```

**Payload:** `Option<String>` - error message (if available)

Fired when an attempt to change the host folder failed. No permission is required.

---

## `PastedText`

```rust
Event::PastedText(String)
```

**Payload:** `String` - the pasted text

Fired when the user pastes text while focused on this plugin's pane. No permission is required.

**Example:**

```rust
fn update(&mut self, event: Event) -> bool {
    match event {
        Event::PastedText(text) => {
            self.input_buffer.push_str(&text);
            true
        },
        _ => false,
    }
}
```

---

## `ConfigWasWrittenToDisk`

```rust
Event::ConfigWasWrittenToDisk
```

**Payload:** *(none)*

Fired when configuration was successfully saved to the configuration file listened to by the current session. No permission is required.

---

## `WebServerStatus`

```rust
Event::WebServerStatus(WebServerStatus)
```

**Payload:** [`WebServerStatus`](./plugin-api-types.md#webserverstatus)

Fired as a reply to the [`query_web_server_status`](./plugin-api-commands.md#query_web_server_status) command, or when the web server status changes. The payload can be `Online(base_url)`, `Offline`, or `DifferentVersion(version)`.

**Example:**

```rust
fn update(&mut self, event: Event) -> bool {
    match event {
        Event::WebServerStatus(WebServerStatus::Online(url)) => {
            self.web_url = Some(url);
            true
        },
        Event::WebServerStatus(WebServerStatus::Offline) => {
            self.web_url = None;
            true
        },
        _ => false,
    }
}
```

---

## `FailedToStartWebServer`

```rust
Event::FailedToStartWebServer(String)
```

**Payload:** `String` - error message

Fired when Zellij failed to start the web server after a [`start_web_server`](./plugin-api-commands.md#start_web_server) command.

---

## `BeforeClose`

```rust
Event::BeforeClose
```

**Payload:** *(none)*

Fired before the plugin is being unloaded. This provides an opportunity for the plugin to perform cleanup operations. The plugin must subscribe to this event to receive it. No permission is required.

**Example:**

```rust
fn load(&mut self, _config: BTreeMap<String, String>) {
    subscribe(&[EventType::BeforeClose]);
}

fn update(&mut self, event: Event) -> bool {
    match event {
        Event::BeforeClose => {
            self.save_state();
            false
        },
        _ => false,
    }
}
```

---

## `InterceptedKeyPress`

```rust
Event::InterceptedKeyPress(KeyWithModifier)
```

**Required Permission:** [`InterceptInput`](./plugin-api-permissions.md)

**Payload:** [`KeyWithModifier`](./plugin-api-types.md#keywithmodifier)

Similar to the `Key` event, but represents a key press that was intercepted after the [`intercept_key_presses`](./plugin-api-commands.md#intercept_key_presses) command was issued. Intercepted keys are consumed by the plugin and are not processed by Zellij's normal key handling.

**Example:**

```rust
fn update(&mut self, event: Event) -> bool {
    match event {
        Event::InterceptedKeyPress(key) => {
            if key.bare_key == BareKey::Esc {
                clear_key_presses_intercepts();
            } else {
                self.handle_intercepted_key(key);
            }
            true
        },
        _ => false,
    }
}
```

---

## `UserAction`

```rust
Event::UserAction(Action, ClientId, Option<u32>, Option<ClientId>)
```

**Required Permission:** [`InterceptInput`](./plugin-api-permissions.md)

**Payload:**
- [`Action`](./plugin-api-types.md#action) - the action that was performed
- `ClientId` - the client that performed the action
- `Option<u32>` - terminal ID (if applicable)
- `Option<ClientId>` - CLI client ID (if the action originated from the CLI)

Fired when any action is performed by a user. This is useful for observing all user activity in the session.

---

## `PaneRenderReport`

```rust
Event::PaneRenderReport(HashMap<PaneId, PaneContents>)
```

**Required Permission:** [`ReadPaneContents`](./plugin-api-permissions.md)

**Payload:** `HashMap<`[`PaneId`](./plugin-api-types.md#paneid)`, `[`PaneContents`](./plugin-api-types.md#panecontents)`>`

Provides the rendered content of subscribed panes with ANSI escape codes stripped. This event is fired periodically for panes the plugin has subscribed to observe.

---

## `ActionComplete`

```rust
Event::ActionComplete(Action, Option<PaneId>, BTreeMap<String, String>)
```

**Payload:**
- [`Action`](./plugin-api-types.md#action) - the action that completed
- `Option<`[`PaneId`](./plugin-api-types.md#paneid)`>` - the resulting pane ID (if applicable)
- `BTreeMap<String, String>` - the context dictionary provided when running the action

Fired when an action executed via [`run_action`](./plugin-api-commands.md#run_action) has completed. No permission is required beyond the `RunActionsAsUser` permission used to initiate the action.

**Example:**

```rust
fn update(&mut self, event: Event) -> bool {
    match event {
        Event::ActionComplete(action, pane_id, context) => {
            if context.get("request_id") == Some(&"my-action".to_string()) {
                if let Some(pane_id) = pane_id {
                    self.created_pane = Some(pane_id);
                }
            }
            true
        },
        _ => false,
    }
}
```

---

## `CwdChanged`

```rust
Event::CwdChanged(PaneId, PathBuf, Vec<ClientId>)
```

**Payload:**
- [`PaneId`](./plugin-api-types.md#paneid) - the pane whose working directory changed
- `PathBuf` - the new working directory
- `Vec<ClientId>` - client IDs that have this pane focused

Fired when the working directory changes in a terminal pane. No permission is required.

**Example:**

```rust
fn update(&mut self, event: Event) -> bool {
    match event {
        Event::CwdChanged(pane_id, new_cwd, _focused_clients) => {
            self.pane_cwds.insert(pane_id, new_cwd);
            true
        },
        _ => false,
    }
}
```

---

## `AvailableLayoutInfo`

```rust
Event::AvailableLayoutInfo(Vec<LayoutInfo>, Vec<LayoutWithError>)
```

**Payload:**
- `Vec<`[`LayoutInfo`](./plugin-api-types.md#layoutinfo)`>` - available layouts
- `Vec<LayoutWithError>` - layouts that had parse errors

Fired when the available layouts change (e.g., when a layout file is added, modified, or deleted in the layout directory). No permission is required.

---

## `PluginConfigurationChanged`

```rust
Event::PluginConfigurationChanged(BTreeMap<String, String>)
```

**Payload:** `BTreeMap<String, String>` - the updated configuration key-value pairs

Fired when the plugin's configuration is modified at runtime. No permission is required.

**Important caveat:** When plugin configuration changes at runtime, the plugin's identity (used for pipe messages and self-referencing) remains tied to the original configuration at load time. This means that if another plugin or CLI pipe targets this plugin by its configuration, the original configuration values must be used, not the updated ones. Plugin developers should account for this when designing configuration-dependent communication patterns.

**Example:**

```rust
fn update(&mut self, event: Event) -> bool {
    match event {
        Event::PluginConfigurationChanged(config) => {
            self.apply_configuration(config);
            true
        },
        _ => false,
    }
}
```

---

## `HighlightClicked`

```rust
Event::HighlightClicked {
    pane_id: PaneId,
    pattern: String,
    matched_string: String,
    context: BTreeMap<String, String>,
}
```

**Payload:**
- `pane_id` - [`PaneId`](./plugin-api-types.md#paneid) - the pane containing the clicked highlight
- `pattern` - `String` - the regex pattern that matched
- `matched_string` - `String` - the actual text that was matched (if the pattern contains a capture group, this is the content of group 1 rather than the full match)
- `context` - `BTreeMap<String, String>` - the context dictionary provided when setting up the highlight

Fired when the user clicks on a regex highlight set by [`set_pane_regex_highlights`](./plugin-api-commands.md#set_pane_regex_highlights).

**Example:**

```rust
fn update(&mut self, event: Event) -> bool {
    match event {
        Event::HighlightClicked { pane_id, pattern, matched_string, context } => {
            if pattern.contains("https?://") {
                run_command(&["xdg-open", &matched_string], BTreeMap::new());
            }
            true
        },
        _ => false,
    }
}
```

---

## `CommandChanged`

```rust
Event::CommandChanged(PaneId, Vec<String>, bool, Vec<ClientId>)
```

**Required Permission:** [`ReadApplicationState`](./plugin-api-permissions.md)

**Payload:**
- [`PaneId`](./plugin-api-types.md#paneid) - the pane whose running command changed
- `Vec<String>` - the new command and its arguments (argv)
- `bool` - `true` if the new command is the foreground process in the pane
- `Vec<ClientId>` - client IDs that have this pane focused

Fired when the foreground command running inside a terminal pane changes (for example when a user runs `vim` from a shell, or when that program exits and the shell becomes foreground again).

**Example:**

```rust
fn update(&mut self, event: Event) -> bool {
    match event {
        Event::CommandChanged(pane_id, command, is_foreground, _focused_clients) => {
            if is_foreground {
                self.pane_commands.insert(pane_id, command);
            }
            true
        },
        _ => false,
    }
}
```

---

## `HostTerminalThemeChanged`

```rust
Event::HostTerminalThemeChanged(HostTerminalThemeMode)
```

**Payload:**
- [`HostTerminalThemeMode`](./plugin-api-types.md#hostterminalthememode) - `Dark` or `Light`

Fired when the host terminal reports a change to its color-scheme mode via CSI 2031 / DSR 997 (the same mechanism Zellij uses internally to switch between [`theme_dark`](./options.md#theme_dark) and [`theme_light`](./options.md#theme_light)). Useful for plugins that want to re-render with a matching palette. No permission is required.

**Example:**

```rust
fn update(&mut self, event: Event) -> bool {
    match event {
        Event::HostTerminalThemeChanged(mode) => {
            self.is_dark = matches!(mode, HostTerminalThemeMode::Dark);
            true
        },
        _ => false,
    }
}
```

---

## `InitialKeybinds`

```rust
Event::InitialKeybinds(KeybindsVec)
```

**Payload:**
- `KeybindsVec` - `Vec<(`[`InputMode`](./plugin-api-types.md#inputmode)`, Vec<(`[`KeyWithModifier`](./plugin-api-types.md#keywithmodifier)`, Vec<`[`Action`](./plugin-api-types.md#action)`>)>)>` - the keybindings of all input modes

Fired once when subscribing to this event, and again after every keybinding reconfiguration (eg. through [`rebind_keys`](./plugin-api-commands.md#rebind_keys) or a configuration reload). No permission is required.

Plugins that need the keybindings should prefer this event over reading them from [`ModeUpdate`](#modeupdate): once subscribed, `ModeUpdate` events arrive with an empty `keybinds` field, which makes them considerably cheaper.

**Example:**

```rust
fn update(&mut self, event: Event) -> bool {
    match event {
        Event::InitialKeybinds(keybinds) => {
            self.keybinds = keybinds;
            true
        },
        _ => false,
    }
}
```

---

## `SoftKeyboardVisibilityChanged`

```rust
Event::SoftKeyboardVisibilityChanged(bool)
```

**Required Permission:** [`ReadApplicationState`](./plugin-api-permissions.md)

**Payload:**
- `bool` - `true` if the on-screen keyboard is now visible

Fired when the on-screen (soft) keyboard of the client displaying this plugin is shown or hidden. Only relevant for clients connected through the [web client](./web-client.md) on a mobile device. The keyboard can also be shown or hidden by the plugin itself with [`set_soft_keyboard`](./plugin-api-commands.md#set_soft_keyboard).

---

## `HintText`

```rust
Event::HintText(BTreeMap<usize, StyledText>)
```

**Required Permission:** [`ReadApplicationState`](./plugin-api-permissions.md)

**Payload:**
- `BTreeMap<usize, `[`StyledText`](./plugin-api-types.md#styledtext)`>` - hint text variants keyed by the display width they are intended for

Provides the contextual hint text Zellij would like to display (eg. what the user can do with the currently focused pane or stack). Several variants of the same hint are provided, each fitting a different width - the plugin should render the widest variant that fits in the space it has.

**Example:**

```rust
fn update(&mut self, event: Event) -> bool {
    match event {
        Event::HintText(variants) => {
            self.hint = variants
                .into_iter()
                .filter(|(width, _)| *width <= self.available_width)
                .last()
                .map(|(_, text)| text);
            true
        },
        _ => false,
    }
}
```

---

## `ActivePaneScroll`

```rust
Event::ActivePaneScroll(Option<(usize, usize)>)
```

**Required Permission:** [`ReadApplicationState`](./plugin-api-permissions.md)

**Payload:**
- `Option<(usize, usize)>` - the scroll position and the total length of the scrollback of the displayed pane, or `None` if this information is unavailable

Fired when the scroll position of the single displayed pane changes. This is only sent when the session displays a single pane with a title (ie. when the [`pane_frame_style`](./options.md#pane_frame_style) is `titles` and only one pane is displayed), which is the case where a plugin (eg. a tab-bar) may want to render a scrollbar or a scroll indicator for it.

---

## `NestedSessionModeUpdate`

```rust
Event::NestedSessionModeUpdate {
    pane_id: PaneId,
    session_path: Vec<String>,
    mode: InputMode,
    base_mode: Option<InputMode>,
    keybinds_generation: u64,
}
```

**Required Permission:** [`ReadApplicationState`](./plugin-api-permissions.md)

**Payload:**
- `pane_id` - [`PaneId`](./plugin-api-types.md#paneid) - the pane the [nested session](./nested-sessions.md) runs in
- `session_path` - `Vec<String>` - the names of the nested sessions, starting with the one in this pane; when sessions are nested more than one level deep, the last name is the session the user is typing into
- `mode` - [`InputMode`](./plugin-api-types.md#inputmode) - the current input mode of that session
- `base_mode` - `Option<`[`InputMode`](./plugin-api-types.md#inputmode)`>` - its base mode
- `keybinds_generation` - `u64` - changes whenever the keybindings that apply may have changed

Fired when the input mode of a nested session changes. This lets a plugin in the host session (eg. a status bar) show hints for the session the user is actually typing into. When `keybinds_generation` differs from the one of the keybindings the plugin has, it can fetch new ones with [`get_nested_session_keybinds`](./plugin-api-commands.md#get_nested_session_keybinds).

---

## `NestedSessionEnded`

```rust
Event::NestedSessionEnded {
    pane_id: PaneId,
    reason: NestedSessionEndReason,
}
```

**Required Permission:** [`ReadApplicationState`](./plugin-api-permissions.md)

**Payload:**
- `pane_id` - [`PaneId`](./plugin-api-types.md#paneid) - the pane the nested session ran in
- `reason` - [`NestedSessionEndReason`](./plugin-api-types.md#nestedsessionkeybinds) - `Exited` or `Unresponsive`

Fired when a nested session stops reporting to this session, because it exited or stopped responding. Plugins should stop showing its mode and keybindings.

---

## `PromptResult`

```rust
Event::PromptResult(u64, PromptResult)
```

**Payload:**
- `u64` - the request id returned by [`prompt`](./plugin-api-commands.md#prompt)
- [`PromptResult`](./plugin-api-types.md#promptresult) - the answer

The answer to a [`prompt`](./plugin-api-commands.md#prompt) request. It is sent only to the plugin instance that made the request. No permission is required to receive it.

---

## `ContextMenu`

```rust
Event::ContextMenu(ContextMenuContext, Vec<ContextMenuEntry>)
```

**Required Permission:** [`ReadApplicationState`](./plugin-api-permissions.md)

**Payload:**
- [`ContextMenuContext`](./plugin-api-types.md#contextmenucontext) - what was clicked and where
- `Vec<`[`ContextMenuEntry`](./plugin-api-types.md#contextmenucontext)`>` - the entries to show

Sent to the plugin that shows the [context menu](./context-menu.md) (by default the built-in [`context-menu`](./context-menu-alias.md) plugin) when it is opened as a popup. The plugin runs an entry with [`run_context_menu_item`](./plugin-api-commands.md#run_context_menu_item), passing the index of the entry in this list.

---

## `PluginSettingsEntries`

```rust
Event::PluginSettingsEntries(Vec<PluginSettingsEntry>)
```

**Required Permission:** [`ReadApplicationState`](./plugin-api-permissions.md)

**Payload:**
- `Vec<`[`PluginSettingsEntry`](./plugin-api-types.md#pluginsettingsentry)`>` - every settings screen entry plugins have registered

Sent when the plugin loads, and again whenever plugins register or remove a [settings screen entry](./plugin-api-commands.md#register_settings_entry). Used by the [settings screen](./settings-screen.md) to list them.

---

## `ConfigChangesDropped`

```rust
Event::ConfigChangesDropped(Vec<SettingKey>)
```

**Required Permission:** [`Reconfigure`](./plugin-api-permissions.md)

**Payload:**
- `Vec<`[`SettingKey`](./plugin-api-types.md#settingkey)`>` - the settings whose unsaved changes were dropped

Fired when the saved configuration changes (eg. the file was edited) and this replaces unsaved changes the user had made to these settings.

---

## `ConfigFileChangedSinceRead`

```rust
Event::ConfigFileChangedSinceRead
```

**Required Permission:** [`Reconfigure`](./plugin-api-permissions.md)

Fired when [`save_config`](./plugin-api-commands.md#save_config) did not write the configuration file because it was changed by something else since Zellij read it, and when the file is changed outside of Zellij. The plugin can then offer to [overwrite](./plugin-api-commands.md#overwrite_config_file) or [reload](./plugin-api-commands.md#reload_config_file) it.

---

## `AvailableKeybindPresets`

```rust
Event::AvailableKeybindPresets(Vec<KeybindPresetInfo>, Vec<KeybindPresetWithError>)
```

**Required Permission:** [`ReadApplicationState`](./plugin-api-permissions.md)

**Payload:**
- `Vec<`[`KeybindPresetInfo`](./plugin-api-types.md#keybindpresetinfo)`>` - the keybinding presets that can be used
- `Vec<`[`KeybindPresetWithError`](./plugin-api-types.md#keybindpresetinfo)`>` - preset files that could not be read, with the error

Sent when the plugin loads with the list of keybinding presets (built in, and from the keybinds folder), and again whenever that list changes.

---

## `PaneAttentionChanged`

```rust
Event::PaneAttentionChanged(PaneId, PaneAttention)
```

**Required Permission:** [`ReadApplicationState`](./plugin-api-permissions.md)

**Payload:**
- [`PaneId`](./plugin-api-types.md#paneid) - the pane
- [`PaneAttention`](./plugin-api-types.md#paneattention) - its new attention state

Fired when the attention state of a pane in this session changes (eg. its command finished, failed, or is waiting for the user). See the [inbox](./inbox.md). Without the [`ReadPaneContents`](./plugin-api-permissions.md#readpanecontents) permission, the command text is left out.

---

## `PromptShown`

```rust
Event::PromptShown(PaneId)
```

**Required Permission:** [`ReadApplicationState`](./plugin-api-permissions.md)

**Payload:**
- [`PaneId`](./plugin-api-types.md#paneid) - the pane

Fired when a shell prompt is shown in a pane whose shell reports its prompts ([shell integration](./shell-integration.md)).

---

## `CommandStarted`

```rust
Event::CommandStarted(PaneId, Option<CommandText>)
```

**Required Permission:** [`ReadApplicationState`](./plugin-api-permissions.md)

**Payload:**
- [`PaneId`](./plugin-api-types.md#paneid) - the pane
- `Option<`[`CommandText`](./plugin-api-types.md#paneattention)`>` - the command, if known

Fired when a command starts running in a pane. Without the [`ReadPaneContents`](./plugin-api-permissions.md#readpanecontents) permission, the command is always `None`.

---

## `CommandFinished`

```rust
Event::CommandFinished(PaneId, CommandOutcome)
```

**Required Permission:** [`ReadApplicationState`](./plugin-api-permissions.md)

**Payload:**
- [`PaneId`](./plugin-api-types.md#paneid) - the pane
- [`CommandOutcome`](./plugin-api-types.md#paneattention) - whether it succeeded, its exit code and how long it ran

Fired when a command finishes in a pane. Without the [`ReadPaneContents`](./plugin-api-permissions.md#readpanecontents) permission, `outcome.command` is `None`.

---

## `GlobalAttentionUpdate`

```rust
Event::GlobalAttentionUpdate(GlobalAttention)
```

**Required Permission:** [`ReadApplicationState`](./plugin-api-permissions.md)

**Payload:**
- [`GlobalAttention`](./plugin-api-types.md#globalattention) - the attention state of all running sessions on the machine

Fired when the attention state of any session changes. This is what the [inbox](./inbox.md) shows. Without the [`ReadPaneContents`](./plugin-api-permissions.md#readpanecontents) permission, the command text is left out.

---

## `SessionHistoryUpdate`

```rust
Event::SessionHistoryUpdate(SessionHistoryInfo)
```

**Required Permission:** [`ReadApplicationState`](./plugin-api-permissions.md)

**Payload:**
- [`SessionHistoryInfo`](./plugin-api-types.md#sessionhistoryinfo) - the sessions the user came from and can go back or forward to

Fired for each user when their session history changes (eg. after switching sessions).

---

## `SessionSuggestions`

```rust
Event::SessionSuggestions(SessionSuggestions)
```

**Required Permission:** [`ReadApplicationState`](./plugin-api-permissions.md)

**Payload:**
- [`SessionSuggestions`](./plugin-api-types.md#sessionsuggestions) - ranked sessions

The answer to [`get_session_suggestions`](./plugin-api-commands.md#get_session_suggestions). See [session suggestions](./session-suggestions.md).

---

## `SessionCountsUpdate`

```rust
Event::SessionCountsUpdate(SessionCounts)
```

**Required Permission:** [`ReadApplicationState`](./plugin-api-permissions.md)

**Payload:**
- [`SessionCounts`](./plugin-api-types.md#sessionsuggestions) - how many sessions are running, and how many resumable sessions match the current folder

Sent to plugins that asked for [session suggestions](./plugin-api-commands.md#get_session_suggestions), when these numbers change.

---

## `FolderSessionsUpdate`

```rust
Event::FolderSessionsUpdate(FolderSessions)
```

**Required Permission:** [`ReadApplicationState`](./plugin-api-permissions.md)

**Payload:**
- [`FolderSessions`](./plugin-api-types.md#sessionsuggestions) - the running and resumable sessions of the current folder

Sent together with [`SessionCountsUpdate`](#sessioncountsupdate).

---

## `TerminalCommandSubmitted`

```rust
Event::TerminalCommandSubmitted
```

**Required Permission:** [`ReadApplicationState`](./plugin-api-permissions.md)

Fired the first time the user submits input in a terminal pane of this session. A session where this never happened is considered unused (see [`switch_session_and_close_current`](./plugin-api-commands.md#switch_session_and_close_current)).

---

## `SessionPreview`

```rust
Event::SessionPreview(SessionPreview)
```

**Required Permission:** [`ReadPaneContents`](./plugin-api-permissions.md#readpanecontents)

**Payload:**
- [`SessionPreview`](./plugin-api-types.md#sessionpreview) - the text contents and layout of a running session

The answer to [`get_session_preview`](./plugin-api-commands.md#get_session_preview), [`get_session_preview_with_history`](./plugin-api-commands.md#get_session_preview_with_history) and [`get_session_pane_preview`](./plugin-api-commands.md#get_session_pane_preview).

---

## `SavedSessionPreview`

```rust
Event::SavedSessionPreview(SavedSessionPreview)
```

**Required Permission:** [`ReadApplicationState`](./plugin-api-permissions.md)

**Payload:**
- [`SavedSessionPreview`](./plugin-api-types.md#sessionpreview) - the folder, tabs and panes of a saved session

The answer to [`get_saved_session_preview`](./plugin-api-commands.md#get_saved_session_preview). Without the [`ReadPaneContents`](./plugin-api-permissions.md#readpanecontents) permission, the pane contents are left out.

---

## `LiveViewStateChanged`

```rust
Event::LiveViewStateChanged {
    target: Option<PaneAddress>,
    state: MirrorState,
    input_captured: bool,
    input_released_by: Option<LiveViewRelease>,
    resize_allowed: bool,
    view_only: bool,
    pinned: bool,
    source_size: Option<Size>,
    release_key: String,
}
```

**Required Permission:** [`ReadPaneContents`](./plugin-api-permissions.md#readpanecontents)

**Payload:**
- `target` - `Option<`[`PaneAddress`](./plugin-api-types.md#liveview)`>` - the pane shown, or `None` if there is no live view
- `state` - [`MirrorState`](./plugin-api-types.md#liveview) - `NoTarget`, `Connecting`, `Live` or `Closed(reason)`
- `input_captured` - `bool` - whether the user's input currently goes to the mirrored pane
- `input_released_by` - `Option<`[`LiveViewRelease`](./plugin-api-types.md#liveview)`>` - why input was last released, if it was
- `resize_allowed` - `bool` - whether the view may resize the program in the mirrored pane
- `view_only` - `bool` - whether the view accepts input at all
- `pinned` - `bool` - whether this view is the one currently deciding the size of the program in the mirrored pane
- `source_size` - `Option<Size>` - the size of the mirrored pane
- `release_key` - `String` - the key that gives input back to the plugin, for display

Fired for the plugin and user that own a [live view](./plugin-api-commands.md#set_live_view) whenever its state changes.

---

## `DesktopIntegration`

```rust
Event::DesktopIntegration(String)
```

**Required Permission:** [`ReadApplicationState`](./plugin-api-permissions.md)

**Payload:**
- `String` - the answer, as JSON

The answer to [`request_desktop_integration`](./plugin-api-commands.md#request_desktop_integration). For plugins that are not built in, this is always an error.
