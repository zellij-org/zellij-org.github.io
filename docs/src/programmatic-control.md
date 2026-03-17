# Programmatic Control

This page describes patterns for controlling Zellij from external processes — scripts, daemons, orchestration tools, or any program that needs to create terminal sessions, run commands, observe their output, and react to results without human interaction.

All of the primitives described here are documented individually elsewhere. This page consolidates them into a single reference oriented toward non-interactive, machine-driven use.

---

- [The Control Surface at a Glance](#the-control-surface-at-a-glance) — What can be queried, mutated, and observed
- [The Control Loop](#the-control-loop) — Create, command, observe, react
- [Waiting for Output Conditions](#waiting-for-output-conditions) — Block until a command finishes or output matches a pattern
- [Point-in-Time vs. Streaming Observation](#point-in-time-vs-streaming-observation) — When to snapshot, when to stream
- [Handling ANSI Escape Codes](#handling-ansi-escape-codes) — Preserving or excluding terminal styling for machine consumers
- [Structured Output Reference](#structured-output-reference) — Which commands produce JSON
- [Concurrency and Ordering](#concurrency-and-ordering) — Multiple processes controlling the same session

---

## The Control Surface at a Glance

Zellij exposes its entire control surface through `zellij action` subcommands and the `zellij subscribe` command. No socket, HTTP API, or library binding is required — all interaction occurs through subprocess invocation, and structured data is available as JSON on stdout.

The surface divides into four categories:

### Query (read state)

| Command | Output |
|---------|--------|
| [`list-panes --json`](./cli-actions.md#list-panes) | All panes: ID, type, title, command, cwd, focus, geometry, tab, exit status |
| [`list-tabs --json`](./cli-actions.md#list-tabs) | All tabs: ID, position, name, active state, layout, viewport dimensions |
| [`current-tab-info --json`](./cli-actions.md#current-tab-info) | Active tab details |
| [`list-clients`](./cli-actions.md#list-clients) | Connected clients and their focused panes |
| [`query-tab-names`](./cli-actions.md#query-tab-names) | All tab names (plain text) |
| [`dump-screen`](./cli-actions.md#dump-screen) | Point-in-time viewport/scrollback content |
| [`dump-layout`](./cli-actions.md#dump-layout) | Current session layout as KDL |

### Mutate (change state)

| Category | Key Commands |
|----------|-------------|
| Create | [`new-pane`](./cli-actions.md#new-pane), [`new-tab`](./cli-actions.md#new-tab), [`edit`](./cli-actions.md#edit), [`launch-plugin`](./cli-actions.md#launch-plugin) — all return the created ID |
| Close | [`close-pane`](./cli-actions.md#close-pane), [`close-tab`](./cli-actions.md#close-tab) |
| Input | [`write-chars`](./cli-actions.md#write-chars), [`write`](./cli-actions.md#write), [`paste`](./cli-actions.md#paste), [`send-keys`](./cli-actions.md#send-keys) — all accept `--pane-id` |
| Layout | [`override-layout`](./cli-actions.md#override-layout), [`next-swap-layout`](./cli-actions.md#next-swap-layout) |
| Appearance | [`rename-pane`](./cli-actions.md#rename-pane), [`rename-tab`](./cli-actions.md#rename-tab), [`set-pane-color`](./cli-actions.md#set-pane-color), [`set-pane-borderless`](./cli-actions.md#set-pane-borderless) |
| Positioning | [`change-floating-pane-coordinates`](./cli-actions.md#change-floating-pane-coordinates), [`toggle-pane-embed-or-floating`](./cli-actions.md#toggle-pane-embed-or-floating), [`toggle-pane-pinned`](./cli-actions.md#toggle-pane-pinned) |
| Visibility | [`show-floating-panes`](./cli-actions.md#show-floating-panes), [`hide-floating-panes`](./cli-actions.md#hide-floating-panes) |
| Session | [`rename-session`](./cli-actions.md#rename-session), [`switch-session`](./cli-actions.md#switch-session), [`save-session`](./cli-actions.md#save-session), [`detach`](./cli-actions.md#detach) |

### Observe (watch output)

| Command | Description |
|---------|-------------|
| [`subscribe --format json`](./zellij-subscribe.md) | Real-time NDJSON stream of rendered pane viewport content |
| [`subscribe`](./zellij-subscribe.md) | Real-time raw text stream of rendered pane viewport content |
| [`dump-screen`](./cli-actions.md#dump-screen) | One-shot viewport/scrollback snapshot |

### Block (synchronize)

| Flag | Behavior |
|------|----------|
| `new-pane --blocking` | Block caller until pane is closed |
| `new-pane --block-until-exit` | Block until command exits (any status) |
| `new-pane --block-until-exit-success` | Block until command exits with status 0 |
| `new-pane --block-until-exit-failure` | Block until command exits with non-zero status |

For the full reference of all 70+ actions, see the [CLI Actions](./cli-actions.md) page.

---

## The Control Loop

A typical programmatic workflow follows a create-command-observe-react loop:

### 1. Create a session

A headless session is created with `attach --create-background`, which starts a Zellij session without attaching a terminal to it:

```bash
zellij attach --create-background my-session
```

A custom [layout](./creating-a-layout.md) can be specified:
```bash
zellij attach --create-background my-session options --default-layout /path/to/layout.kdl
```

### 2. Open panes and capture their IDs

Pane and tab creation commands return the ID of the created resource on stdout:

```bash
PANE_ID=$(zellij --session my-session action new-pane --name "worker")
TAB_ID=$(zellij --session my-session action new-tab --name "tests")
```

### 3. Send commands to panes

Input is injected into specific panes by ID. The `paste` command uses bracketed paste mode, which is faster and handles multi-line input correctly:

```bash
zellij --session my-session action paste --pane-id $PANE_ID "cargo build" &&
zellij --session my-session action send-keys --pane-id $PANE_ID "Enter"
```

Note: the text passed to `paste` and `write-chars` is sent to whatever shell is running inside the pane. To avoid shell compatibility issues, panes can be opened with a command directly — the command is then executed as the pane's process, bypassing the shell entirely:

```bash
PANE_ID=$(zellij --session my-session action new-pane -- cargo build --release)
```

### 4. Observe output

The rendered viewport of any pane can be streamed in real time as NDJSON:

```bash
zellij --session my-session subscribe --pane-id $PANE_ID --format json
```

Or captured as a point-in-time snapshot:

```bash
zellij --session my-session action dump-screen --pane-id $PANE_ID --full
```

### 5. React and repeat

Based on observed output, subsequent actions can be issued — closing panes, opening new ones, sending further input, or tearing down the session.

### Complete example

```bash
#!/bin/bash

# --- Configuration (adjust these to your needs) ---
SESSION="build-pipeline"
LAYOUT="compact"
BUILD_CMD="cargo build --release"
TEST_CMD="cargo test"

# --- 1. Create headless session ---
zellij attach --create-background "$SESSION" options --default-layout "$LAYOUT"

# --- 2. Run the build (blocks until the command exits successfully) ---
zellij --session "$SESSION" action new-pane \
  --block-until-exit-success --name "build" \
  -- $BUILD_CMD

# --- 3. Run the tests and capture the output ---
TEST_PANE=$(zellij --session "$SESSION" action new-pane --name "tests" -- $TEST_CMD)

# Poll until the command finishes (pane will show "exited" status)
while true; do
  EXITED=$(zellij --session "$SESSION" action list-panes --json \
    | jq -r ".[] | select(.id == ${TEST_PANE#terminal_}) | .exited")
  if [ "$EXITED" = "true" ]; then
    break
  fi
  sleep 1
done

# Read the final output
zellij --session "$SESSION" action dump-screen --pane-id "$TEST_PANE" --full

# --- 4. Clean up ---
zellij --session "$SESSION" action close-pane --pane-id "$TEST_PANE"
```

---

## Waiting for Output Conditions

A common need in programmatic control is to wait until a command finishes or until specific output appears before proceeding.

### Blocking panes

The simplest approach — block the calling process until the command in the pane exits:

```bash
# Block until the command exits with status 0 (retry on failure by pressing Enter)
zellij --session my-session action new-pane --block-until-exit-success -- cargo test

# Block until the command exits regardless of status
zellij --session my-session action new-pane --block-until-exit -- cargo test
```

See [Blocking Panes](./cli-recipes.md#blocking-panes) in CLI Recipes for more details.

### Polling with dump-screen

When the pane must stay alive after the command finishes (e.g., it runs inside an interactive shell), poll the viewport for a pattern:

```bash
# Poll until "Finished" appears in the pane's viewport
while ! zellij action dump-screen --pane-id terminal_1 | grep -q "Finished"; do
  sleep 1
done
```

### Polling pane exit status

When a command was launched directly with `new-pane -- <command>`, its exit status is reflected in the pane metadata:

```bash
while true; do
  EXITED=$(zellij action list-panes --json \
    | jq -r ".[] | select(.id == ${PANE_ID#terminal_}) | .exited")
  if [ "$EXITED" = "true" ]; then
    break
  fi
  sleep 1
done

# Read the final output
zellij action dump-screen --pane-id "$PANE_ID" --full
```

### Streaming with subscribe

For real-time observation without polling, [`subscribe`](./zellij-subscribe.md) streams viewport changes as they happen:

```bash
zellij subscribe --pane-id terminal_1 --format json
```

This is useful for live monitoring and logging. See [Zellij Subscribe](./zellij-subscribe.md) for details and filtering examples.

---

## Point-in-Time vs. Streaming Observation

Two mechanisms exist for reading pane output. The right choice depends on the use case:

### `dump-screen` — Snapshot

```bash
zellij action dump-screen --pane-id terminal_1 --full
```

- Returns the current viewport (and optionally full scrollback with `--full`).
- One-shot: returns immediately with the current content and exits.
- Suitable for: polling at intervals, capturing final output after a command is known to have finished, debugging.
- ANSI styling can be included with `--ansi`, or omitted (default) for plain text.

### `subscribe` — Stream

```bash
zellij subscribe --pane-id terminal_1 --format json
```

- Delivers the current viewport immediately, then streams subsequent changes as they occur.
- Long-running: stays connected until the pane closes or the process is killed.
- Suitable for: real-time monitoring, waiting for specific output patterns, event-driven workflows.
- ANSI styling can be included with `--ansi`.

### Choosing between them

| Need | Use |
|------|-----|
| "What is on the screen right now?" | `dump-screen` |
| "Tell me when X appears" | `subscribe` + filtering |
| "Give me all output as it happens" | `subscribe` |
| "Capture the final result after completion" | `dump-screen --full` (after blocking pane unblocks) |
| Periodic polling (e.g., every 5 seconds) | `dump-screen` in a loop |

---

## Handling ANSI Escape Codes

Both `dump-screen` and `subscribe` strip ANSI escape sequences by default, returning plain text. The `--ansi` flag preserves color and styling sequences (but not cursor movement — the output is already rendered into lines).

### Excluding ANSI (default)

By default, both commands return plain text with no escape codes. This is generally what machine consumers want:

```bash
# Plain text — no escape codes
zellij action dump-screen --pane-id terminal_1
zellij subscribe --pane-id terminal_1
```

### Including ANSI

The `--ansi` flag preserves color and styling escape sequences in the output:

```bash
# Includes color and styling codes
zellij action dump-screen --pane-id terminal_1 --ansi
zellij subscribe --pane-id terminal_1 --ansi
```

This is useful when:
- The output needs to be displayed in another terminal with styling preserved.
- Color information carries semantic meaning (e.g., red text indicating errors in test output).

---

## Structured Output Reference

The following commands support `--json` output for machine consumption:

| Command | JSON Output Contains |
|---------|---------------------|
| [`list-panes --json`](./cli-actions.md#list-panes) | Array of pane objects: `id`, `is_plugin`, `is_focused`, `is_floating`, `title`, `pane_command`, `pane_cwd`, `exited`, `exit_status`, `pane_x`, `pane_y`, `pane_rows`, `pane_columns`, `tab_id`, `tab_name`, and more |
| [`list-tabs --json`](./cli-actions.md#list-tabs) | Array of tab objects: `tab_id`, `position`, `name`, `active`, `is_fullscreen_active`, `is_sync_panes_active`, `are_floating_panes_visible`, `active_swap_layout_name`, viewport dimensions, pane counts |
| [`current-tab-info --json`](./cli-actions.md#current-tab-info) | Single tab object (same fields as `list-tabs`) |
| [`subscribe --format json`](./zellij-subscribe.md) | NDJSON stream: `pane_update` events with `viewport[]` and `scrollback[]` arrays, `pane_closed` events |

Commands that return created resource IDs (plain text on stdout):

| Command | Returns |
|---------|---------|
| `new-pane` | Pane ID (e.g., `terminal_5`) |
| `new-tab` | Tab ID (e.g., `2`) |
| `edit` | Pane ID |
| `launch-plugin` | Pane ID |
| `launch-or-focus-plugin` | Pane ID |
| `go-to-tab-name --create` | Tab ID (when a new tab is created) |

Commands that use exit codes to communicate state:

| Command | Exit Codes |
|---------|-----------|
| `hide-floating-panes` | `0` = panes were hidden, `1` = no floating panes existed, `2` = panes were already hidden |
| `show-floating-panes` | `0` = panes were shown, `1` = no floating panes existed, `2` = panes were already visible |

---

## Concurrency and Ordering

When multiple processes issue CLI actions against the same session concurrently, the following considerations apply:

### Ordering

Each `zellij action` invocation is a separate subprocess that connects to the Zellij server, sends a message, and disconnects. Actions are processed by the server in the order they are received. When actions are issued sequentially from a single process (e.g., chained with `&&`), ordering is preserved. When issued concurrently from multiple processes, no ordering guarantee exists between them.

### Practical guidance

- **Chain dependent actions sequentially.** If action B depends on the result of action A, use `&&` or capture the output of A before issuing B:
  ```bash
  PANE_ID=$(zellij action new-pane) &&
  zellij action paste --pane-id "$PANE_ID" "echo hello" &&
  zellij action send-keys --pane-id "$PANE_ID" "Enter"
  ```

- **Independent actions can be parallelized safely.** Actions targeting different panes or tabs can be issued concurrently without conflict:
  ```bash
  zellij action paste --pane-id terminal_1 "make build" &
  zellij action paste --pane-id terminal_2 "make test" &
  wait
  ```

- **Avoid concurrent mutations to the same pane.** Two processes simultaneously writing to the same pane will interleave unpredictably. If multiple processes need to send input to the same pane, they should be serialized through a single control process.

- **Querying during mutations is safe.** `list-panes`, `list-tabs`, `dump-screen`, and other read operations can be issued at any time without interfering with concurrent mutations. The returned state reflects a consistent snapshot at the time of the query.

---

## Going Further

For individual command references and task-oriented scripting examples, see:
- [CLI Actions](./cli-actions.md) — Full reference of all `zellij action` subcommands
- [CLI Recipes & Scripting](./cli-recipes.md) — Task-oriented examples and common workflows
- [Zellij Subscribe](./zellij-subscribe.md) — Real-time pane output streaming
- [Zellij Run & Edit](./zellij-run-and-edit.md) — Launching commands and opening files in panes
- [Zellij Plugin & Pipe](./zellij-plugin-and-pipe.md) — Plugin communication from the CLI

For deeper integration, the [Plugin API](./plugin-api.md) provides access to 120+ commands and 52 event types from compiled WASM plugins, including structured lifecycle events (`CommandPaneExited`, `PaneUpdate`, `TabUpdate`) that are not available through the CLI.
